# Publishing notes

The homepage shows the three newest published entries as a simple editorial list. `/writing/` holds the full archive. Short notes, experiment logs, and articles use the same Markdown collection and reading layout; a contents list appears only when the body has second-level headings.

## Write a draft

Create a descriptive, lowercase, hyphenated filename in `src/content/notes/`. Its filename becomes the URL: `memory-review.md` becomes `/writing/memory-review/`. Avoid `index.md`, which conflicts with the archive.

Start with this structure, replacing the instructions with real content:

```yaml
---
title: Your actual title
summary: A short description of what the reader will learn.
kind: note
topics:
  - Your topic
draft: true
---
```

Write the body below the closing `---`. Use `##` for sections; the page supplies the title as its only `h1`. Markdown supports paragraphs, lists, links, quotes, images, tables, and fenced code. A short experiment log does not need headings.

- `kind`: `note`, `experiment`, or `article`.
- `topics`: one to four lightweight labels, not filter buttons.
- `relatedProject: personal-memory`: optional link at the end of the note.
- `draft`: defaults to `true`. Drafts have no public page or list entry, including in the local development site. Read the Markdown in your editor until it is ready.

## Publish deliberately

When the writing is ready, set `draft: false` and add `published: 'YYYY-MM-DD'` using the real publication date. Quote dates. There is no automatically generated publication date. Invalid or missing dates fail validation for published entries.

The next build adds the note page, homepage entry, archive entry, Writing navigation, and “Read my notes” hero link. Lists sort newest first. Dates in the future stay out of the static output; a new build on or after the chosen UTC date is required to publish them. This is not a background scheduling service.

For a substantive revision, optionally add `updated: 'YYYY-MM-DD'`. It must be on or after the original publication date. Corrections do not automatically make an old note look newly published.

Run `npm run check`, `npm run build`, and `npm run preview`. Review the full page and the homepage summary before committing. After GitHub Pages setup, pushing to `main` deploys the site automatically; see the [deployment guide](deployment.md). Keep unpublished sensitive material out of a public Git repository even when `draft: true`.

## No notes yet

The collection intentionally contains no articles or invented dates. The homepage omits the entire notes section until the first entry is published. That first publication adds the notes section between the projects and contact invitation, together with Writing navigation and the hero writing link. The directly accessible writing archive still explains the empty state. Astro currently logs an empty-collection warning for this intentional state; the build still succeeds.

The automated publishing test creates clearly synthetic content only in a temporary project directory. It verifies both an article and a short experiment log, then removes that temporary directory. The real `src/content/notes/` and `dist/` stay free of those fixtures.
