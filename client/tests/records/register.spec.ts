import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { config } from "../config/config";

test.describe("Registration", () => {
  test("Register user with valid data", async ({ page }) => {
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
    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();

    await expect(page).toHaveURL(/dashboard/);
  });

  test("Register user with invalid name", async ({ page }) => {
    const username = "te";
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
    await page
      .locator("#username-helper-text.Mui-error", {
        hasText: "Username must be at least 3 characters long.",
      })
      .waitFor();

    await expect(page).toHaveURL(/signup/);
  });

  test("Register user with invalid name: empty", async ({ page }) => {
    const username = "";
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
    await page
      .locator("#username-helper-text.Mui-error", {
        hasText: "Please enter a username.",
      })
      .waitFor();

    await expect(page).toHaveURL(/signup/);
  });

  test("Register user with invalid email: no @", async ({ page }) => {
    const username = faker.internet.username();
    const email = "test.com";
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
    await page
      .locator("#email-helper-text.Mui-error", {
        hasText: "Please enter a valid email address.",
      })
      .waitFor();

    await expect(page).toHaveURL(/signup/);
  });

  test("Register user with invalid email: no .", async ({ page }) => {
    const username = faker.internet.username();
    const email = "test@testcom";
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
    await page
      .locator("#email-helper-text.Mui-error", {
        hasText: "Please enter a valid email address.",
      })
      .waitFor();

    await expect(page).toHaveURL(/signup/);
  });

  test("Register user with invalid email: not full email", async ({ page }) => {
    const username = faker.internet.username();
    const email = "@test.com";
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
    await page
      .locator("#email-helper-text.Mui-error", {
        hasText: "Please enter a valid email address.",
      })
      .waitFor();

    await expect(page).toHaveURL(/signup/);
  });

  test("Register user with invalid email: empty", async ({ page }) => {
    const username = faker.internet.username();
    const email = "";
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
    await page
      .locator("#email-helper-text.Mui-error", {
        hasText: "Please enter a valid email address.",
      })
      .waitFor();

    await expect(page).toHaveURL(/signup/);
  });

  test("Register user with invalid password: too short", async ({ page }) => {
    const username = faker.internet.username();
    const email = faker.internet.email();
    const password = "passw";

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
    await page
      .locator("#password-helper-text.Mui-error", {
        hasText: "Password must be at least 6 characters long.",
      })
      .waitFor();

    await expect(page).toHaveURL(/signup/);
  });

  test("Register user with invalid password: empty", async ({ page }) => {
    const username = faker.internet.username();
    const email = faker.internet.email();
    const password = "";

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
    await page
      .locator("#password-helper-text.Mui-error", {
        hasText: "Password must be at least 6 characters long.",
      })
      .waitFor();

    await expect(page).toHaveURL(/signup/);
  });
});
