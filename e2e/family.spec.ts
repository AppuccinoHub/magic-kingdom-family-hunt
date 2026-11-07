import { expect, test } from "@playwright/test";

async function overflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test("phone screens, shared hunt, and one full-card celebration", async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Our family adventure" })).toBeVisible();
  await page.screenshot({ path: "/opt/cursor/artifacts/welcome-mobile.png" });
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await overflow(page), `welcome ${width}`).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });

  await page.getByRole("button", { name: "Start a new family hunt" }).click();
  await page.locator("#family-name").fill("The Patel family");
  await page.getByRole("button", { name: "Create our hunt" }).click();
  const code = (await page.getByTestId("family-code").innerText()).trim();
  await page.getByRole("link", { name: "Open the bingo card" }).click();
  await expect(page.getByTestId("stamp-count")).toHaveText("0");
  await page.locator("article").getByText("Take a pic with the castle", { exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/opt/cursor/artifacts/board-mobile.png" });
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await overflow(page), `board ${width}`).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });

  await page.getByRole("tab", { name: "Big list" }).click();
  await expect(page.getByRole("heading", { name: "Take a pic with the castle" })).toBeVisible();
  await page.getByRole("heading", { name: "Take a pic with the castle" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/opt/cursor/artifacts/list-mobile.png" });
  expect(await overflow(page)).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: "Read the steps" }).first().click();
  await expect(page.getByTestId("card-words")).toHaveText("Take a pic with the castle");
  await page.screenshot({ path: "/opt/cursor/artifacts/detail-mobile.png" });
  expect(await overflow(page)).toBeLessThanOrEqual(1);
  await page.getByRole("button", { name: "Back" }).click();

  await page.getByRole("tab", { name: "Passport" }).click();
  await page.screenshot({ path: "/opt/cursor/artifacts/passport-mobile.png" });
  expect(await overflow(page)).toBeLessThanOrEqual(1);

  const other = await browser.newContext();
  const otherPage = await other.newPage();
  const outsider = await otherPage.request.get("/api/hunt");
  expect(outsider.status()).toBe(401);
  await otherPage.goto("/");
  await otherPage.getByRole("button", { name: "Join with a family code" }).click();
  await otherPage.locator("#family-code").fill(code);
  await otherPage.getByRole("button", { name: "Join the hunt" }).click();
  await expect(otherPage.getByRole("heading", { name: "The Patel family" })).toBeVisible();

  for (let index = 0; index < 25; index += 1) {
    const saved = await page.request.post("/api/hunt/stamps", { data: { index, done: true } });
    expect(saved.ok()).toBeTruthy();
  }
  await expect(page.getByTestId("found-everything")).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("heading", { name: "You found everything!" })).toBeVisible();
  await page.getByRole("heading", { name: "You found everything!" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/opt/cursor/artifacts/found-everything-mobile.png" });
  await page.getByRole("button", { name: "Back to memories" }).click();
  await expect(page.getByTestId("found-everything")).toBeHidden();
  await page.reload();
  await expect(page.getByTestId("found-everything")).toHaveCount(0);
  await page.getByRole("tab", { name: "Passport" }).click();
  await page.getByTestId("replay-celebration").click();
  await expect(page.getByRole("heading", { name: "You found everything!" })).toBeVisible();
  await otherPage.reload();
  await expect(otherPage.getByTestId("stamp-count")).toHaveText("25", { timeout: 10000 });
  await other.close();
});

test("reduced motion keeps the full-card party still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Start a new family hunt" }).click();
  await page.locator("#family-name").fill("The Rivera family");
  await page.getByRole("button", { name: "Create our hunt" }).click();
  await page.getByRole("link", { name: "Open the bingo card" }).click();
  await expect(page.getByTestId("stamp-count")).toHaveText("0");
  for (let index = 0; index < 25; index += 1) {
    expect((await page.request.post("/api/hunt/stamps", { data: { index, done: true } })).ok()).toBeTruthy();
  }
  await expect(page.getByTestId("found-everything")).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("confetti")).toHaveCount(0);
  await expect(page.getByTestId("static-stars")).toBeVisible();
  await expect(page.locator(".firework-once")).toHaveCount(0);
  await page.screenshot({ path: "/opt/cursor/artifacts/found-everything-still.png" });
});
