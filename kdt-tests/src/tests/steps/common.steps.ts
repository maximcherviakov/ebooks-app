import { Given, When, Then, After } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { ICustomWorld } from "../../hooks/customWorld";
import { LoginPage } from "../../pages/LoginPage";
import { RegistrationPage } from "../../pages/RegistrationPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { SettingsPage } from "../../pages/SettingsPage";
import { BooksPage } from "../../pages/BooksPage";
import { BookDetailsPage } from "../../pages/BookDetailsPage";
import path from "path";

// Background steps
Given("I have a registered user account", async function (this: ICustomWorld) {
  console.log("Creating a new user account...");

  this.username = faker.internet.username();
  this.email = faker.internet.email();
  this.password = faker.internet.password();

  const registrationPage = new RegistrationPage(this);
  await registrationPage.navigate();
  await registrationPage.register(this.username, this.email, this.password);

  const dashboardPage = new DashboardPage(this);
  await dashboardPage.verifyLoggedIn(this.username, this.email);
  await dashboardPage.logout();
});

Given(
  "I am logged in with my credentials",
  async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this);
    await loginPage.navigate();
    await loginPage.login(this.email, this.password);

    const dashboardPage = new DashboardPage(this);
    await dashboardPage.verifyLoggedIn(this.username, this.email);
  }
);

// Common steps
When("I navigate to the login page", async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this);
  await loginPage.navigate();
});

// Registration navigation step
When(
  "I navigate to the registration page",
  async function (this: ICustomWorld) {
    const registrationPage = new RegistrationPage(this);
    await registrationPage.navigate();
  }
);

// Navigation steps
When("I navigate to the settings page", async function (this: ICustomWorld) {
  const dashboardPage = new DashboardPage(this);
  await dashboardPage.navigateToSettings();
});

// Books navigation steps
When("I navigate to the books page", async function (this: ICustomWorld) {
  const dashboardPage = new DashboardPage(this);
  await dashboardPage.navigateToMyBooks();
});

When(
  "I click the {string} link",
  async function (this: ICustomWorld, linkName: string) {
    // This step is generic, consider if it should be part of a specific page object
    // For now, assuming it's on the current page, handled by BasePage or specific page
    const currentPage = new DashboardPage(this); // Or another appropriate page
    await currentPage.clickLink(linkName);
  }
);

// Registration input steps
When("I enter valid registration details", async function (this: ICustomWorld) {
  this.username = faker.internet.userName();
  this.email = faker.internet.email();
  this.password = faker.internet.password();

  const registrationPage = new RegistrationPage(this);
  await registrationPage.fillUsername(this.username);
  await registrationPage.fillEmail(this.email);
  await registrationPage.fillPassword(this.password);
});

When(
  "I enter a username that is too short",
  async function (this: ICustomWorld) {
    this.username = "te";
    const registrationPage = new RegistrationPage(this);
    await registrationPage.fillUsername(this.username);
  }
);

When("I enter an empty username", async function (this: ICustomWorld) {
  this.username = "";
  const registrationPage = new RegistrationPage(this);
  await registrationPage.fillUsername(this.username);
});

When("I enter a valid username", async function (this: ICustomWorld) {
  this.username = faker.internet.userName();
  const registrationPage = new RegistrationPage(this);
  await registrationPage.fillUsername(this.username);
});

When("I enter a valid email", async function (this: ICustomWorld) {
  this.email = faker.internet.email();
  const registrationPage = new RegistrationPage(this);
  await registrationPage.fillEmail(this.email);
});

When("I enter an email without @ symbol", async function (this: ICustomWorld) {
  this.email = "test.com";
  const registrationPage = new RegistrationPage(this);
  await registrationPage.fillEmail(this.email);
});

When("I enter an email without dot", async function (this: ICustomWorld) {
  this.email = "test@testcom";
  const registrationPage = new RegistrationPage(this);
  await registrationPage.fillEmail(this.email);
});

When("I enter an incomplete email", async function (this: ICustomWorld) {
  this.email = "@test.com";
  const registrationPage = new RegistrationPage(this);
  await registrationPage.fillEmail(this.email);
});

When("I enter a valid password", async function (this: ICustomWorld) {
  this.password = faker.internet.password();
  const registrationPage = new RegistrationPage(this);
  await registrationPage.fillPassword(this.password);
});

