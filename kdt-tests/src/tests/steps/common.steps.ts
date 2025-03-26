import { Given, When, Then, After } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { ICustomWorld } from "../../hooks/customWorld";
import path from "path";

// Background steps
Given("I have a registered user account", async function (this: ICustomWorld) {
  console.log("Creating a new user account...");

  this.username = faker.internet.username();
  this.email = faker.internet.email();
  this.password = faker.internet.password();

  await this.page.goto(this.config.baseUrl);

  await this.page.getByRole("link", { name: "Login" }).click();
  await this.page.getByRole("link", { name: "Sign up" }).click();
  await this.page
    .getByRole("textbox", { name: "Username" })
    .fill(this.username);
  await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
  await this.page
    .getByRole("textbox", { name: "Password" })
    .fill(this.password);
  await this.page.getByRole("button", { name: "Sign up" }).click();

  await this.page
    .getByRole("heading", { name: `User name: ${this.username}` })
    .waitFor();
  await this.page
    .getByRole("heading", { name: `Email: ${this.email}` })
    .waitFor();

  await expect(this.page).toHaveURL(/dashboard/);

  await this.page.getByRole("link", { name: "Logout" }).click();
  await expect(this.page).toHaveURL(/\/$/);
});

Given(
  "I am logged in with my credentials",
  async function (this: ICustomWorld) {
    await this.page.goto(this.config.baseUrl);
    await this.page.getByRole("link", { name: "Login" }).click();
    await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
    await this.page
      .getByRole("textbox", { name: "Password" })
      .fill(this.password);
    await this.page.getByRole("button", { name: "Sign in" }).click();

    await this.page
      .getByRole("heading", { name: `User name: ${this.username}` })
      .waitFor();
    await this.page
      .getByRole("heading", { name: `Email: ${this.email}` })
      .waitFor();
    await expect(this.page).toHaveURL(/dashboard/);
  }
);

// Common steps
When("I navigate to the login page", async function (this: ICustomWorld) {
  await this.page.goto(this.config.baseUrl);
  await this.page.getByRole("link", { name: "Login" }).click();
});

// Registration navigation step
When(
  "I navigate to the registration page",
  async function (this: ICustomWorld) {
    await this.page.goto(this.config.baseUrl);
    await this.page.getByRole("link", { name: "Login" }).click();
    await this.page.getByRole("link", { name: "Sign up" }).click();
  }
);

// Navigation steps
When("I navigate to the settings page", async function (this: ICustomWorld) {
  await this.page.getByRole("link", { name: "Settings" }).click();
  await expect(this.page).toHaveURL(/dashboard\/settings/);
});

// Books navigation steps
When("I navigate to the books page", async function (this: ICustomWorld) {
  await this.page.getByRole("link", { name: "My Books" }).click();
  await expect(this.page).toHaveURL(/dashboard\/books/);
});

When(
  "I click the {string} link",
  async function (this: ICustomWorld, linkName: string) {
    await this.page.getByRole("link", { name: linkName }).click();
  }
);

// Registration input steps
When("I enter valid registration details", async function (this: ICustomWorld) {
  this.username = faker.internet.userName();
  this.email = faker.internet.email();
  this.password = faker.internet.password();

  await this.page
    .getByRole("textbox", { name: "Username" })
    .fill(this.username);
  await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
  await this.page
    .getByRole("textbox", { name: "Password" })
    .fill(this.password);
});

When(
  "I enter a username that is too short",
  async function (this: ICustomWorld) {
    this.username = "te";
    await this.page
      .getByRole("textbox", { name: "Username" })
      .fill(this.username);
  }
);

When("I enter an empty username", async function (this: ICustomWorld) {
  this.username = "";
  await this.page
    .getByRole("textbox", { name: "Username" })
    .fill(this.username);
});

When("I enter a valid username", async function (this: ICustomWorld) {
  this.username = faker.internet.userName();
  await this.page
    .getByRole("textbox", { name: "Username" })
    .fill(this.username);
});

When("I enter a valid email", async function (this: ICustomWorld) {
  this.email = faker.internet.email();
  await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
});

