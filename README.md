# Keythe Rueckert, portfolio

Source of [keyportfolio.vercel.app](https://keyportfolio.vercel.app). Four cases, each with a working prototype:

| Case | Folder |
|---|---|
| Help center that answers where the question starts | `src/prototypes/help-center` |
| Prototypes checked against a design system | `src/prototypes/verified-prototypes` |
| Design system health dashboard | `src/prototypes/ds-dashboard` |
| Ad account assistant interface | `src/prototypes/ads-agent` |

Some data is real and some is invented; each case page says which, and what was and was not measured.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, Base UI and Radix primitives, TanStack Table, Motion.

## Run it

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Before `tsc --noEmit` on a fresh clone, run `pnpm typegen` (route types are generated).

## Structure

- `src/components/design-system`: the UI components the prototypes are built from.
- `src/prototypes`: one folder per case prototype.
- `src/stories/cases`: the case pages (text and framing around each prototype).
- `/system`: a small Storybook-style shell to browse components, with an axe accessibility check in the Inspector.

Next.js here is a version with breaking changes. See `AGENTS.md` before changing routes.
