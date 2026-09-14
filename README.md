# Mural Deck

A plug-and-play proposal deck builder for murals and other project pitches.
Assemble a proposal from reusable sections, preview it as a styled deck,
and send it as a shareable link or a downloadable PDF — no backend required.

## Features

- **Block-based editor** — mix and reorder sections (cover, about the artist,
  concept & vision, scope & timeline, budget, materials, past work, terms,
  approval & signature, or a fully custom block) since every project is
  different.
- **Drag-to-reorder** sidebar, with per-section show/hide and delete.
- **Theme picker** — five color/type presets to match different clients.
- **Content library** — save reusable bios, photos, and boilerplate text
  (terms, materials blurbs, etc.) once and insert them into any proposal
  instead of retyping them. Manage them on the *Content Library* page, or
  save/insert straight from a block editor.
- **Pricing estimator** — enter wall width/height, surface type, and a
  rate per square foot inside the Budget block, and it computes a suggested
  price (with a surface-difficulty multiplier for brick, stucco, wood, etc.)
  that you can drop straight into the line items.
- **Approve & sign** — an interactive "Approval & Signature" block lets a
  recipient viewing your share link type their name and approve. See
  [How approval works](#how-approval-works) below for the details.
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

## How approval works

This app has no backend, so there's no server that can notice when someone
opens a link or clicks "approve" and relay that back to you automatically.
Instead:

1. Your client opens your share link, types their name, and clicks
   **Approve Proposal**.
2. The app bakes that approval into a **new** link (a "confirmation link")
   and shows a button to email it to you, plus a copy-link fallback.
3. You take that confirmation link and click **Import approval** in the
   editor toolbar, paste it in, and the "✓ Approved by ..." badge appears
   on your working proposal (and from then on, in exports/shares of it).

The original share link you sent out is unaffected — approval only lives in
the confirmation link until you import it. If your client reloads your
*original* link, it will correctly show as not-yet-approved, since nothing
was ever stored anywhere except in that one confirmation link.

## Known limitations

- Images are embedded as base64 data URLs (no image hosting), so very
  large photos will bloat both `localStorage` and generated share links.
  Compress images before uploading for the smoothest experience.
- Proposals live in the browser's `localStorage` — clearing site data
  will remove saved drafts and your content library. Duplicate a proposal
  before experimenting if you want a backup.
- **View tracking is honest, not real analytics.** The small "first viewed
  on this device" note on a shared proposal is recorded in *that viewer's*
  browser only. There is no way, without a backend, for you to find out
  when or whether someone opened your link — this app does not pretend
  otherwise.
- Approval is manual-relay, not automatic (see above) — it requires your
  client to actually send the confirmation link back.

## Ideas to go further (would need a backend)

- Real cross-device view analytics (server-side ping on open).
- Automatic approval notifications without the client needing to send
  anything back.
- Multi-user accounts so a studio/team can share one proposal library.
