import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { config } from "../../config/config";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

test.describe("Update book", () => {
  let username: string;
  let email: string;
  let password: string;
  let bookTitle = faker.lorem.words(1).replace(/^\w/, (c) => c.toUpperCase());
  let bookDescription = faker.lorem.paragraph();
  let bookAuthor = faker.person.fullName();
  let bookYear = faker.date
    .between({ from: "1900-01-01", to: new Date() })
    .getFullYear()
    .toString();
  let bookGenres = ["Science Fiction", "Fantasy"];

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

  test("Update book with valid data", async ({ page }) => {
    const newBookTitle = faker.lorem
      .words(1)
      .replace(/^\w/, (c) => c.toUpperCase());
    const newBookDescription = faker.lorem.paragraph();
    const newBookAuthor = faker.person.fullName();
    const newBookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const newBookGenres = ["Science Fiction", "Fantasy"];

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

    // Update the book
    await page.getByRole("link", { name: "My Books" }).click();

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    const updateButton = bookCard.locator("[data-testid='EditOutlinedIcon']");
    await bookCard.hover();
    await updateButton.waitFor();
    await updateButton.click();

    // Verify the book data
    await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
      bookTitle
    );
    await expect(
      page.getByRole("textbox", { name: "Description" })
    ).toHaveValue(bookDescription);
    await expect(page.getByRole("textbox", { name: "Author" })).toHaveValue(
      bookAuthor
    );
    await expect(page.getByRole("spinbutton", { name: "Year" })).toHaveValue(
      bookYear
    );
    await expect(
      page.getByText([...bookGenres].sort().join(", "))
    ).toBeVisible();

    // Update the book data
    await page.getByRole("textbox", { name: "Title" }).fill(newBookTitle);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(newBookDescription);
    await page.getByRole("textbox", { name: "Author" }).fill(newBookAuthor);
    await page.getByRole("spinbutton", { name: "Year" }).fill(newBookYear);
    await page.getByRole("combobox").click();
    for (const genre of newBookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book2.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Update" }).click();

    // Check if book is updated
    await expect(page).toHaveURL(/dashboard\/books/);

    const newBookCard = page.locator(".MuiCard-root", {
      hasText: newBookTitle,
    });
    await expect(newBookCard).toBeVisible();
    await expect(newBookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(newBookCard.locator(".MuiCardContent-root")).toContainText(
      newBookAuthor
    );

    // Check book details
    await newBookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: newBookTitle }).waitFor();
    await page.getByText(newBookDescription).waitFor();
    await page.getByText(newBookAuthor).waitFor();
    await page.getByText(newBookYear).waitFor();
    for (const genre of newBookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("link", { name: "Download" }).waitFor();
    await page.getByRole("button", { name: "Read Online" }).waitFor();

    await page.goBack();

    bookTitle = newBookTitle;
    bookDescription = newBookDescription;
    bookAuthor = newBookAuthor;
    bookYear = newBookYear;
    bookGenres = [...newBookGenres];
  });

  test("Update book with valid data: title is not changed", async ({
    page,
  }) => {
    const newBookDescription = faker.lorem.paragraph();
    const newBookAuthor = faker.person.fullName();
    const newBookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const newBookGenres = ["Science Fiction", "Fantasy"];

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

    // Update the book
    await page.getByRole("link", { name: "My Books" }).click();

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    const updateButton = bookCard.locator("[data-testid='EditOutlinedIcon']");
    await bookCard.hover();
    await updateButton.waitFor();
    await updateButton.click();

    // Verify the book data
    await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
      bookTitle
    );
    await expect(
      page.getByRole("textbox", { name: "Description" })
    ).toHaveValue(bookDescription);
    await expect(page.getByRole("textbox", { name: "Author" })).toHaveValue(
      bookAuthor
    );
    await expect(page.getByRole("spinbutton", { name: "Year" })).toHaveValue(
      bookYear
    );
    await expect(
      page.getByText([...bookGenres].sort().join(", "))
    ).toBeVisible();

    // Update the book data
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(newBookDescription);
    await page.getByRole("textbox", { name: "Author" }).fill(newBookAuthor);
    await page.getByRole("spinbutton", { name: "Year" }).fill(newBookYear);
    await page.getByRole("combobox").click();
    for (const genre of newBookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book2.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Update" }).click();

    // Check if book is updated
    await expect(page).toHaveURL(/dashboard\/books/);

    const newBookCard = page.locator(".MuiCard-root", {
      hasText: bookTitle,
    });
    await expect(newBookCard).toBeVisible();
    await expect(newBookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(newBookCard.locator(".MuiCardContent-root")).toContainText(
      newBookAuthor
    );

    // Check book details
    await newBookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: bookTitle }).waitFor();
    await page.getByText(newBookDescription).waitFor();
    await page.getByText(newBookAuthor).waitFor();
    await page.getByText(newBookYear).waitFor();
    for (const genre of newBookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("link", { name: "Download" }).waitFor();
    await page.getByRole("button", { name: "Read Online" }).waitFor();

    await page.goBack();

    bookDescription = newBookDescription;
    bookAuthor = newBookAuthor;
    bookYear = newBookYear;
    bookGenres = [...newBookGenres];
  });

  test("Update book with valid data: description is not changed", async ({
    page,
  }) => {
    const newBookTitle = faker.lorem
      .words(1)
      .replace(/^\w/, (c) => c.toUpperCase());
    const newBookAuthor = faker.person.fullName();
    const newBookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const newBookGenres = ["Science Fiction", "Fantasy"];

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

    // Update the book
    await page.getByRole("link", { name: "My Books" }).click();

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    const updateButton = bookCard.locator("[data-testid='EditOutlinedIcon']");
    await bookCard.hover();
    await updateButton.waitFor();
    await updateButton.click();

    // Verify the book data
    await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
      bookTitle
    );
    await expect(
      page.getByRole("textbox", { name: "Description" })
    ).toHaveValue(bookDescription);
    await expect(page.getByRole("textbox", { name: "Author" })).toHaveValue(
      bookAuthor
    );
    await expect(page.getByRole("spinbutton", { name: "Year" })).toHaveValue(
      bookYear
    );
    await expect(
      page.getByText([...bookGenres].sort().join(", "))
    ).toBeVisible();

    // Update the book data
    await page.getByRole("textbox", { name: "Title" }).fill(newBookTitle);
    await page.getByRole("textbox", { name: "Author" }).fill(newBookAuthor);
    await page.getByRole("spinbutton", { name: "Year" }).fill(newBookYear);
    await page.getByRole("combobox").click();
    for (const genre of newBookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book2.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Update" }).click();

    // Check if book is updated
    await expect(page).toHaveURL(/dashboard\/books/);

    const newBookCard = page.locator(".MuiCard-root", {
      hasText: newBookTitle,
    });
    await expect(newBookCard).toBeVisible();
    await expect(newBookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(newBookCard.locator(".MuiCardContent-root")).toContainText(
      newBookAuthor
    );

    // Check book details
    await newBookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: newBookTitle }).waitFor();
    await page.getByText(bookDescription).waitFor();
    await page.getByText(newBookAuthor).waitFor();
    await page.getByText(newBookYear).waitFor();
    for (const genre of newBookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("link", { name: "Download" }).waitFor();
    await page.getByRole("button", { name: "Read Online" }).waitFor();

    await page.goBack();

    bookTitle = newBookTitle;
    bookAuthor = newBookAuthor;
    bookYear = newBookYear;
    bookGenres = [...newBookGenres];
  });
  
  test("Update book with valid data: author is not changed", async ({
    page,
  }) => {
    const newBookTitle = faker.lorem
      .words(1)
      .replace(/^\w/, (c) => c.toUpperCase());
    const newBookDescription = faker.lorem.paragraph();
    const newBookYear = faker.date
      .between({ from: "1900-01-01", to: new Date() })
      .getFullYear()
      .toString();
    const newBookGenres = ["Science Fiction", "Fantasy"];

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

    // Update the book
    await page.getByRole("link", { name: "My Books" }).click();

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    const updateButton = bookCard.locator("[data-testid='EditOutlinedIcon']");
    await bookCard.hover();
    await updateButton.waitFor();
    await updateButton.click();

    // Verify the book data
    await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
      bookTitle
    );
    await expect(
      page.getByRole("textbox", { name: "Description" })
    ).toHaveValue(bookDescription);
    await expect(page.getByRole("textbox", { name: "Author" })).toHaveValue(
      bookAuthor
    );
    await expect(page.getByRole("spinbutton", { name: "Year" })).toHaveValue(
      bookYear
    );
    await expect(
      page.getByText([...bookGenres].sort().join(", "))
    ).toBeVisible();

    // Update the book data
    await page.getByRole("textbox", { name: "Title" }).fill(newBookTitle);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(newBookDescription);
    await page.getByRole("spinbutton", { name: "Year" }).fill(newBookYear);
    await page.getByRole("combobox").click();
    for (const genre of newBookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book2.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Update" }).click();

    // Check if book is updated
    await expect(page).toHaveURL(/dashboard\/books/);

    const newBookCard = page.locator(".MuiCard-root", {
      hasText: newBookTitle,
    });
    await expect(newBookCard).toBeVisible();
    await expect(newBookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(newBookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    // Check book details
    await newBookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: newBookTitle }).waitFor();
    await page.getByText(newBookDescription).waitFor();
    await page.getByText(bookAuthor).waitFor();
    await page.getByText(newBookYear).waitFor();
    for (const genre of newBookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("link", { name: "Download" }).waitFor();
    await page.getByRole("button", { name: "Read Online" }).waitFor();

    await page.goBack();

    bookTitle = newBookTitle;
    bookDescription = newBookDescription;
    bookYear = newBookYear;
    bookGenres = [...newBookGenres];
  });

  test("Update book with valid data: year is not changed", async ({ page }) => {
    const newBookTitle = faker.lorem
      .words(1)
      .replace(/^\w/, (c) => c.toUpperCase());
    const newBookDescription = faker.lorem.paragraph();
    const newBookAuthor = faker.person.fullName();
    const newBookGenres = ["Science Fiction", "Fantasy"];

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

    // Update the book
    await page.getByRole("link", { name: "My Books" }).click();

    const bookCard = page.locator(".MuiCard-root", { hasText: bookTitle });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      bookAuthor
    );

    const updateButton = bookCard.locator("[data-testid='EditOutlinedIcon']");
    await bookCard.hover();
    await updateButton.waitFor();
    await updateButton.click();

    // Verify the book data
    await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
      bookTitle
    );
    await expect(
      page.getByRole("textbox", { name: "Description" })
    ).toHaveValue(bookDescription);
    await expect(page.getByRole("textbox", { name: "Author" })).toHaveValue(
      bookAuthor
    );
    await expect(page.getByRole("spinbutton", { name: "Year" })).toHaveValue(
      bookYear
    );
    await expect(
      page.getByText([...bookGenres].sort().join(", "))
    ).toBeVisible();

    // Update the book data
    await page.getByRole("textbox", { name: "Title" }).fill(newBookTitle);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(newBookDescription);
    await page.getByRole("textbox", { name: "Author" }).fill(newBookAuthor);
    await page.getByRole("combobox").click();
    for (const genre of newBookGenres) {
      await page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await page.keyboard.press("Escape");

    const bookPath = path.join(__dirname, "../../attachments/book2.pdf");
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByText("Drag and drop a PDF file here, or click to select")
        .click(),
    ]);
    await fileChooser.setFiles(bookPath);

    await page.getByRole("button", { name: "Update" }).click();

    // Check if book is updated
    await expect(page).toHaveURL(/dashboard\/books/);

    const newBookCard = page.locator(".MuiCard-root", {
      hasText: newBookTitle,
    });
    await expect(newBookCard).toBeVisible();
    await expect(newBookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(newBookCard.locator(".MuiCardContent-root")).toContainText(
      newBookAuthor
    );

    // Check book details
    await newBookCard.locator(".MuiCardMedia-media").click();

    await page.getByRole("heading", { name: newBookTitle }).waitFor();
    await page.getByText(newBookDescription).waitFor();
    await page.getByText(newBookAuthor).waitFor();
    await page.getByText(bookYear).waitFor();
    for (const genre of newBookGenres) {
      await page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await page.getByRole("link", { name: "Download" }).waitFor();
    await page.getByRole("button", { name: "Read Online" }).waitFor();

    await page.goBack();

    bookTitle = newBookTitle;
    bookDescription = newBookDescription;
    bookAuthor = newBookAuthor;
    bookGenres = [...newBookGenres];
  });
});
