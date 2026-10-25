import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

test('adapter cache produces public search URLs and a usable index', async () => {
  const root = await mkdtemp(join(tmpdir(), 'docs-search-'));
  try {
    const cache = join(root, '.next/server/route-cache/APP_PAGE/cache-key/$');
    await mkdir(join(cache, 'nested'), { recursive: true });
    await writeFile(join(cache, 'nested/topic.html'), '<html lang="en"><head><title>Topic</title></head><body data-pagefind-body>Search fixture</body></html>');
    await writeFile(join(cache, '_not-found.html'), '<html><body>Not found</body></html>');
    const script = fileURLToPath(new URL('./index-search.mjs', import.meta.url));
    const output = execFileSync(process.execPath, [script], { cwd: root, env: { ...process.env, VERCEL: '1' }, encoding: 'utf8' });
    assert.match(output, /Indexed \/nested\/topic\n/);
    assert.match(output, /Indexed 1 documentation pages/);
    assert.ok((await readFile(join(root, '.next/output/static/_pagefind/pagefind.js'))).length > 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
