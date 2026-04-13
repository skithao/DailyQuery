import { test, expect } from '@playwright/test';

test.describe('DailyQuery App QA Exploration', () => {

  test.beforeEach(async ({ page }) => {
    // Load the web app
    await page.goto('http://127.0.0.1:1420');
  });

  test('Global Navigation & UI Elements', async ({ page }) => {
    // Should default redirect to Chat
    await expect(page).toHaveURL(/.*\/chat/);

    // Sidebar navigation check
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(3);
    await expect(navLinks.nth(0)).toContainText(/对话|Chat/);
    await expect(navLinks.nth(1)).toContainText(/资讯|Feed/);
    await expect(navLinks.nth(2)).toContainText(/设置|Settings/);

    // Theme toggle test
    const themeBtn = page.locator('button[title="Toggle Theme"]');
    await themeBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark|light/);

    // Language toggle test
    const langBtn = page.locator('button[title="Toggle Language"]');
    await langBtn.click();
    await page.waitForTimeout(500); // wait for state
    const newLangText = await navLinks.nth(0).innerText();
    expect(['Chat', '对话'].some(l => newLangText.includes(l))).toBeTruthy();
  });

  test('Chat Functionality (Mocked)', async ({ page }) => {
    // Send a message
    const textarea = page.locator('textarea[placeholder*="输入"], textarea[placeholder*="Type"]');
    await textarea.fill('hello');
    await page.keyboard.press('Enter');

    // Check if user message appears
    const messages = page.locator('.flex-1 > div > div > div.whitespace-pre-wrap');
    await expect(messages.last()).toContainText('hello');
    
    // Check if AI replies
    await page.waitForTimeout(1500);
    const newMessagesCount = await messages.count();
    expect(newMessagesCount).toBeGreaterThan(2); // Initial + User + Reply
  });

  test('Feed Page RSS Fetch', async ({ page }) => {
    await page.goto('http://127.0.0.1:1420/feed');
    
    // Wait for the feed to load
    await page.waitForTimeout(3000);
    
    // Check if feed items are rendered
    const articles = page.locator('h2 a');
    const articleCount = await articles.count();
    expect(articleCount).toBeGreaterThan(0);
    
    // Check fetch latest button
    const fetchBtn = page.locator('button', { hasText: /获取最新|Fetch Latest/ });
    await fetchBtn.click();
    await expect(fetchBtn).toBeDisabled(); // Should disable while fetching
    await page.waitForTimeout(3000);
  });

  test('Settings Page Authentication', async ({ page }) => {
    await page.goto('http://127.0.0.1:1420/settings');
    
    // Try wrong password
    const pwdInput = page.locator('input[type="password"]');
    await pwdInput.fill('wrongpwd');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('form')).toContainText(/密码错误|Invalid password/);
    
    // Try correct password (mock fallback in web mode)
    await pwdInput.fill('admin123');
    await page.locator('button[type="submit"]').click();
    
    // Should show config panel
    await expect(page.locator('h2')).toContainText(/智能体配置|Agent Config/);
    
    // Check slider
    const slider = page.locator('input[type="range"]');
    await slider.fill('1.5');
    
    // Save
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('form')).toContainText(/保存成功|Saved|Mock/);
  });
});