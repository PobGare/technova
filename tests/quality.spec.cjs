const { test, expect } = require('@playwright/test');
const courses = { web: 'Web Development', design: 'Graphic Design', ui: 'UI/UX Design', marketing: 'Digital Marketing', video: 'Video Editing' };
for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`${width}px: accessible flows and layout`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const noOverflow = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const dialog of await page.locator('dialog[open]').all()) {
        expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      }
    };
    await noOverflow();
    for (const [key, course] of Object.entries(courses)) {
      const trigger = page.locator(`[data-track="${key}"]`);
      await trigger.focus();
      await page.keyboard.press('Enter');
      const track = page.getByRole('dialog');
      await expect(track).toHaveAccessibleName(await page.locator('#trackTitle').innerText());
      await noOverflow();
      await page.getByRole('button', { name: 'Apply for this path' }).click();
      const apply = page.getByRole('dialog', { name: 'Tell us what you want to learn.' });
      await expect(apply).toBeVisible();
      await expect(page.getByRole('combobox', { name: /^Program/ })).toHaveValue(course);
      await expect(page.getByText('Portfolio demo — no application is sent or saved. Use sample details.')).toBeVisible();
      await noOverflow();
      // Native dialogs keep page controls inert; Chrome may focus browser chrome at the boundary.
      await page.getByRole('button', { name: 'Close application' }).focus();
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press('Tab');
        expect(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest('#applyDialog'))).toBe(true);
      }
      await page.getByRole('button', { name: 'Close application' }).focus();
      await page.keyboard.press('Escape');
      await expect(apply).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
    for (const course of Object.values(courses)) {
      await page.locator(`.program-ledger [data-apply-program="${course}"]`).click();
      await expect(page.getByRole('combobox', { name: /^Program/ })).toHaveValue(course);
      await page.getByRole('button', { name: 'Close application' }).click();
    }
    await page.locator('.header-apply').click();
    await page.getByRole('button', { name: 'Send application request' }).click();
    await expect(page.locator('#applyDialog')).toBeVisible();
    await page.getByLabel('Name', { exact: true }).fill('Sample Student');
    await page.getByLabel('Phone', { exact: true }).fill('555-0100');
    await page.getByLabel('Preferred time').selectOption('Morning');
    await page.getByRole('button', { name: 'Send application request' }).click();
    await expect(page.getByRole('status')).toHaveText('Demo complete — no application was sent or saved.');
    await expect(page.locator('#applyDialog')).not.toBeVisible();
    const tabs = page.getByRole('tab');
    await tabs.first().focus();
    for (const [key, day] of [['ArrowLeft', 'Sat'], ['ArrowRight', 'Mon'], ['End', 'Sat'], ['Home', 'Mon'], ['ArrowRight', 'Tue']]) {
      await page.keyboard.press(key);
      await expect(page.getByRole('tab', { name: day, exact: true })).toBeFocused();
      await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
      await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText(day);
      await expect(page.getByRole('tabpanel', { name: day, exact: true })).toBeVisible();
    }
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tabpanel')).toBeFocused();
    for (const tab of await tabs.all()) {
      await tab.click();
      await expect(page.getByRole('tabpanel')).toHaveAccessibleName(await tab.textContent());
      await expect(page.locator('.class-block')).toHaveCount(2);
    }
    for (const question of await page.locator('.faq-question').all()) {
      await question.focus();
      await page.keyboard.press('Enter');
      await expect(question).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('.faq-item.open')).toHaveCount(1);
      await page.keyboard.press('Space');
      await expect(question).toHaveAttribute('aria-expanded', 'false');
    }
    await expect(page.locator('#mobileNav')).toHaveJSProperty('inert', true);
    if (width <= 980) {
      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      await menu.focus();
      await page.keyboard.press('Enter');
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Tab');
      await expect(page.locator('#mobileNav a').first()).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(menu).toBeFocused();
      await menu.click();
      await page.locator('#mobileNav a').first().click();
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
    }
    await noOverflow();
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 80)); } scrollTo({ top: 0, behavior: 'instant' }); });
    await page.screenshot({ path: `test-results/layout-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}