When("I enter an email without @ symbol", async function (this: ICustomWorld) {
  this.email = "test.com";
  await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
});

When("I enter an email without dot", async function (this: ICustomWorld) {
  this.email = "test@testcom";
  await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
});

When("I enter an incomplete email", async function (this: ICustomWorld) {
  this.email = "@test.com";
  await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
});

When("I enter a valid password", async function (this: ICustomWorld) {
  this.password = faker.internet.password();
  await this.page
    .getByRole("textbox", { name: "Password" })
    .fill(this.password);
});

When(
  "I enter a password that is too short",
  async function (this: ICustomWorld) {
    this.password = "passw";
    await this.page
      .getByRole("textbox", { name: "Password" })
      .fill(this.password);
  }
);

// Password reset specific steps
When("I enter my current password", async function (this: ICustomWorld) {
  await this.page.getByLabel("Current Password").fill(this.password);
});

When(
  "I enter an incorrect current password",
  async function (this: ICustomWorld) {
    const invalidPassword = faker.internet.password();
    await this.page.getByLabel("Current Password").fill(invalidPassword);
  }
);

When("I enter an empty current password", async function (this: ICustomWorld) {
  await this.page.getByLabel("Current Password").fill("");
});

When("I enter a valid new password", async function (this: ICustomWorld) {
  this.newPassword = faker.internet.password();
  await this.page
    .getByLabel("New Password", { exact: true })
    .fill(this.newPassword);
});

When(
  "I enter a password that is too short as new password",
  async function (this: ICustomWorld) {
    this.newPassword = "passw";
    await this.page
      .getByLabel("New Password", { exact: true })
      .fill(this.newPassword);
  }
);

When("I enter an empty new password", async function (this: ICustomWorld) {
  this.newPassword = "";
  await this.page
    .getByLabel("New Password", { exact: true })
    .fill(this.newPassword);
});

When("I confirm the new password", async function (this: ICustomWorld) {
  await this.page.getByLabel("Confirm New Password").fill(this.newPassword);
});

When(
  "I enter a different password in the confirm field",
  async function (this: ICustomWorld) {
    const differentPassword = faker.internet.password();
    await this.page.getByLabel("Confirm New Password").fill(differentPassword);
  }
);

// Book creation steps
When(
  "I enter {string} as the book title",
  async function (this: ICustomWorld, title: string) {
    this.bookTitle = title.includes("Book Title")
      ? faker.lorem
          .words({ min: 2, max: 5 })
          .replace(/^\w/, (c) => c.toUpperCase())
      : title;
    await this.page
      .getByRole("textbox", { name: "Title" })
      .fill(this.bookTitle);
  }
);

When(
  "I enter {string} as the book description",
  async function (this: ICustomWorld, description: string) {
    this.bookDescription = description.includes("book description")
      ? faker.lorem.paragraph()
      : description;
    await this.page
      .getByRole("textbox", { name: "Description" })
      .fill(this.bookDescription);
  }
);

When(
  "I enter {string} as the book author",
  async function (this: ICustomWorld, author: string) {
    this.bookAuthor = author.includes("John Doe")
      ? faker.person.fullName()
      : author;
    await this.page
      .getByRole("textbox", { name: "Author" })
      .fill(this.bookAuthor);
  }
);

When(
  "I enter {string} as the book year",
  async function (this: ICustomWorld, year: string) {
    this.bookYear = year.includes("2023")
      ? faker.date
          .between({ from: "1900-01-01", to: new Date() })
          .getFullYear()
          .toString()
      : year;
    await this.page
      .getByRole("spinbutton", { name: "Year" })
      .fill(this.bookYear);
  }
);

