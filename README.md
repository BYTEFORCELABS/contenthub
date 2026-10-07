# Cyberzik Content Hub

Internal tool for Cyberzik Technologies to capture content ideas, move them through production, schedule them and track what is published. A separate product from the Cyberzik Ledger, sharing its brand (Futura/Jost, deep brown / bronze / cream tokens, logo).

**Status: frontend prototype.** All data is mock data stored in the browser (`localStorage`). There is no backend, social-media integration, publishing, or real analytics yet.

## Run

```
npm install
npm run dev     # http://127.0.0.1:3100
npm run check   # typecheck, lint, build
```

## Structure

- `src/lib/store.ts`: the only place state changes (`hub.*`). Replace this module to connect a backend.
- `src/lib/seed.ts`: realistic mock content, campaigns, pillars and assets.
- `src/lib/types.ts`: data model. An idea is a content item whose status is `idea`.
- `src/components/`: shared UI (badges, filters, content card, dialogs, shell) and one folder per feature.
- `src/app/`: routes: dashboard, ideas, content, board, content/[id], calendar, campaigns, library, analytics, settings.

## Not built yet

File storage (library uploads are metadata only), analytics APIs, publishing, AI repurposing, auth, dark mode (follows the Ledger).
