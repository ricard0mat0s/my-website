# Ricardo’s portfolio and notebook

A static Astro site with Markdown content, locally bundled fonts, and no client-side JavaScript. The original [brief](PORTFOLIO-BRIEF.md) supplies the biographical facts; the publishing, project-page, and story-led homepage improvements extend that first-release scope.

## Local development

Use Node.js 24 (see `.nvmrc`) and npm. With nvm installed, run `nvm use` first.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321`. The development server listens on all interfaces for workspace previews.

```sh
npm run check
npm run build
npm run preview
```

The production output is `dist/`. A GitHub Actions workflow deploys it to GitHub Pages on pushes to `main` after Pages is enabled. Follow the [deployment guide](docs/deployment.md) to create the public repository, push the code, and enable publishing. It supports both an account site and a repository subpath automatically.

## Content and publishing

- `src/content/home/`: introduction, three featured-story chapters, and contact copy.
- `src/content/projects/`: reusable project pages. Add a Markdown file to publish another project; see the [project guide](docs/projects.md).
- `src/content/exploring/`: retained interest entries, currently not displayed on the homepage.
- `src/content/notes/`: notes, experiment logs, and articles. Currently empty.
- `src/config.ts`: public name, metadata, and contact destinations.
- `src/styles/global.css`: typography, spacing, colors, and responsive layouts.

Follow the [publishing guide](docs/publishing.md) to add a draft and publish it deliberately. Notes have validated metadata, real editorial dates, topic labels, optional update dates, and optional project links. Draft and future-dated notes generate no public page. Writing navigation and the hero writing action appear with the first published entry.

The homepage hides “Latest notes” until the first post is published. It introduces Ricardo, then tells a short problem → approach → approval story through three conceptual illustrations. Additional projects appear in a compact list below the featured story, and the page closes with a personal invitation. Astro logs expected empty-collection warnings until content exists. No fabricated articles, dates, or results are shipped.

See [project source notes](docs/project-sources.md) for the evidence behind technical claims. The memory illustration remains conceptual.

## Verification and layouts

```sh
npx playwright install chromium
npm test
```

The browser suite checks the homepage and project page at 320, 390, 768, and 1440 pixels: overflow, anchors, keyboard focus, skip-link visibility, no-JavaScript operation, reduced motion, and automated WCAG A/AA checks through axe. Screenshots are saved under `artifacts/layouts/`.

A separate temporary build verifies published articles and short logs, ordering, date validation, draft/future exclusion, conditional navigation, and reading layouts. Test posts never enter the real content collection or production build. The publishing checks run once; duplicate runs for other viewport projects are intentionally skipped.

The suite includes a temporary second project to check that additional project pages and the homepage list work without exposing drafts. No synthetic content is added to the real portfolio. The story revision passes the type check, production build, and the browser/publishing checks. Homepage screenshots were reviewed at all four viewport sizes; no horizontal overflow or axe A/AA violations were found in the tested pages.

On Linux, use `npx playwright install --with-deps chromium` to install the browser and its system dependencies. Browser tests use localhost port 4387. Automated accessibility results supplement manual visual review and do not constitute a complete accessibility audit.

Publishing checks build temporary fixtures at both `/` and `/portfolio/` to verify root and GitHub Pages repository URLs. They cover draft exclusion, project pages, writing, Markdown links, and canonical URLs.