When(
  "I select the genres {string} and {string}",
  async function (this: ICustomWorld, genre1: string, genre2: string) {
    this.bookGenres = [genre1, genre2];
    await this.page.getByRole("combobox").click();
    for (const genre of this.bookGenres) {
      await this.page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await this.page.keyboard.press("Escape");
  }
);

When("I upload a PDF file", async function (this: ICustomWorld) {
  const bookPath = path.join(process.cwd(), "/attachments/book1.pdf");
  const [fileChooser] = await Promise.all([
    this.page.waitForEvent("filechooser"),
    this.page
      .getByText("Drag and drop a PDF file here, or click to select")
      .click(),
  ]);
  await fileChooser.setFiles(bookPath);
});

// Book update specific steps - add these after the book creation steps section

When("I hover over the book card", async function (this: ICustomWorld) {
  const bookCard = this.page.locator(".MuiCard-root", {
    hasText: this.bookTitle,
  });
  await bookCard.hover();
});

When("I click the edit button", async function (this: ICustomWorld) {
  const bookCard = this.page.locator(".MuiCard-root", {
    hasText: this.bookTitle,
  });
  const updateButton = bookCard.locator("[data-testid='EditOutlinedIcon']");
  await updateButton.waitFor();
  await updateButton.click();
});

When("I click on the book cover", async function (this: ICustomWorld) {
  const bookCard = this.page.locator(".MuiCard-root", {
    hasText: this.bookTitle,
  });
  await bookCard.locator(".MuiCardMedia-media").click();
});

Then(
  "I should see the book form with existing data",
  async function (this: ICustomWorld) {
    await expect(this.page.getByRole("textbox", { name: "Title" })).toHaveValue(
      this.bookTitle
    );
    await expect(
      this.page.getByRole("textbox", { name: "Description" })
    ).toHaveValue(this.bookDescription);
    await expect(
      this.page.getByRole("textbox", { name: "Author" })
    ).toHaveValue(this.bookAuthor);
    await expect(
      this.page.getByRole("spinbutton", { name: "Year" })
    ).toHaveValue(this.bookYear);
    // Check genres - they appear as a comma-separated text
    await expect(
      this.page.getByText([...this.bookGenres].sort().join(", "))
    ).toBeVisible();
  }
);

Then(
  "I should see the book details with updated information",
  async function (this: ICustomWorld) {
    await this.page.getByRole("heading", { name: this.bookTitle }).waitFor();
    await this.page.getByText(this.bookDescription).waitFor();
    await this.page.getByText(this.bookAuthor).waitFor();
    await this.page.getByText(this.bookYear).waitFor();

    for (const genre of this.bookGenres) {
      await this.page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }

    await this.page.getByRole("link", { name: "Download" }).waitFor();
    await this.page.getByRole("button", { name: "Read Online" }).waitFor();
  }
);

Then(
  "I should see the book details with updated information except title",
  async function (this: ICustomWorld) {
    // Original title should be visible as it wasn't changed
    await this.page.getByRole("heading", { name: this.bookTitle }).waitFor();
    // Other fields should have been updated
    await this.page.getByText(this.bookDescription).waitFor();
    await this.page.getByText(this.bookAuthor).waitFor();
    await this.page.getByText(this.bookYear).waitFor();

    for (const genre of this.bookGenres) {
      await this.page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }
  }
);

Then(
  "I should see the book details with updated information except description",
  async function (this: ICustomWorld) {
    await this.page.getByRole("heading", { name: this.bookTitle }).waitFor();
    // Original description should be visible
    await this.page.getByText(this.bookDescription).waitFor();
    await this.page.getByText(this.bookAuthor).waitFor();
    await this.page.getByText(this.bookYear).waitFor();

    for (const genre of this.bookGenres) {
      await this.page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }
  }
);

Then(
  "I should see the book details with updated information except author",
  async function (this: ICustomWorld) {
    await this.page.getByRole("heading", { name: this.bookTitle }).waitFor();
    await this.page.getByText(this.bookDescription).waitFor();
    // Original author should be visible
    await this.page.getByText(this.bookAuthor).waitFor();
    await this.page.getByText(this.bookYear).waitFor();

    for (const genre of this.bookGenres) {
      await this.page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }
  }
);

Then(
  "I should see the book details with updated information except year",
  async function (this: ICustomWorld) {
    await this.page.getByRole("heading", { name: this.bookTitle }).waitFor();
    await this.page.getByText(this.bookDescription).waitFor();
    await this.page.getByText(this.bookAuthor).waitFor();
    // Original year should be visible
    await this.page.getByText(this.bookYear).waitFor();

    for (const genre of this.bookGenres) {
      await this.page.locator(".MuiChip-root", { hasText: genre }).waitFor();
    }
  }
);

// Login steps
When("I enter my email and password", async function (this: ICustomWorld) {
  await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
  await this.page
    .getByRole("textbox", { name: "Password" })
    .fill(this.password);
});

When(
  "I enter an invalid email and my password",
  async function (this: ICustomWorld) {
    const invalidEmail = faker.internet.email();
    await this.page.getByRole("textbox", { name: "Email" }).fill(invalidEmail);
    await this.page
      .getByRole("textbox", { name: "Password" })
      .fill(this.password);
  }
);

When(
  "I enter my email and an invalid password",
  async function (this: ICustomWorld) {
    const invalidPassword = faker.internet.password();
    await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
    await this.page
      .getByRole("textbox", { name: "Password" })
      .fill(invalidPassword);
  }
);

When(
  "I enter an invalid email and an invalid password",
  async function (this: ICustomWorld) {
    const invalidEmail = faker.internet.email();
    const invalidPassword = faker.internet.password();
    await this.page.getByRole("textbox", { name: "Email" }).fill(invalidEmail);
    await this.page
      .getByRole("textbox", { name: "Password" })
      .fill(invalidPassword);
  }
);

When(
  "I enter an empty email and my password",
  async function (this: ICustomWorld) {
    await this.page.getByRole("textbox", { name: "Email" }).fill("");
    await this.page
      .getByRole("textbox", { name: "Password" })
      .fill(this.password);
  }
);

When(
  "I enter my email and an empty password",
  async function (this: ICustomWorld) {
    await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
    await this.page.getByRole("textbox", { name: "Password" }).fill("");
  }
);

When(
  "I enter an empty email and an empty password",
  async function (this: ICustomWorld) {
    await this.page.getByRole("textbox", { name: "Email" }).fill("");
    await this.page.getByRole("textbox", { name: "Password" }).fill("");
  }
);

When("I enter an empty email", async function (this: ICustomWorld) {
  this.email = "";
  await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
});

When("I enter an empty password", async function (this: ICustomWorld) {
  this.password = "";
  await this.page
    .getByRole("textbox", { name: "Password" })
    .fill(this.password);
});

When(
  "I click the {string} button",
  async function (this: ICustomWorld, buttonName: string) {
    await this.page.getByRole("button", { name: buttonName }).click();
  }
);

// Assertions
Then("I should be logged in successfully", async function (this: ICustomWorld) {
  await this.page
    .getByRole("heading", { name: `User name: ${this.username}` })
    .waitFor();
  await this.page
    .getByRole("heading", { name: `Email: ${this.email}` })
    .waitFor();
});

Then(
  "I should be registered successfully",
  async function (this: ICustomWorld) {
    await this.page
      .getByRole("heading", { name: `User name: ${this.username}` })
      .waitFor();
    await this.page
      .getByRole("heading", { name: `Email: ${this.email}` })
      .waitFor();
  }
);

Then(
  "I should be redirected to the dashboard",
  async function (this: ICustomWorld) {
    await expect(this.page).toHaveURL(/dashboard/);
  }
);

Then(
  "I should stay on the registration page",
  async function (this: ICustomWorld) {
    await expect(this.page).toHaveURL(/signup/);
  }
);

Then("I should stay on the settings page", async function (this: ICustomWorld) {
  await expect(this.page).toHaveURL(/dashboard\/settings/);
});

Then(
  "I should see a username error message {string}",
  async function (this: ICustomWorld, message: string) {
    await this.page
      .locator("#username-helper-text.Mui-error", { hasText: message })
      .waitFor();
  }
);

Then(
  "I should see an email error message {string}",
  async function (this: ICustomWorld, message: string) {
    await this.page
      .locator("#email-helper-text.Mui-error", { hasText: message })
      .waitFor();
  }
);

Then(
  "I should see a password error message {string}",
  async function (this: ICustomWorld, message: string) {
    await this.page
      .locator("#password-helper-text.Mui-error", { hasText: message })
      .waitFor();
  }
);

Then(
  "I should see a current password error message {string}",
  async function (this: ICustomWorld, message: string) {
    await this.page
      .locator("#currentPassword-helper-text.Mui-error", { hasText: message })
      .waitFor();
  }
);

Then(
  "I should see a new password error message {string}",
  async function (this: ICustomWorld, message: string) {
    await this.page
      .locator("#newPassword-helper-text.Mui-error", { hasText: message })
      .waitFor();
  }
);

Then(
  "I should see a confirm password error message {string}",
  async function (this: ICustomWorld, message: string) {
    await this.page
      .locator("#confirmPassword-helper-text.Mui-error", { hasText: message })
      .waitFor();
  }
);

Then(
  "I should see an error message {string}",
  async function (this: ICustomWorld, message: string) {
    await this.page.locator(".Mui-error", { hasText: message }).waitFor();
  }
);

Then(
  "I should see a text message {string}",
  async function (this: ICustomWorld, message: string) {
    await this.page.getByText(message).waitFor();
  }
);

Then(
  "I should see the password updated successfully message",
  async function (this: ICustomWorld) {
    await this.page
      .locator(".MuiAlert-colorSuccess .MuiAlert-message", {
        hasText: "Password successfully updated",
      })
      .waitFor();
  }
);

Then(
  "I should be able to login with my new password",
  async function (this: ICustomWorld) {
    // Logout first
    await this.page.getByRole("link", { name: "Logout" }).click();
    await expect(this.page).toHaveURL(this.config.baseUrl);

    // Login with new password
    await this.page.getByRole("link", { name: "Login" }).click();
    await this.page.getByRole("textbox", { name: "Email" }).fill(this.email);
    await this.page
      .getByRole("textbox", { name: "Password" })
      .fill(this.newPassword);
    await this.page.getByRole("button", { name: "Sign in" }).click();

    await this.page
      .getByRole("heading", { name: `User name: ${this.username}` })
      .waitFor();
    await this.page
      .getByRole("heading", { name: `Email: ${this.email}` })
      .waitFor();
    await expect(this.page).toHaveURL(/dashboard/);
  }
);

Then("I should see an unauthorized error", async function (this: ICustomWorld) {
  await this.page.getByText("Unauthorized").waitFor();
  await expect(this.page).toHaveURL(/unauthorized/);
});

Then("I should see a bad request error", async function (this: ICustomWorld) {
  await this.page.getByText("Bad Request").waitFor();
  await expect(this.page).toHaveURL(/bad-request/);
});

Then(
  "I should see a {string} button",
  async function (this: ICustomWorld, buttonName: string) {
    await this.page.getByRole("button", { name: buttonName }).waitFor();
  }
);

// Book assertions
Then(
  "I should see the book {string} in my collection",
  async function (this: ICustomWorld, titlePattern: string) {
    this.bookTitle = titlePattern.includes("Book Title")
      ? this.bookTitle
      : titlePattern;

    const bookCard = this.page.locator(".MuiCard-root", {
      hasText: this.bookTitle,
    });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      this.bookAuthor
    );
  }
);

