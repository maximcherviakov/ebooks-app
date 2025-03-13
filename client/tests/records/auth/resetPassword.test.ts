import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { config } from "../../config/config";

test.describe("Reset password", () => {
  let username: string;
  let email: string;
  let password: string;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    username = faker.internet.username();
    email = faker.internet.email();
    password = faker.internet.password();

    await page.goto(config.baseUrl);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("link", { name: "Sign up" }).click();
    await page.getByRole("textbox", { name: "Username" }).fill(username);
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign up" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();

    await expect(page).toHaveURL(/dashboard/);

    await page.close();
  });

  test("Reset password with valid data", async ({ page }) => {
    const newPassword = faker.internet.password();

    await page.goto(config.baseUrl);

    // Login user
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(page).toHaveURL(/dashboard/);

    // Reset password
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByLabel("Current Password").fill(password);
    await page.getByLabel("New Password", { exact: true }).fill(newPassword);
    await page.getByLabel("Confirm New Password").fill(newPassword);
    await page.getByRole("button", { name: "Update Password" }).click();

    await page
      .locator(".MuiAlert-colorSuccess .MuiAlert-message", {
        hasText: "Password successfully updated",
      })
      .waitFor();

    // Logout user
    await page.getByRole("link", { name: "Logout" }).click();
    await expect(page).toHaveURL(config.baseUrl);

    // Login user again with new password
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(newPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(page).toHaveURL(/dashboard/);
  });

  test("Reset password with invalid data: wrong original password", async ({
    page,
  }) => {
    const invalidPassword = faker.internet.password();
    const newPassword = faker.internet.password();

    await page.goto(config.baseUrl);

    // Login user
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(page).toHaveURL(/dashboard/);

    // Reset password
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByLabel("Current Password").fill(invalidPassword);
    await page.getByLabel("New Password", { exact: true }).fill(newPassword);
    await page.getByLabel("Confirm New Password").fill(newPassword);
    await page.getByRole("button", { name: "Update Password" }).click();

    await page.getByText("Unauthorized").waitFor();
    await expect(page).toHaveURL(/unauthorized/);
  });

  test("Reset password with invalid data: too short new password", async ({
    page,
  }) => {
    const newPassword = "passw";

    await page.goto(config.baseUrl);

    // Login user
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(page).toHaveURL(/dashboard/);

    // Reset password
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByLabel("Current Password").fill(password);
    await page.getByLabel("New Password", { exact: true }).fill(newPassword);
    await page.getByLabel("Confirm New Password").fill(newPassword);
    await page.getByRole("button", { name: "Update Password" }).click();

    await page
      .locator("#newPassword-helper-text.Mui-error", {
        hasText: "Password must be at least 6 characters long",
      })
      .waitFor();
    await expect(page).toHaveURL(/dashboard\/settings/);
  });

  test("Reset password with invalid data: new passwords do not match", async ({
    page,
  }) => {
    const newPassword1 = faker.internet.password();
    const newPassword2 = faker.internet.password();

    await page.goto(config.baseUrl);

    // Login user
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(page).toHaveURL(/dashboard/);

    // Reset password
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByLabel("Current Password").fill(password);
    await page.getByLabel("New Password", { exact: true }).fill(newPassword1);
    await page.getByLabel("Confirm New Password").fill(newPassword2);
    await page.getByRole("button", { name: "Update Password" }).click();

    await page
      .locator("#confirmPassword-helper-text.Mui-error", {
        hasText: "Passwords do not match",
      })
      .waitFor();
    await expect(page).toHaveURL(/dashboard\/settings/);
  });

  test("Reset password with invalid data: original password is empty", async ({
    page,
  }) => {
    const emptyPassword = "";
    const newPassword = faker.internet.password();

    await page.goto(config.baseUrl);

    // Login user
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(page).toHaveURL(/dashboard/);

    // Reset password
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByLabel("Current Password").fill(emptyPassword);
    await page.getByLabel("New Password", { exact: true }).fill(newPassword);
    await page.getByLabel("Confirm New Password").fill(newPassword);
    await page.getByRole("button", { name: "Update Password" }).click();

    await page
      .locator("#currentPassword-helper-text.Mui-error", {
        hasText: "Please enter your current password",
      })
      .waitFor();
    await expect(page).toHaveURL(/dashboard\/settings/);
  });

  test("Reset password with invalid data: new password is empty", async ({
    page,
  }) => {
    const emptyPassword = "";

    await page.goto(config.baseUrl);

    // Login user
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(page).toHaveURL(/dashboard/);

    // Reset password
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByLabel("Current Password").fill(password);
    await page.getByLabel("New Password", { exact: true }).fill(emptyPassword);
    await page.getByLabel("Confirm New Password").fill(emptyPassword);
    await page.getByRole("button", { name: "Update Password" }).click();

    await page
      .locator("#newPassword-helper-text.Mui-error", {
        hasText: "Password must be at least 6 characters long",
      })
      .waitFor();
    await expect(page).toHaveURL(/dashboard\/settings/);
  });
});
