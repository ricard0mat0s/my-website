# Adding projects

The homepage gives one featured project a compact visual story. Other published projects appear automatically in a “More things I’m building” list below it, each linking to its own page. That list stays hidden while there is only one project.

## Add another project

Create `src/content/projects/your-project.md`. The filename becomes `/projects/your-project/`. Start with real details:

```yaml
---
title: Your project name
description: A short explanation of the problem and your approach.
subtitle: The idea behind the project.
status: In development
stack: The technologies you actually use
repository: https://github.com/your-account/your-project
draft: true
order: 2
---
```

Write the story below the frontmatter. Explain the problem, what you built, one meaningful decision, and what remains open. Use `##` headings for a longer write-up; the page builds its contents navigation automatically. `repository` is optional. Lower `order` numbers appear first in the homepage list.

Set `draft: false` when ready, then build again. Drafts default to hidden and generate no public page or homepage link. Review with `npm run check`, `npm run build`, and `npm run preview` before deploying.

## Change the featured story

`src/content/home/project.md` selects the featured project's filename with its `project` field. It holds three short chapters (problem, approach, approval), captions, and the closing paragraph. The build reports an error if the selected project is missing or a draft.

The current illustrations in `src/components/StoryVisual.astro` are specific to personal-memory. When featuring a different project, rewrite its homepage chapters **and adapt the illustrations and stage names to that project's actual story**. Changing the project ID alone does not retell the story. Ordinary additional projects do not require illustration or layout changes.

All project pages share `src/pages/projects/[slug].astro`. Adding a project does not require another route component. Existing personal-memory URLs and its source-grounded write-up remain intact.