Then(
  "I should be able to view the book details",
  async function (this: ICustomWorld) {
    const bookCard = this.page.locator(".MuiCard-root", {
      hasText: this.bookTitle,
    });
    await bookCard.locator(".MuiCardMedia-media").click();

    await this.page.getByRole("heading", { name: this.bookTitle }).waitFor();

    if (this.bookDescription) {
      await this.page.getByText(this.bookDescription).waitFor();
    }

    await this.page.getByText(this.bookAuthor).waitFor();
    await this.page.getByText(this.bookYear).waitFor();

    if (this.bookGenres) {
      for (const genre of this.bookGenres) {
        await this.page.locator(".MuiChip-root", { hasText: genre }).waitFor();
      }
    }

    await this.page.goBack();
  }
);

Then(
  "I should be able to download or read the book online",
  async function (this: ICustomWorld) {
    const bookCard = this.page.locator(".MuiCard-root", {
      hasText: this.bookTitle,
    });
    await bookCard.locator(".MuiCardMedia-media").click();

    await this.page.getByRole("link", { name: "Download" }).waitFor();
    await this.page.getByRole("button", { name: "Read Online" }).waitFor();

    await this.page.goBack();
  }
);

Then(
  "I should be able to delete the book",
  async function (this: ICustomWorld) {
    const bookCard = this.page.locator(".MuiCard-root", {
      hasText: this.bookTitle,
    });
    await bookCard.hover();

    const deleteButton = bookCard.locator("[data-testid='DeleteOutlinedIcon']");
    await deleteButton.waitFor();
    await deleteButton.click();
    await this.page
      .locator(".MuiDialog-container .MuiBox-root button")
      .filter({ hasText: "Delete" })
      .click();
    await expect(bookCard).not.toBeVisible();
  }
);

