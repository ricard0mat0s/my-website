import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function noOverflow(page: import('@playwright/test').Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('homepage', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I build software around');
  await expect(page.getByText('I’m an undergraduate researcher', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Skip to content' })).not.toBeInViewport();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Writing' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read my notes' })).toBeVisible();
  await expect(page.locator('#writing')).toBeVisible();
  await expect(page.locator('#exploring')).toHaveCount(0);
  await expect(page.locator('.more-projects')).toHaveCount(0);
  await expect(page.getByRole('figure')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Help me remember. Let me decide.' })).toBeVisible();
  await expect(page.locator('#writing time')).toHaveText('3 Oct 2026');
  await expect(page.locator('#writing').getByRole('link', { name: 'The best moment to be alive' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Say hello' })).toHaveAttribute('href', 'mailto:matosricardordg@gmail.com');
  await expect(page.locator('.contact-links').getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/ricard0mat0s');
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/ricard0mat0s/');
  await page.getByRole('link', { name: 'Here’s what I’m building' }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.getByRole('heading', { name: 'Why am I explaining this again?', exact: true })).toBeInViewport();
  await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click();
  await expect(page.getByRole('heading', { name: 'Let’s compare notes.' })).toBeInViewport();
  await noOverflow(page);
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/layouts/home-${testInfo.project.name}.png`, fullPage: true });
});

test('published note', async ({ page }) => {
  await page.goto('/writing/the-best-moment-to-be-alive/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The best moment to be alive');
  await expect(page.locator('.article-body')).toContainText('pair-programming guide');
  await expect(page.locator('.article-body').getByRole('link', { name: 'personal-memory' })).toHaveAttribute('href', '/projects/personal-memory/');
  await noOverflow(page);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('project reading and sources', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Read the project', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/personal-memory\/$/);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('personal-memory');
  await expect(page.getByRole('link', { name: 'View the code' })).toHaveAttribute('href', 'https://github.com/ricard0mat0s/personal-memory');
  for (const name of ['The problem', 'The approach', 'Current status', 'Design lessons']) {
    await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name, exact: true }).click();
    await expect(page.getByRole('heading', { name, exact: true })).toBeInViewport();
  }
  await noOverflow(page);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.goto('/projects/personal-memory/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/layouts/project-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.getByRole('heading', { name: 'Why am I explaining this again?', exact: true })).toBeInViewport();
});

test('keyboard access and reduced motion without JavaScript', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  for (const path of ['/', '/projects/personal-memory/', '/writing/']) {
    await page.goto(`http://127.0.0.1:4387${path}`);
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).not.toBeInViewport();
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    expect(await skip.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await expect(skip).not.toBeInViewport();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle)).toBe('solid');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    if (path === '/') {
      await expect(page.getByRole('heading', { name: 'Help me remember. Let me decide.' })).toBeVisible();
      await expect(page.getByText('My review & approval')).toBeVisible();
      expect(await page.locator('.story-visual').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    }
    await noOverflow(page);
  }
  await context.close();
});
