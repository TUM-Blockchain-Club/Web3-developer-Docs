# Dependency maintenance

Keep Next.js and eslint-config-next on the same patched release; React and React DOM share an exact version. Use pnpm and the committed pnpm-lock.yaml. The npm lockfile is superseded by this lockfile.

Install with `pnpm install --frozen-lockfile --ignore-scripts`, then run the available build, lint, typecheck and test scripts. Audit with `pnpm audit`. Verify builds with synthetic configuration; keep database, email and blockchain mutations out of dependency checks.

Security overrides in pnpm-workspace.yaml pin patched indirect dependencies where parent packages still select an affected version. Review overrides when upgrading their parents; do not replace incompatible major versions merely to clear an audit.

Nextra 4.6.1 removes children from its layout props before parsing the theme configuration, but its schema still requires that property under patched Zod. The versioned pnpm patch omits children from that configuration schema while keeping the other validations. Keep Zod patched; remove this package patch only after an upstream fix passes build and the documentation/404 HTTP checks. Search indexing runs explicitly in the build command with the locked Pagefind package.