When(
  "I enter a password that is too short",
  async function (this: ICustomWorld) {
    this.password = "passw";
    const registrationPage = new RegistrationPage(this);
    await registrationPage.fillPassword(this.password);
  }
);

// Password reset specific steps
When("I enter my current password", async function (this: ICustomWorld) {
  const settingsPage = new SettingsPage(this);
  await settingsPage.fillCurrentPassword(this.password);
});

When(
  "I enter an incorrect current password",
  async function (this: ICustomWorld) {
    const invalidPassword = faker.internet.password();
    const settingsPage = new SettingsPage(this);
    await settingsPage.fillCurrentPassword(invalidPassword);
  }
);

When("I enter an empty current password", async function (this: ICustomWorld) {
  const settingsPage = new SettingsPage(this);
  await settingsPage.fillCurrentPassword("");
});

When("I enter a valid new password", async function (this: ICustomWorld) {
  this.newPassword = faker.internet.password();
  const settingsPage = new SettingsPage(this);
  await settingsPage.fillNewPassword(this.newPassword);
});

When(
  "I enter a password that is too short as new password",
  async function (this: ICustomWorld) {
    this.newPassword = "passw";
    const settingsPage = new SettingsPage(this);
    await settingsPage.fillNewPassword(this.newPassword);
  }
);

When("I enter an empty new password", async function (this: ICustomWorld) {
  this.newPassword = "";
  const settingsPage = new SettingsPage(this);
  await settingsPage.fillNewPassword(this.newPassword);
});

When("I confirm the new password", async function (this: ICustomWorld) {
  const settingsPage = new SettingsPage(this);
  await settingsPage.fillConfirmNewPassword(this.newPassword);
});

When(
  "I enter a different password in the confirm field",
  async function (this: ICustomWorld) {
    const differentPassword = faker.internet.password();
    const settingsPage = new SettingsPage(this);
    await settingsPage.fillConfirmNewPassword(differentPassword);
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
    const booksPage = new BooksPage(this);
    await booksPage.fillBookTitle(this.bookTitle);
  }
);

When(
  "I enter {string} as the book description",
  async function (this: ICustomWorld, description: string) {
    this.bookDescription = description.includes("book description")
      ? faker.lorem.paragraph()
      : description;
    const booksPage = new BooksPage(this);
    await booksPage.fillBookDescription(this.bookDescription);
  }
);

When(
  "I enter {string} as the book author",
  async function (this: ICustomWorld, author: string) {
    this.bookAuthor = author.includes("John Doe")
      ? faker.person.fullName()
      : author;
    const booksPage = new BooksPage(this);
    await booksPage.fillBookAuthor(this.bookAuthor);
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
    const booksPage = new BooksPage(this);
    await booksPage.fillBookYear(this.bookYear);
  }
);

When(
  "I select the genres {string} and {string}",
  async function (this: ICustomWorld, genre1: string, genre2: string) {
    this.bookGenres = [genre1, genre2];
    const booksPage = new BooksPage(this);
    await booksPage.selectGenres(this.bookGenres);
  }
);

When("I upload a PDF file", async function (this: ICustomWorld) {
  const booksPage = new BooksPage(this);
  await booksPage.uploadPdf(); // Assumes default "book1.pdf"
});

// Book update specific steps - add these after the book creation steps section

When("I hover over the book card", async function (this: ICustomWorld) {
  const booksPage = new BooksPage(this);
  await booksPage.hoverBookCard(this.bookTitle);
});

When("I click the edit button", async function (this: ICustomWorld) {
  const booksPage = new BooksPage(this);
  await booksPage.clickEditButtonOnBook(this.bookTitle);
});

When("I click on the book cover", async function (this: ICustomWorld) {
  const booksPage = new BooksPage(this);
  await booksPage.clickBookCover(this.bookTitle);
});

Then(
  "I should see the book form with existing data",
  async function (this: ICustomWorld) {
    const booksPage = new BooksPage(this);
    await booksPage.verifyBookForm({
      title: this.bookTitle,
      description: this.bookDescription,
      author: this.bookAuthor,
      year: this.bookYear,
      genres: this.bookGenres,
    });
  }
);

