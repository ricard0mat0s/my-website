# Publish on GitHub Pages

The site builds with Astro and deploys through GitHub Actions. Only the generated `dist/` artifact goes to Pages. Dependencies, build output, local agent folders, environment files, and browser artifacts are ignored by Git.

## First publication

1. Create an **empty public repository** on GitHub under `ricard0mat0s`. Use `portfolio` for `https://ricard0mat0s.github.io/portfolio/`, or `ricard0mat0s.github.io` for `https://ricard0mat0s.github.io/`. Do not initialize it with a README, license, or `.gitignore`; the local repository already contains files and an initial commit.
2. In the new repository, open **Settings → Pages → Build and deployment → Source**, then select **GitHub Actions**.
3. Connect the local repository and push. For a repository named `portfolio`:

   ```sh
   git remote add origin https://github.com/ricard0mat0s/portfolio.git
   git push -u origin main
   ```

   Change the repository name in that URL if you chose a different name. GitHub will ask you to authenticate if your Git credentials are not configured.

4. Open **Actions → Deploy portfolio to GitHub Pages** and wait for the build and deploy jobs to finish. The deployment URL appears on the run and in **Settings → Pages**.

If the first run happened before Pages was configured, use **Actions → Deploy portfolio to GitHub Pages → Run workflow** after completing step 2.

## How deployment works

Every push to `main` triggers `.github/workflows/deploy.yml`. It installs the lockfile dependencies with `npm ci`, runs Astro's type check, builds, and deploys the static artifact. No personal access token or custom repository secret is needed for deployment; the workflow uses GitHub's built-in token and Pages environment.

`actions/configure-pages` supplies the site's origin and repository path. Navigation, project links, writing links, Markdown links, images, fonts, favicon, and canonical URLs use this base. No source edits are needed when choosing between an account site and a repository site. Custom domains can be configured later through Pages and DNS; the workflow will use the configured origin on its next run.

For future changes:

```sh
git add .
git commit -m "Describe the change"
git push
```

Draft Markdown is excluded from the generated website, **but any committed draft remains visible in the public repository**. Keep private writing outside this checkout. The contact information currently in the site is intentionally public.

## Test the repository URL locally

On Bash-compatible shells, build as if the site were hosted under `/portfolio/`:

```sh
PAGES_SITE_URL=https://ricard0mat0s.github.io PAGES_BASE_PATH=/portfolio npm run build
PAGES_SITE_URL=https://ricard0mat0s.github.io PAGES_BASE_PATH=/portfolio npm run preview
```

Open the preview URL with `/portfolio/` appended. An ordinary `npm run build` returns to local root-path output.

Use site-root paths such as `/projects/personal-memory/` in Markdown. The build adds the deployment prefix; do not hard-code `/portfolio/` into content. External URLs, `mailto:` links, and `#section` anchors remain unchanged.

Sources: [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) and [GitHub's Astro starter workflow](https://github.com/actions/starter-workflows/blob/main/pages/astro.yml).
