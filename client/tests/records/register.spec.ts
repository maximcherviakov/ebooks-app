import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { config } from "../config/config";

test("Register user", async ({ page }) => {
  const username = faker.internet.username();
  const email = faker.internet.email();
  const password = faker.internet.password();

  await page.goto(config.baseUrl);

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill(username);
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByRole("heading", { name: `User name: ${username}` }).waitFor();
  await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();

  await expect(page).toHaveURL(/dashboard/);
});