Then(
  "I should stay on the book creation page",
  async function (this: ICustomWorld) {
    await expect(this.page).toHaveURL(/book\/create/);
  }
);

Then("I should see the PDF viewer", async function (this: ICustomWorld) {
  await this.page.getByRole("button", { name: "Close Reader" }).waitFor();

  const iframeLocator = this.page.locator('iframe[title="PDF Viewer"]');
  await iframeLocator.waitFor({ state: "attached" });
  const frameHandle = await iframeLocator.elementHandle();
  const frame = await frameHandle?.contentFrame();

  if (!frame) throw new Error("Iframe with PDF Viewer not found or not loaded");

  await frame.locator("embed[type='application/pdf']").waitFor();
});

Then(
  "I should be able to download the book",
  async function (this: ICustomWorld) {
    // Wait for the download to start
    const downloadPromise = this.page.waitForEvent("download");
    // The download is triggered by the "Download" link click in the previous step
    const download = await downloadPromise;

    // Verify the download has initiated
    const path = await download.path();
    expect(path).toBeTruthy();

    // Verify the download has the correct filename
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toContain(".pdf");
    expect(suggestedFilename.toLowerCase()).toContain(
      this.bookTitle.toLowerCase()
    );
  }
);

// New step definitions to add to common.steps.ts

