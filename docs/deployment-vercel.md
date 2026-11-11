# Vercel preview preparation — no deployment performed

This is a standard Next.js App Router application. It uses React 19, Node-compatible server-rendered `/parking/[id]` pages, and a client-only Leaflet component. It requires the Next.js runtime, not a static-export-only host. No database, API endpoint, filesystem writes, credentials, or paid service is needed. `npm run build` validates compilation and route generation, not an actual Vercel deployment.

## Before authorizing any preview

1. Review PR #1 and the public-source verification scope. No point is an entrance; parking candidates remain unverified and capacity/occupancy unknown. No institutional authorization is implied.
2. Complete [manual visual QA](visual-qa-checklist.md), especially basemap access from a trusted network. This environment has previously rejected tile certificates and encountered OSM service denial. Do not disable TLS verification, proxy tiles, rotate hosts to evade blocks, or switch services as an access workaround.
3. Choose an appropriate tile provider for the expected audience and obtain permission under its terms. The default standard OSM tile service is best effort and has no SLA. Review https://operations.osmfoundation.org/policies/tiles/ including visible attribution, browser identification/referrer, caching, traffic and no bulk/prefetch/offline download requirements. Never suppress the browser Referer. Do not set aggressive cache-busting or a referrer policy that conflicts with provider requirements.
4. If a public deployment needs another provider, select one whose terms expressly permit that independent deployment/use. Provider configuration is not a remedy for a blocked service. No alternative provider account or service has been connected in this sprint. Review any provider's cost/limits before setup; paid services need separate approval.

## Settings to use only after explicit deployment instruction

- Framework preset: **Next.js**.
- Root directory: repository root.
- Node.js: **22.x**, matching CI.
- Install: `npm ci`.
- Build: `npm run build` (optionally run validation first).
- Output directory: keep Next.js default; do not choose static export or override to `out`.
- Git branch: `sprint-1-campus-map`, preview environment only. Do not merge to trigger production.
- No sensitive environment variables. Do not import/connect Git integration or enable automatic deployments until deployment is explicitly authorized; importing a Vercel project can itself initiate a build/deployment.

The existing public GitHub source does not imply authorization to publish a hosted preview. This document prepares settings only.

## Optional public tile settings

Both variables must be set together in the Vercel **Preview** environment before building:

```text
NEXT_PUBLIC_MAP_TILE_URL=https://your-approved-provider.example/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_TILE_ATTRIBUTION=Required provider credit in plain text
```

The example host is a placeholder, not a configured provider. Omit both for the standard OSM default. URLs must use HTTPS and contain `{z}`, `{x}`, `{y}`; `{s}` subdomains are supported. Supply plain text credit (escaped by the app), alongside always-visible OSM attribution. If a provider requires other attribution formats/links or a different API, adapt the implementation and review terms before selecting it. Invalid or partial configuration disables tile requests and offers the list; it never silently changes providers.

`NEXT_PUBLIC_*` values are embedded into browser bundles at build time, visible to everyone, and require a rebuild when changed. Never put secret tokens, passwords, service-role keys or private URLs here. This sprint requires no keys. A future provider that mandates secrets requires a separate design and authorization, not pasting credentials into these variables. Browser requests go directly to the approved HTTPS tile URL; there is no tile proxy, automatic failover or backend tile cache.

## Local production check

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Check `/`, `/parking`, a real candidate such as `/parking/XT-P01`, a fictional detail such as `/parking/SIM-P02`, and an unknown ID. Validate on the intended preview hostname after deployment is separately authorized, including real tile imagery/attribution and source links.