Then(
  "I should see the book details with updated information",
  async function (this: ICustomWorld) {
    const bookDetailsPage = new BookDetailsPage(this);
    await bookDetailsPage.verifyBookDetails({
      title: this.bookTitle,
      description: this.bookDescription,
      author: this.bookAuthor,
      year: this.bookYear,
      genres: this.bookGenres,
    });
    await bookDetailsPage.verifyDownloadAndReadOnlineButtons();
  }
);

Then(
  "I should see the book details with updated information except title",
  async function (this: ICustomWorld) {
    const bookDetailsPage = new BookDetailsPage(this);
    // Assuming this.bookTitle holds the *original* title for this check
    await bookDetailsPage.verifyBookDetails({
      title: this.bookTitle, // Original title
      description: this.bookDescription, // Updated
      author: this.bookAuthor, // Updated
      year: this.bookYear, // Updated
      genres: this.bookGenres, // Updated
    });
  }
);

Then(
  "I should see the book details with updated information except description",
  async function (this: ICustomWorld) {
    const bookDetailsPage = new BookDetailsPage(this);
    await bookDetailsPage.verifyBookDetails({
      title: this.bookTitle, // Updated
      description: this.bookDescription, // Original
      author: this.bookAuthor, // Updated
      year: this.bookYear, // Updated
      genres: this.bookGenres, // Updated
    });
  }
);

Then(
  "I should see the book details with updated information except author",
  async function (this: ICustomWorld) {
    const bookDetailsPage = new BookDetailsPage(this);
    await bookDetailsPage.verifyBookDetails({
      title: this.bookTitle, // Updated
      description: this.bookDescription, // Updated
      author: this.bookAuthor, // Original
      year: this.bookYear, // Updated
      genres: this.bookGenres, // Updated
    });
  }
);

Then(
  "I should see the book details with updated information except year",
  async function (this: ICustomWorld) {
    const bookDetailsPage = new BookDetailsPage(this);
    await bookDetailsPage.verifyBookDetails({
      title: this.bookTitle, // Updated
      description: this.bookDescription, // Updated
      author: this.bookAuthor, // Updated
      year: this.bookYear, // Original
      genres: this.bookGenres, // Updated
    });
  }
);

// Login steps
When("I enter my email and password", async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this);
  await loginPage.fillEmail(this.email);
  await loginPage.fillPassword(this.password);
});

When(
  "I enter an invalid email and my password",
  async function (this: ICustomWorld) {
    const invalidEmail = faker.internet.email();
    const loginPage = new LoginPage(this);
    await loginPage.fillEmail(invalidEmail);
    await loginPage.fillPassword(this.password);
  }
);

When(
  "I enter my email and an invalid password",
  async function (this: ICustomWorld) {
    const invalidPassword = faker.internet.password();
    const loginPage = new LoginPage(this);
    await loginPage.fillEmail(this.email);
    await loginPage.fillPassword(invalidPassword);
  }
);

When(
  "I enter an invalid email and an invalid password",
  async function (this: ICustomWorld) {
    const invalidEmail = faker.internet.email();
    const invalidPassword = faker.internet.password();
    const loginPage = new LoginPage(this);
    await loginPage.fillEmail(invalidEmail);
    await loginPage.fillPassword(invalidPassword);
  }
);

When(
  "I enter an empty email and my password",
  async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this);
    await loginPage.fillEmail("");
    await loginPage.fillPassword(this.password);
  }
);

When(
  "I enter my email and an empty password",
  async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this);
    await loginPage.fillEmail(this.email);
    await loginPage.fillPassword("");
  }
);

When(
  "I enter an empty email and an empty password",
  async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this);
    await loginPage.fillEmail("");
    await loginPage.fillPassword("");
  }
);

When("I enter an empty email", async function (this: ICustomWorld) {
  this.email = "";
  const registrationPage = new RegistrationPage(this); // Or LoginPage if context is login
  await registrationPage.fillEmail(this.email);
});

When("I enter an empty password", async function (this: ICustomWorld) {
  this.password = "";
  const registrationPage = new RegistrationPage(this); // Or LoginPage if context is login
  await registrationPage.fillPassword(this.password);
});

When(
  "I click the {string} button",
  async function (this: ICustomWorld, buttonName: string) {
    // This step is generic, handled by BasePage or specific page
    const currentPage = new DashboardPage(this); // Or another appropriate page
    await currentPage.clickButton(buttonName);
  }
);

