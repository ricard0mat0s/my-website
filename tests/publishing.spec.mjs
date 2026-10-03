import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdtemp, cp, symlink, writeFile, readFile, rm, readdir, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, extname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { publishedNotes, formatDate } from '../src/lib/publication';
import { noteSchema } from '../src/lib/note-schema';

const run = promisify(execFile);

test('publication dates and draft defaults', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Pure publishing checks run once.');
  const metadata = { title: 'Test', summary: 'A test fixture.', topics: ['Testing'] };
  expect(noteSchema.parse(metadata).draft).toBe(true);
  expect(noteSchema.safeParse({ ...metadata, draft: false }).success).toBe(false);
  expect(noteSchema.safeParse({ ...metadata, published: '2026-02-30' }).success).toBe(false);
  expect(noteSchema.safeParse({ ...metadata, published: '2026-02-20', updated: '2026-02-19' }).success).toBe(false);
  const entries = [
    { id: 'old', data: { draft: false, published: '2026-01-01' } },
    { id: 'draft', data: { draft: true, published: '2026-09-01' } },
    { id: 'future', data: { draft: false, published: '2026-10-01' } },
    { id: 'new', data: { draft: false, published: '2026-09-01' } },
  ];
  expect(publishedNotes(entries, '2026-09-26').map(entry => entry.id)).toEqual(['new', 'old']);
  expect(formatDate('2026-01-01')).toBe('1 Jan 2026');
});

for (const base of ['/', '/portfolio/']) {
test(`published content and navigation work at ${base}`, async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'An isolated fixture build runs once.');
  test.setTimeout(120_000);
  const root = await mkdtemp(join(tmpdir(), 'portfolio-publishing-'));
  try {
    // Test-only content never enters the real source collection or production dist.
    for (const path of ['src', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json']) {
      await cp(resolve(path), join(root, path), { recursive: true });
    }
    await symlink(resolve('node_modules'), join(root, 'node_modules'), 'dir');
    const notesDir = join(root, 'src/content/notes');
    await rm(notesDir, { recursive: true, force: true });
    await mkdir(notesDir);
    const fixture = (title, published, draft, kind, body) => `---\ntitle: ${title}\nsummary: Synthetic content used only to verify the publishing layout.\nkind: ${kind}\ntopics: [Testing, Markdown]\npublished: '${published}'\ndraft: ${draft}\nrelatedProject: personal-memory\n---\n${body}\n`;
    await writeFile(join(notesDir, 'test-article.md'), fixture('Test article with a deliberately long editorial heading', '2020-02-02', false, 'article', '## A test section\n\nThis fixture checks readable paragraphs, source links, and long-form layout.\n\n```js\nconst example = "A deliberately long line of code that should scroll inside the code block instead of widening the article or the page at narrow screen widths.";\n```\n\n## Another section\n\nA paragraph with a [related project](/projects/personal-memory/).\n\n![Fixture icon](/favicon.svg)'));
    await writeFile(join(notesDir, 'test-log.md'), fixture('Test experiment log', '2020-01-01', false, 'experiment', 'A short test log without section headings.'));
    await writeFile(join(notesDir, 'private-draft.md'), fixture('PRIVATE DRAFT SENTINEL', '2020-02-03', true, 'note', 'Private.'));
    await writeFile(join(notesDir, 'future-note.md'), fixture('FUTURE NOTE SENTINEL', '2999-01-01', false, 'note', 'Future.'));
    const projectFixture = (title, draft) => `---\ntitle: ${title}\ndescription: A synthetic second project to check portfolio growth.\nsubtitle: A separate project story.\nstatus: In development\nstack: Testing\ndraft: ${draft}\norder: 2\n---\nThis is an independent project with its own explanation.\n`;
    await writeFile(join(root, 'src/content/projects/test-project.md'), projectFixture('Test second project', false));
    await writeFile(join(root, 'src/content/projects/private-project.md'), projectFixture('PRIVATE PROJECT SENTINEL', true));
    await run(process.execPath, [resolve('node_modules/astro/bin/astro.mjs'), 'build'], { cwd: root, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', PAGES_BASE_PATH: base, PAGES_SITE_URL: 'https://ricard0mat0s.github.io' }, maxBuffer: 2_000_000 });
    const output = join(root, 'dist');
    expect((await readdir(join(output, 'writing'))).sort()).toEqual(['index.html', 'test-article', 'test-log']);
    const homepage = await readFile(join(output, 'index.html'), 'utf8');
    expect(homepage).not.toContain('PRIVATE DRAFT SENTINEL');
    expect(homepage).not.toContain('FUTURE NOTE SENTINEL');
    expect(homepage).not.toContain('PRIVATE PROJECT SENTINEL');
    expect((await readdir(join(output, 'projects'))).sort()).toEqual(['personal-memory', 'test-project']);
    expect(homepage.indexOf('Test article with')).toBeLessThan(homepage.indexOf('Test experiment log'));
    await page.route('http://127.0.0.1:4387/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (!pathname.startsWith(base)) {
        await route.fulfill({ status: 404, body: 'Outside the deployed base path' });
        return;
      }
      const path = '/' + pathname.slice(base.length);
      const filename = path.endsWith('/') ? `${path}index.html` : path;
      const types = { '.html': 'text/html', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml' };
      try { await route.fulfill({ body: await readFile(join(output, filename)), contentType: types[extname(filename)] || 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: 'Not found' }); }
    });
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base);
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://ricard0mat0s.github.io${base}`);
      await expect(page.locator('link[rel=icon]')).toHaveAttribute('href', `${base}favicon.svg`);
      await expect(page.getByRole('heading', { name: 'More things I’m building.' })).toBeVisible();
      await page.getByRole('link', { name: 'Test second project', exact: true }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Test second project');
      await expect(page.getByRole('link', { name: 'View the code' })).toHaveCount(0);
      await expect(page.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.goto(base);
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Writing' })).toBeVisible();
      await page.getByRole('link', { name: 'Read my notes' }).click();
      await expect(page.getByRole('heading', { name: 'Latest notes' })).toBeInViewport();
      await expect(page.locator('.note-row')).toHaveCount(2);
      await expect(page.locator('.note-row time').first()).toHaveText('2 Feb 2020');
      await page.getByRole('link', { name: 'Test article with a deliberately long editorial heading' }).click();
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Test article');
      await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
      await expect(page.locator('.article-body').getByRole('link', { name: 'related project', exact: true })).toHaveAttribute('href', `${base}projects/personal-memory/`);
      const icon = page.getByRole('img', { name: 'Fixture icon' });
      await expect(icon).toHaveAttribute('src', `${base}favicon.svg`);
      await expect.poll(() => icon.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
      await page.locator('.article-body').getByRole('link', { name: 'related project', exact: true }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('personal-memory');
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Projects', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${base}#projects$`));
      await page.goto(`${base}writing/test-article/`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
      await page.getByRole('link', { name: 'All writing', exact: false }).click();
      await expect(page.locator('.note-row')).toHaveCount(2);
      await page.getByRole('link', { name: 'Test experiment log', exact: true }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Test experiment log');
      await expect(page.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  } finally {
    // Only removes the temporary directory created by this test.
    await rm(root, { recursive: true, force: true });
  }
});
}