When("I click on the search field", async function (this: ICustomWorld) {
  const searchField = this.page.getByPlaceholder("Search…");
  await searchField.click();
});

When(
  "I enter the book title in the search field",
  async function (this: ICustomWorld) {
    const searchField = this.page.getByPlaceholder("Search…");
    await searchField.fill(this.bookTitle);
  }
);

When("I press Enter", async function (this: ICustomWorld) {
  await this.page.keyboard.press("Enter");
});

When(
  "I navigate to the {string} catalog",
  async function (this: ICustomWorld, catalogName: string) {
    await this.page
      .locator(".MuiAppBar-root .MuiBox-root", { hasText: catalogName })
      .click();
  }
);

When(
  "I select {string} from the genre filter",
  async function (this: ICustomWorld, genre: string) {
    await this.page
      .locator(".MuiFormControl-root", { hasText: "Genre" })
      .click();
    await this.page.getByRole("option", { name: genre }).click();
  }
);

When(
  "I enter the book author in the author filter",
  async function (this: ICustomWorld) {
    await this.page.locator("input[name='author']").fill(this.bookAuthor);
  }
);

When(
  "I enter the book year in the year filter",
  async function (this: ICustomWorld) {
    await this.page.locator("input[name='year']").fill(this.bookYear);
  }
);

Then(
  "I should see search results containing my book",
  async function (this: ICustomWorld) {
    const bookCard = this.page.locator(".MuiCard-root", {
      hasText: this.bookTitle,
    });
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(
      this.bookAuthor
    );
  }
);

// Cleanup after each scenario
After(async function (this: ICustomWorld) {
  await this.teardown();
});
