import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { config } from "../../config/config";

test.describe("Login", () => {
  let username: string;
  let email: string;
  let password: string;

  test.beforeAll(async ({ browser }) => {
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

  test("Login user with valid data", async ({ page }) => {
    await page.goto(config.baseUrl);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .getByRole("heading", { name: `User name: ${username}` })
      .waitFor();
    await page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(page).toHaveURL(/dashboard/);
  });

  test("Login user with invalid email", async ({ page }) => {
    const invalidEmail = faker.internet.email();

    await page.goto(config.baseUrl);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(invalidEmail);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByText("Unauthorized").waitFor();
    await page.getByRole("button", { name: "Back to Home" }).waitFor();
    await expect(page).toHaveURL(/unauthorized/);
  });

  test("Login user with invalid password", async ({ page }) => {
    const invalidPassword = faker.internet.password();

    await page.goto(config.baseUrl);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(invalidPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByText("Unauthorized").waitFor();
    await page.getByRole("button", { name: "Back to Home" }).waitFor();
    await expect(page).toHaveURL(/unauthorized/);
  });

  test("Login user with invalid email and password", async ({ page }) => {
    const invalidEmail = faker.internet.email();
    const invalidPassword = faker.internet.password();

    await page.goto(config.baseUrl);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(invalidEmail);
    await page.getByRole("textbox", { name: "Password" }).fill(invalidPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByText("Unauthorized").waitFor();
    await page.getByRole("button", { name: "Back to Home" }).waitFor();
    await expect(page).toHaveURL(/unauthorized/);
  });

  test("Login user with empty email", async ({ page }) => {
    const invalidEmail = "";

    await page.goto(config.baseUrl);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(invalidEmail);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByText("Bad Request").waitFor();
    await page.getByRole("button", { name: "Back to Home" }).waitFor();
    await expect(page).toHaveURL(/bad-request/);
  });

  test("Login user with empty password", async ({ page }) => {
    const invalidPassword = "";

    await page.goto(config.baseUrl);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(invalidPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByText("Bad Request").waitFor();
    await page.getByRole("button", { name: "Back to Home" }).waitFor();
    await expect(page).toHaveURL(/bad-request/);
  });

  test("Login user with empty email and password", async ({ page }) => {
    const invalidEmail = "";
    const invalidPassword = "";

    await page.goto(config.baseUrl);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(invalidEmail);
    await page.getByRole("textbox", { name: "Password" }).fill(invalidPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByText("Bad Request").waitFor();
    await page.getByRole("button", { name: "Back to Home" }).waitFor();
    await expect(page).toHaveURL(/bad-request/);
  });
});
