import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { config } from "../../config/config";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

test.describe("Book details", () => {
  let username: string;
  let email: string;
  let password: string;
  const bookTitle = faker.lorem.words(1).replace(/^\w/, (c) => c.toUpperCase());
  const bookDescription = faker.lorem.paragraph();
  const bookAuthor = faker.person.fullName();
  const bookYear = faker.date
    .between({ from: "1900-01-01", to: new Date() })
    .getFullYear()
    .toString();
  const bookGenres = ["Science Fiction", "Fantasy"];

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
    await page.getByText(bookAuthor).waitFor();
    await page.getByText(bookYear).waitFor();
    for (const genre of bookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("link", { name: "Download" }).waitFor();
    await page.getByRole("button", { name: "Read Online" }).waitFor();

    await page.close();
  });

  test.afterEach(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

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

    await page.getByRole("link", { name: "My Books" }).click();

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

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

  test("Check book details: online reader", async ({ page }) => {
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

    // Check if book is added
    await page.getByRole("link", { name: "My Books" }).click();
    await expect(page).toHaveURL(/dashboard\/books/);

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    // Check book details and PDF Viewer
    await bookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: bookTitle }).waitFor();
    await page.getByText(bookAuthor).waitFor();
    await page.getByText(bookYear).waitFor();
    for (const genre of bookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("button", { name: "Read Online" }).click();
    await page.getByRole("button", { name: "Close Reader" }).waitFor();

    const iframeLocator = page.locator('iframe[title="PDF Viewer"]');
    await iframeLocator.waitFor({ state: "attached" });
    const frameHandle = await iframeLocator.elementHandle();
    const frame = await frameHandle?.contentFrame();

    if (!frame)
      throw new Error("Iframe with PDF Viewer not found or not loaded");
    await frame.locator("embed[type='application/pdf']").waitFor();
  });

  test("Check book details: download book", async ({ page }) => {
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

    // Check if book is added
    await page.getByRole("link", { name: "My Books" }).click();
    await expect(page).toHaveURL(/dashboard\/books/);

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    // Check book details and PDF Viewer
    await bookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: bookTitle }).waitFor();
    await page.getByText(bookAuthor).waitFor();
    await page.getByText(bookYear).waitFor();
    for (const genre of bookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    // Wait for the download to start
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download" }).click();
    const download = await downloadPromise;

    // Wait for the download to complete
    const path = await download.path();
    expect(path).toBeTruthy();

    // Verify the download has the correct filename
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toContain(".pdf");
    expect(suggestedFilename.toLowerCase()).toContain(bookTitle.toLowerCase());
  });
});
