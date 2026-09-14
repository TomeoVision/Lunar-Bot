# Mural Deck

A plug-and-play proposal deck builder for murals and other project pitches.
Assemble a proposal from reusable sections, preview it as a styled deck,
and send it as a shareable link or a downloadable PDF — no backend required.

## Features

- **Block-based editor** — mix and reorder sections (cover, about the artist,
  concept & vision, scope & timeline, budget, materials, past work, terms,
  or a fully custom block) since every project is different.
- **Drag-to-reorder** sidebar, with per-section show/hide and delete.
- **Theme picker** — five color/type presets to match different clients.
- **Shareable link** — the whole proposal is compressed into the URL itself,
  so opening `#/view?d=...` renders a read-only deck with no server or
  database involved.
- **One-click PDF export** — renders the current deck to a downloadable,
  multi-page PDF.
- **Local persistence** — proposals autosave to `localStorage` and show up
  in a library screen (duplicate, rename, delete).

## Getting started

```bash
npm install
npm run dev
```

## Known limitations

- Images are embedded as base64 data URLs (no image hosting), so very
  large photos will bloat both `localStorage` and generated share links.
  Compress images before uploading for the smoothest experience.
- Proposals live in the browser's `localStorage` — clearing site data
  will remove saved drafts. Duplicate a proposal before experimenting if
  you want a backup.

## Ideas to go further

- A reusable content library (saved bios, past-work photos, standard
  terms) you can drop into any proposal instead of retyping them.
- A pricing calculator that estimates labor/materials from wall
  dimensions.
- Client-facing acceptance ("approve & sign") built into the share link.
- View analytics on shared links (opened / time spent).
