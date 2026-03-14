# Open Zirndorf Apps

Shared React component library for Open Zirndorf apps.

## Workspace

- `workers/*`: Cloudflare Workers for app-specific edge backends.
- `packages/trpc/*`: shared tRPC API contract packages for app-specific worker/frontend communication.
- `packages/ui`: shared components, hooks, utilities, and shadcn configuration.
- `packages/trpc/garagen-flohmarkt`: shared Garagen-Flohmarkt API contract package with tRPC router types.
- `apps/storybook`: Storybook docs and visual review surface for the library.
- `.github/workflows`: CI and release automation.

## Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm storybook
pnpm build-storybook
```

## GitHub Actions

- `CI` validates lint, typecheck, tests, package builds, and Storybook builds on pull requests and `main`.
- `Publish Packages` runs on `main` via Changesets, opens or updates a release PR when needed, and publishes scoped packages to GitHub Packages once versions are ready.
- `Deploy Apps` discovers deployable apps under `apps/`, builds each one with `pnpm --filter <package> build`, assigns a repository-aware base path, and publishes them to GitHub Pages under per-app subpaths.

Cloudflare Workers are intentionally kept outside `apps/` so the GitHub Pages deploy workflow only picks up static frontend apps.

### GitHub Packages

This workspace is configured to publish `@openzirndorf/*` packages from the `openzirndorf/openzirndorf-apps` repository to GitHub Packages.

Consumers installing from GitHub Packages need an `.npmrc` entry for the package scope. Authentication can be provided with `NODE_AUTH_TOKEN` or a user-level npm config entry when installing or publishing:

```ini
@openzirndorf:registry=https://npm.pkg.github.com
```

## shadcn workflow

Add or update components from inside the UI package:

```bash
pnpm --filter @openzirndorf/ui exec shadcn add button
```

Keep generated primitives in `packages/ui/src/components/ui` and build branded compositions in `packages/ui/src/components/patterns`.
