# Kanban

Single-board Kanban prototype. Next.js + Tailwind + @dnd-kit. No persistence — refresh resets the board.

## Develop

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm run typecheck
npm run test          # vitest unit tests
npm run test:e2e      # playwright (builds + serves on port 3137)
```

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- @dnd-kit for drag-and-drop
- Vitest + Testing Library for unit tests
- Playwright for end-to-end tests
