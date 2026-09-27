# Ricardo’s portfolio — implementation brief

This document captures the decisions Ricardo approved during a design interview. It is a self-contained handoff for another model to implement the first version. The interview is complete; use these decisions without repeating discovery questions. Details explicitly marked as implementation discretion remain open to reasonable design judgment.

## Purpose and audience

Create Ricardo’s personal home on the web: a central place to discover what he is building, studying, learning, and finding interesting. His main motivation is to share his ideas and passion for using technology to solve real problems.

The primary audience is fellow builders and readers interested in his ideas. The primary success outcome is meaningful conversations sparked by his work and interests.

This is broader than a blog or résumé. Writing is one part of the eventual site, alongside finished projects, experiments, notes, and potentially content recommendations. Topics can change with Ricardo’s interests and current work, with software development and related subjects as the main thread. Do not constrain the site to a fixed niche.

## First-release scope

Build one homepage with this reading order:

1. A brief personal introduction.
2. What Ricardo is currently building, featuring personal-memory.
3. A small “currently exploring” section.
4. Contact links and an invitation to connect.

Personal-memory’s explanation belongs on the homepage and links to its public GitHub repository. It does not need a separate project page at launch.

Launch in English only. Ricardo eventually wants English and Portuguese, but translation and a language selector are outside the first release.

Use typography for the introduction, with no portrait needed at launch. Launch in light mode only.

Do not populate the site with invented projects, articles, achievements, testimonials, metrics, employers, or placeholder publications. Future sections for notes, experiments, and recommendations should appear when substantive content exists, rather than as empty launch sections.

## Approved introduction

Ricardo approved this wording:

> I’m Ricardo, an undergraduate researcher building AI solutions for companies and government. I’m passionate about creating software that solves real problems and sharing what I learn along the way.

His preferred public display name is **Ricardo**. His personal goals are to keep building software and share his knowledge with others. Use a personal, first-person voice with careful editing. Preserve the meaning of the approved introduction; do not inflate credentials or add unsupported biographical details.

## Featured project: personal-memory

### Motivation

Ricardo repeatedly has to reconstruct information between AI sessions and agents. A concrete example: when using AI to build his résumé, he must supply a summary of his projects even though much of that work was already done with AI assistance.

The project addresses that continuity problem by connecting agents to persistent Markdown files through an MCP server. Broader company information-management challenges interest Ricardo, but the homepage should lead with this specific personal problem rather than claim validated company-wide outcomes.

### Approved short explanation

> AI helps me build software, but carrying that context between sessions and agents still takes work. I’m building personal-memory, an MCP server that connects agents to persistent Markdown files. Agents can search, read, and propose updates; applying changes requires my approval.

### Capabilities and status

Ricardo described four operations:

- Search.
- Read.
- Propose an update.
- Apply an update.

Applying an update to a Markdown file still requires his approval. Another agent can retrieve information through the `read_memory` tool. Do not invent exact tool identifiers for the other operations or suggest that all agents automatically remember everything.

At the time of the interview, the project was nearing release and had a public repository. Present it as **currently building**, not as a mature or widely adopted product. Repository contents have not been inspected as part of this brief. Verify the repository before adding technical claims beyond the user-provided description above.

Repository: <https://github.com/ricard0mat0s/personal-memory>

## Currently exploring

Ricardo approved these two initial entries:

- **AI-assisted development:** experimenting with skills, workflows, and prompts to make development more efficient.
- **Software engineering:** studying concepts and preparing explanations to share here.

Keep these as short homepage entries. They do not need separate pages at launch. Do not imply that explanatory articles already exist.

Ricardo intends to update the site occasionally and will try to do so weekly. This is an intention, not a public publishing commitment. If showing an update date, use an actual content update date rather than automatically making old content appear fresh.

## Contact and conversation

Use these exact destinations:

| Destination | Address |
| --- | --- |
| Email | `matosricardordg@gmail.com` |
| Email link | `mailto:matosricardordg@gmail.com` |
| GitHub | <https://github.com/ricard0mat0s> |
| LinkedIn | <https://www.linkedin.com/in/ricard0mat0s/> |
| Project repository | <https://github.com/ricard0mat0s/personal-memory> |

Email and social media are the chosen conversation channels. Use a natural invitation to discuss shared interests or the project. A contact form, on-site comments, newsletter, or discussion system is not part of the agreed launch scope.

## Design direction

The guiding qualities are **clarity and craftsmanship**. The site should have a quiet foundation with occasional playful moments. Make it feel personal, thoughtful, and easy to read.

Approved visual decisions:

- Warm off-white background.
- Dark text.
- One restrained, muted blue accent.
- Expressive, carefully composed typography and generous spacing.
- Subtle glass treatment on navigation.
- Squircle-inspired shapes where appropriate.
- Subtle hover and focus interactions.
- Respect for reduced-motion preferences.
- Light mode only for the first release.

Glass, rounded shapes, and motion should support the hierarchy and interaction. Keep text readable over translucent surfaces. Project demonstrations can provide playful moments in the future when they communicate something meaningful; a fabricated or elaborate demo is not required for launch.

Exact typefaces, color values, spacing, breakpoints, navigation placement, and layout composition are implementation discretion. Choose them consistently with the approved direction. No final mockup or exact component arrangement has been approved.

### User-supplied inspiration

- Fabiano’s portfolio: <https://fabianomag.com/>
- Anthropic websites: <https://www.anthropic.com/>
- OpenAI’s website: <https://openai.com/>
- Apple’s website and products: <https://www.apple.com/>

Ricardo particularly admires Apple’s Liquid Glass, squircle forms, and overall design quality. Use these references as inspiration for an original personal site, not as templates to copy wholesale. Fabiano’s site could not be accessed during the initial research, so no specific claims about its layout or details were established. The other websites were consulted at a content level; there was no complete visual audit.

## Technical decisions and content maintenance

- Use **Astro with a static build**.
- Maintain content through **Markdown and Git**.
- Keep editable copy and exploration entries easy to find and update; a small configuration file may hold structured details such as social links.
- No browser-based CMS is required.
- Allow later growth into writing, experiments, recommendations, and bilingual content without implementing those features prematurely.
- Hosting, domain, and deployment platform remain undecided. Local implementation and verification are the next scope; deployment requires a separate decision.

At handoff, `/home/ricardo/portfolio` contained no application source files. There is no existing frontend implementation or established design system to preserve. Inspect the current workspace and applicable project instructions before starting, since the checkout may change after this document is written.

## Implementation quality and verification

These are practical completion criteria for the agreed design:

- The page clearly introduces Ricardo and makes his current work and interests easy to discover.
- All approved launch content is present and accurate.
- The project feature links to the actual repository, and contact links use the exact destinations above.
- The layout works comfortably on mobile and desktop without overflow.
- Navigation, links, and controls work with keyboard input and have visible focus states.
- Use semantic headings and readable contrast, including in the glass navigation.
- Respect reduced motion and keep important content available without animation.
- Confirm the static production build succeeds and inspect the rendered page at mobile and desktop sizes when browser tooling is available.
- Include concise instructions for local development, building, and updating content in the implementation handoff.

## Next step for the implementing model

Implement and verify the first local version using this brief. Resolve routine implementation details autonomously within the agreed scope. Do not repeat the completed design interview or treat future possibilities as launch requirements. Report what was built, what was verified, and any genuine remaining limitations. Do not deploy or publish the site as part of the local implementation.

The present handoff task was only to write this document; no site implementation or deployment has been performed.