// Assertions
Then("I should be logged in successfully", async function (this: ICustomWorld) {
  const dashboardPage = new DashboardPage(this);
  await dashboardPage.verifyLoggedIn(this.username, this.email);
});

Then(
  "I should be registered successfully",
  async function (this: ICustomWorld) {
    const dashboardPage = new DashboardPage(this);
    await dashboardPage.verifyLoggedIn(this.username, this.email);
  }
);

Then(
  "I should be redirected to the dashboard",
  async function (this: ICustomWorld) {
    // Verification is part of verifyLoggedIn in DashboardPage
    // If standalone check is needed:
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
  const settingsPage = new SettingsPage(this);
  await settingsPage.verifyOnPage();
});

Then(
  "I should see a username error message {string}",
  async function (this: ICustomWorld, message: string) {
    const registrationPage = new RegistrationPage(this);
    await expect(await registrationPage.getUsernameErrorMessage(message)).toBeVisible();
  }
);

Then(
  "I should see an email error message {string}",
  async function (this: ICustomWorld, message: string) {
    // This could be on LoginPage or RegistrationPage
    if (this.page.url().includes("signup")) {
      const registrationPage = new RegistrationPage(this);
      await expect(await registrationPage.getEmailErrorMessage(message)).toBeVisible();
    } else {
      const loginPage = new LoginPage(this);
      await expect(await loginPage.getEmailErrorMessage(message)).toBeVisible();
    }
  }
);

Then(
  "I should see a password error message {string}",
  async function (this: ICustomWorld, message: string) {
    // This could be on LoginPage or RegistrationPage
    if (this.page.url().includes("signup")) {
      const registrationPage = new RegistrationPage(this);
      await expect(await registrationPage.getPasswordErrorMessage(message)).toBeVisible();
    } else {
      const loginPage = new LoginPage(this);
      await expect(await loginPage.getPasswordErrorMessage(message)).toBeVisible();
    }
  }
);

Then(
  "I should see a current password error message {string}",
  async function (this: ICustomWorld, message: string) {
    const settingsPage = new SettingsPage(this);
    await expect(await settingsPage.getCurrentPasswordErrorMessage(message)).toBeVisible();
  }
);

Then(
  "I should see a new password error message {string}",
  async function (this: ICustomWorld, message: string) {
    const settingsPage = new SettingsPage(this);
    await expect(await settingsPage.getNewPasswordErrorMessage(message)).toBeVisible();
  }
);

Then(
  "I should see a confirm password error message {string}",
  async function (this: ICustomWorld, message: string) {
    const settingsPage = new SettingsPage(this);
    await expect(await settingsPage.getConfirmPasswordErrorMessage(message)).toBeVisible();
  }
);

Then(
  "I should see an error message {string}",
  async function (this: ICustomWorld, message: string) {
    // Generic error, could be on any page. Using BasePage for now.
    const basePage = new DashboardPage(this); // Or any page object
    await expect(this.page.locator(".Mui-error", { hasText: message })).toBeVisible();
  }
);

Then(
  "I should see a text message {string}",
  async function (this: ICustomWorld, message: string) {
    const basePage = new DashboardPage(this); // Or any page object
    await basePage.waitForTextMessage(message);
  }
);

Then(
  "I should see the password updated successfully message",
  async function (this: ICustomWorld) {
    const settingsPage = new SettingsPage(this);
    await expect(await settingsPage.getSuccessMessage("Password successfully updated")).toBeVisible();
  }
);

Then(
  "I should be able to login with my new password",
  async function (this: ICustomWorld) {
    const dashboardPage = new DashboardPage(this);
    await dashboardPage.logout();

    const loginPage = new LoginPage(this);
    await loginPage.navigate(); // Ensure on login page
    await loginPage.login(this.email, this.newPassword);

    await dashboardPage.verifyLoggedIn(this.username, this.email);
  }
);

Then("I should see an unauthorized error", async function (this: ICustomWorld) {
  const basePage = new DashboardPage(this); // Or any page object
  await basePage.waitForTextMessage("Unauthorized");
  await expect(this.page).toHaveURL(/unauthorized/);
});

Then("I should see a bad request error", async function (this: ICustomWorld) {
  const basePage = new DashboardPage(this); // Or any page object
  await basePage.waitForTextMessage("Bad Request");
  await expect(this.page).toHaveURL(/bad-request/);
});

