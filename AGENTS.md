<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Astryx UI/UX reference

The repository-local Astryx skill is at `.agents/skills/astryx/SKILL.md`; read it for Astryx/UI tasks. The pinned development tools are available through `npm run astryx -- <command>` (Node22.13+), not a global installation. Begin with `npm run astryx -- search '<topic>'` and read the matching docs/components.

This installation prepares tooling only. Astryx UI initialization, theme imports and component migration have not been performed. For later UI tasks, improve the existing app incrementally; inspect init/scaffold changes before applying them and use `work/` for template experiments. Preserve Vietnamese accessibility, B2 data/provenance, real/demo boundaries and real multiplayer behavior. Do not rebuild the application or trigger deployments as part of skill maintenance.
