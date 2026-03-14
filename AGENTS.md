# AGENTS.md

## Project Purpose

This repository is the shared React component library for Open Zirndorf.

Primary goals:
- build reusable branded UI primitives and patterns
- keep multiple apps aligned on one corporate identity
- use shadcn as the component generation workflow, not as the source of truth
- use Storybook as the documentation and visual review surface

## Keep This File Lean

Keep only repo-specific rules and non-obvious workflow requirements here.

Prefer discovering ordinary file layout, component inventory, and implementation details directly from the repository instead of documenting them in this file.

Treat this file as a living document. If an agent repeats the same avoidable mistake across tasks, amend this file with the smallest clear instruction that would have prevented it.

## Design Source Of Truth

The visual source of truth is `open-zirndorf.pen`.

The extracted token scope currently in use is intentionally narrow:
- `Accent = Default`
- `Base = Neutral`
- `Mode = Light | Dark`

Ignore the other accent and base theme variants unless the project explicitly expands into multi-theme support.

## Component And Token Workflow

When designing new components or changing design tokens, follow this order:
- update `open-zirndorf.pen` first and treat it as the source of truth for visual decisions
- then create or update the implementation in `packages/ui`
- use shadcn as the starting point for component source when it fits, then adapt the result to the Open Zirndorf design system
- finish by adding or updating Storybook stories so every new component, token-driven variant, or relevant state has an example in `apps/storybook`

## Implementation Rules

- generate primitives in `packages/ui/src/components/ui`
- keep higher-level compositions in `packages/ui/src/components/patterns`
- shared CSS tokens live in `packages/ui/src/styles/globals.css`
- Cloudflare Worker services live in `workers/*`; shared app contracts and schemas live in `packages/*`
- `:root` contains the default neutral light tokens and `.dark` contains the default neutral dark tokens
- tokens must be extracted from the `.pen` file, not invented locally
- do not treat raw shadcn output as finished design-system code
- after generation, align spacing, radius, typography, and colors to the `.pen` design
- Storybook stories should render against the same token contract as app consumers

- shadcn v4 expects `aliases.utils` in `packages/ui/components.json`
- `packages/ui/src/lib/utils.ts` currently re-exports `cn` for that reason

## Component Conventions

Current button design was adapted from the `.pen` file reusable button components.

Button specs learned from the design:
- pill radius
- 14px semibold label
- 8px gap
- default padding: `12px 22px`
- large padding: `14px 24px`
- default fill uses the extracted primary token
- secondary and outline variants map to the extracted neutral token set

When rebuilding or adding primitives, prefer matching the `.pen` reusable components over generic shadcn defaults.

## Validation Expectations

After changing UI components, tokens, or Storybook config, validate with:
- `corepack pnpm lint`
- `corepack pnpm build`

When Storybook-related files change, also run:
- `corepack pnpm build-storybook`