Then(
  "I should see a {string} button",
  async function (this: ICustomWorld, buttonName: string) {
    // Generic button check, could be on any page.
    const basePage = new DashboardPage(this); // Or any page object
    await expect(this.page.getByRole("button", { name: buttonName })).toBeVisible();
  }
);

// Book assertions
Then(
  "I should see the book {string} in my collection",
  async function (this: ICustomWorld, titlePattern: string) {
    this.bookTitle = titlePattern.includes("Book Title")
      ? this.bookTitle
      : titlePattern;
    const booksPage = new BooksPage(this);
    await booksPage.verifyBookInCollection({ title: this.bookTitle, author: this.bookAuthor });
  }
);

Then(
  "I should be able to view the book details",
  async function (this: ICustomWorld) {
    const booksPage = new BooksPage(this);
    await booksPage.clickBookCover(this.bookTitle);

    const bookDetailsPage = new BookDetailsPage(this);
    await bookDetailsPage.verifyBookDetails({
      title: this.bookTitle,
      description: this.bookDescription,
      author: this.bookAuthor,
      year: this.bookYear,
      genres: this.bookGenres,
    });
    await bookDetailsPage.goBack();
  }
);

Then(
  "I should be able to download or read the book online",
  async function (this: ICustomWorld) {
    const booksPage = new BooksPage(this);
    await booksPage.clickBookCover(this.bookTitle);

    const bookDetailsPage = new BookDetailsPage(this);
    await bookDetailsPage.verifyDownloadAndReadOnlineButtons();
    await bookDetailsPage.goBack();
  }
);

Then(
  "I should be able to delete the book",
  async function (this: ICustomWorld) {
    const booksPage = new BooksPage(this);
    await booksPage.deleteBook(this.bookTitle);
  }
);

Then(
  "I should stay on the book creation page",
  async function (this: ICustomWorld) {
    const booksPage = new BooksPage(this);
    await booksPage.verifyOnBookCreationPage();
  }
);

Then("I should see the PDF viewer", async function (this: ICustomWorld) {
  const bookDetailsPage = new BookDetailsPage(this);
  await bookDetailsPage.verifyPdfViewer();
});

Then(
  "I should be able to download the book",
  async function (this: ICustomWorld) {
    const bookDetailsPage = new BookDetailsPage(this);
    await bookDetailsPage.waitForDownload(this.bookTitle);
  }
);

// New step definitions to add to common.steps.ts

When("I click on the search field", async function (this: ICustomWorld) {
  // This is part of the search method in DashboardPage
  // No direct action needed here if search is called next
  // If it's a standalone click:
  const dashboardPage = new DashboardPage(this);
  await dashboardPage.search(""); // Click and prepare for fill
});

When(
  "I enter the book title in the search field",
  async function (this: ICustomWorld) {
    const dashboardPage = new DashboardPage(this);
    // Assuming search field was already clicked or fill handles it
    await this.page.getByPlaceholder("Search…").fill(this.bookTitle);
  }
);

When("I press Enter", async function (this: ICustomWorld) {
  await this.page.keyboard.press("Enter");
});

When(
  "I navigate to the {string} catalog",
  async function (this: ICustomWorld, catalogName: string) {
    const dashboardPage = new DashboardPage(this);
    await dashboardPage.clickCatalog(catalogName);
  }
);

When(
  "I select {string} from the genre filter",
  async function (this: ICustomWorld, genre: string) {
    const booksPage = new BooksPage(this);
    await booksPage.selectGenreFilter(genre);
  }
);

When(
  "I enter the book author in the author filter",
  async function (this: ICustomWorld) {
    const booksPage = new BooksPage(this);
    await booksPage.fillAuthorFilter(this.bookAuthor);
  }
);

When(
  "I enter the book year in the year filter",
  async function (this: ICustomWorld) {
    const booksPage = new BooksPage(this);
    await booksPage.fillYearFilter(this.bookYear);
  }
);

Then(
  "I should see search results containing my book",
  async function (this: ICustomWorld) {
    const booksPage = new BooksPage(this); // Assuming search results are on a BooksPage-like view
    await booksPage.verifyBookInCollection({ title: this.bookTitle, author: this.bookAuthor });
  }
);

// Cleanup after each scenario
After(async function (this: ICustomWorld) {
  await this.teardown();
});
