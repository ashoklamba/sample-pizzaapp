import { test, expect } from "@playwright/test";

test("homepage loads featured pizzas", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Build a pizza that crackles."
  );

  const pizzaCards = page.locator(".pizza-card:not(.skeleton)");
  await expect(pizzaCards.first()).toBeVisible();

  const cardCount = await pizzaCards.count();
  expect(cardCount).toBeGreaterThan(0);

  const optionCount = await page.locator("#pizza-select option").count();
  expect(optionCount).toBeGreaterThan(0);
});

test("can place an order and see confirmation", async ({ page }) => {
  await page.goto("/");

  await page.locator(".pizza-card:not(.skeleton)").first().waitFor();
  const firstOption = page.locator("#pizza-select option").first();
  const firstValue = await firstOption.getAttribute("value");

  await page.getByLabel("Name").fill("Avery");
  if (firstValue) {
    await page.getByLabel("Pizza").selectOption(firstValue);
  }
  await page.getByLabel("Quantity").fill("2");

  await page.getByRole("button", { name: "Fire it up" }).click();

  const receipt = page.locator("#order-receipt");
  await expect(receipt).toContainText("Order confirmed");
  await expect(receipt).toContainText("Pickup in 15 minutes");
});
