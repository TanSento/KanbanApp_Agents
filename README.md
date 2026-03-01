# Kanban Project Manager

A single-board Kanban web app: five columns, cards with title and details, drag-and-drop between columns and reorder within a column. Add and delete cards; rename column titles. No login, no persistence (in-memory only).

## Run locally

From the project root:

```bash
cd frontend && npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and test

- **Build:** `cd frontend && npm run build`
- **Unit tests:** `cd frontend && npm run test`
- **E2E tests:** `cd frontend && npx playwright install` (once), then `cd frontend && npm run test:e2e`

## Tech

- Next.js 15 (App Router), React 19, TypeScript
- Drag-and-drop: @dnd-kit
- Tests: Vitest (unit), Playwright (e2e)

Built with Cursor Agents as practice for agentic coding.
