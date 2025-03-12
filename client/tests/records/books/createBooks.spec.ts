import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { config } from "../../config/config";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

test.describe("Create book", () => {
  let username: string;
  let email: string;
  let password: string;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

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

  test("Add new book with valid data", async ({ page }) => {
    const bookTitle = faker.lorem
      .words({ min: 2, max: 5 })
      .replace(/^\w/, (c) => c.toUpperCase());
    const bookDescription = faker.lorem.paragraph();
    const bookAuthor = faker.person.fullName();
    const bookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const bookGenres = ["Science Fiction", "Fantasy"];

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

    // Add new book
    await page.getByRole("link", { name: "My Books" }).click();
    await page.getByRole("link", { name: "Add book" }).click();

    await page.getByRole("textbox", { name: "Title" }).fill(bookTitle);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(bookDescription);
    await page.getByRole("textbox", { name: "Author" }).fill(bookAuthor);
    await page.getByRole("spinbutton", { name: "Year" }).fill(bookYear);
    await page.getByRole("combobox").click();
    for (const genre of bookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book1.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Add new book" }).click();

    // Check if book is added
    await expect(page).toHaveURL(/dashboard\/books/);

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    // Check book details
    await bookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: bookTitle }).waitFor();
    await page.getByText(bookDescription).waitFor();
    await page.getByText(bookAuthor).waitFor();
    await page.getByText(bookYear).waitFor();
    for (const genre of bookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("link", { name: "Download" }).waitFor();
    await page.getByRole("button", { name: "Read Online" }).waitFor();

    await page.goBack();

    // Remove book
    await bookCard.hover();

    const deleteButton = bookCard.locator("[data-testid='DeleteOutlinedIcon']");
    await deleteButton.waitFor();
    await deleteButton.click();
    await page
      .locator(".MuiDialog-container .MuiBox-root button")
      .filter({ hasText: "Delete" })
      .click();
    await expect(bookCard).not.toBeVisible();
  });

  test("Add new book with valid data: no description", async ({ page }) => {
    const bookTitle = faker.lorem
      .words({ min: 2, max: 5 })
      .replace(/^\w/, (c) => c.toUpperCase());
    const bookAuthor = faker.person.fullName();
    const bookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const bookGenres = ["Science Fiction", "Fantasy"];

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

    // Add new book
    await page.getByRole("link", { name: "My Books" }).click();
    await page.getByRole("link", { name: "Add book" }).click();

    await page.getByRole("textbox", { name: "Title" }).fill(bookTitle);
    await page.getByRole("textbox", { name: "Author" }).fill(bookAuthor);
    await page.getByRole("spinbutton", { name: "Year" }).fill(bookYear);
    await page.getByRole("combobox").click();
    for (const genre of bookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book1.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Add new book" }).click();

    // Check if book is added
    await expect(page).toHaveURL(/dashboard\/books/);

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    // Check book details
    await bookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: bookTitle }).waitFor();
    await page.getByText(bookAuthor).waitFor();
    await page.getByText(bookYear).waitFor();
    for (const genre of bookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("link", { name: "Download" }).waitFor();
    await page.getByRole("button", { name: "Read Online" }).waitFor();

    await page.goBack();

    // Remove book
    await bookCard.hover();

    const deleteButton = bookCard.locator("[data-testid='DeleteOutlinedIcon']");
    await deleteButton.waitFor();
    await deleteButton.click();
    await page
      .locator(".MuiDialog-container .MuiBox-root button")
      .filter({ hasText: "Delete" })
      .click();
    await expect(bookCard).not.toBeVisible();
  });

  test("Add new book with invalid data: title is empty", async ({ page }) => {
    const bookDescription = faker.lorem.paragraph();
    const bookAuthor = faker.person.fullName();
    const bookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const bookGenres = ["Science Fiction", "Fantasy"];

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

    // Add new book
    await page.getByRole("link", { name: "My Books" }).click();
    await page.getByRole("link", { name: "Add book" }).click();

    await page
      .getByRole("textbox", { name: "Description" })
      .fill(bookDescription);
    await page.getByRole("textbox", { name: "Author" }).fill(bookAuthor);
    await page.getByRole("spinbutton", { name: "Year" }).fill(bookYear);
    await page.getByRole("combobox").click();
    for (const genre of bookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book1.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Add new book" }).click();

    // Check for error message
    await expect(page).toHaveURL(/book\/create/);
    await page
      .locator(".Mui-error", { hasText: "Title is required" })
      .waitFor();
  });

  test("Add new book with invalid data: author is empty", async ({ page }) => {
    const bookTitle = faker.lorem
      .words({ min: 2, max: 5 })
      .replace(/^\w/, (c) => c.toUpperCase());
    const bookDescription = faker.lorem.paragraph();
    const bookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const bookGenres = ["Science Fiction", "Fantasy"];

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

    // Add new book
    await page.getByRole("link", { name: "My Books" }).click();
    await page.getByRole("link", { name: "Add book" }).click();

    await page.getByRole("textbox", { name: "Title" }).fill(bookTitle);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(bookDescription);
    await page.getByRole("spinbutton", { name: "Year" }).fill(bookYear);
    await page.getByRole("combobox").click();
    for (const genre of bookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book1.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Add new book" }).click();

    // Check for error message
    await expect(page).toHaveURL(/book\/create/);
    await page
      .locator(".Mui-error", { hasText: "Author is required" })
      .waitFor();
  });

  test("Add new book with invalid data: year is empty", async ({ page }) => {
    const bookTitle = faker.lorem
      .words({ min: 2, max: 5 })
      .replace(/^\w/, (c) => c.toUpperCase());
    const bookDescription = faker.lorem.paragraph();
    const bookAuthor = faker.person.fullName();
    const bookGenres = ["Science Fiction", "Fantasy"];

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

    // Add new book
    await page.getByRole("link", { name: "My Books" }).click();
    await page.getByRole("link", { name: "Add book" }).click();

    await page.getByRole("textbox", { name: "Title" }).fill(bookTitle);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(bookDescription);
    await page.getByRole("textbox", { name: "Author" }).fill(bookAuthor);
    await page.getByRole("combobox").click();
    for (const genre of bookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book1.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Add new book" }).click();

    // Check for error message
    await expect(page).toHaveURL(/book\/create/);
    await page.locator(".Mui-error", { hasText: "Year is required" }).waitFor();
  });

  test("Add new book with invalid data: genres are empty", async ({ page }) => {
    const bookTitle = faker.lorem
      .words({ min: 2, max: 5 })
      .replace(/^\w/, (c) => c.toUpperCase());
    const bookDescription = faker.lorem.paragraph();
    const bookAuthor = faker.person.fullName();
    const bookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();

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

    // Add new book
    await page.getByRole("link", { name: "My Books" }).click();
    await page.getByRole("link", { name: "Add book" }).click();

    await page.getByRole("textbox", { name: "Title" }).fill(bookTitle);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(bookDescription);
    await page.getByRole("textbox", { name: "Author" }).fill(bookAuthor);
    await page.getByRole("spinbutton", { name: "Year" }).fill(bookYear);

    const bookPath = path.join(__dirname, "../../attachments/book1.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Add new book" }).click();

    // Check for error message
    await expect(page).toHaveURL(/book\/create/);
    await page.getByText("At least one genre is required").waitFor();
  });

  test("Add new book with invalid data: no file", async ({ page }) => {
    const bookTitle = faker.lorem
      .words({ min: 2, max: 5 })
      .replace(/^\w/, (c) => c.toUpperCase());
    const bookDescription = faker.lorem.paragraph();
    const bookAuthor = faker.person.fullName();
    const bookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const bookGenres = ["Science Fiction", "Fantasy"];

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

    // Add new book
    await page.getByRole("link", { name: "My Books" }).click();
    await page.getByRole("link", { name: "Add book" }).click();

    await page.getByRole("textbox", { name: "Title" }).fill(bookTitle);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(bookDescription);
    await page.getByRole("textbox", { name: "Author" }).fill(bookAuthor);
    await page.getByRole("spinbutton", { name: "Year" }).fill(bookYear);
    await page.getByRole("combobox").click();
    for (const genre of bookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Add new book" }).click();

    // Check for error message
    await expect(page).toHaveURL(/book\/create/);
    await page.getByText("File is required").waitFor();
  });
});
