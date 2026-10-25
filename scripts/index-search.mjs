import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import * as pagefind from 'pagefind';

function checked(result) {
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  return result;
}

async function* htmlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield path;
  }
}

try {
  const { index } = checked(await pagefind.createIndex());
  let count = 0;
  if (process.env.VERCEL === '1') {
    const source = '.next/server/route-cache/APP_PAGE';
    for await (const file of htmlFiles(source)) {
      // The adapter stores each route under <cache key>/$/<route>.html.
      const route = relative(source, file).split('/$/')[1];
      if (!route) throw new Error('Unexpected Next.js route-cache layout');
      if (route.startsWith('_')) continue;
      const url = '/' + route.replace(/\.html$/, '').replace(/(^|\/)index$/, '');
      const result = checked(await index.addHTMLFile({ url, content: await readFile(file, 'utf8') }));
      if (result.file.url !== url) throw new Error('Search URL does not match the page route');
      console.log('Indexed', url);
      count++;
    }
  } else {
    count = checked(await index.addDirectory({ path: '.next/server/app' })).page_count;
  }
  if (!count) throw new Error('No documentation pages found for search');
  const outputPath = process.env.VERCEL === '1' ? '.next/output/static/_pagefind' : 'public/_pagefind';
  checked(await index.writeFiles({ outputPath }));
  console.log(`Indexed ${count} documentation pages`);
} finally {
  await pagefind.close();
}
