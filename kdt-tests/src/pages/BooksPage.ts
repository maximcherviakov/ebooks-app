import { expect, Page } from "@playwright/test";
import { ICustomWorld } from "../hooks/customWorld";
import { BasePage } from "./BasePage";
import path from "path";

export class BooksPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  private titleTextbox = this.page.getByRole("textbox", { name: "Title" });
  private descriptionTextbox = this.page.getByRole("textbox", { name: "Description" });
  private authorTextbox = this.page.getByRole("textbox", { name: "Author" });
  private yearSpinbutton = this.page.getByRole("spinbutton", { name: "Year" });
  private genreCombobox = this.page.getByRole("combobox");
  private pdfDropzone = this.page.getByText("Drag and drop a PDF file here, or click to select");

  async verifyOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard\/books/);
  }

  async verifyOnBookCreationPage(): Promise<void> {
    await expect(this.page).toHaveURL(/book\/create/);
  }

  async fillBookTitle(title: string): Promise<void> {
    await this.titleTextbox.fill(title);
  }

  async fillBookDescription(description: string): Promise<void> {
    await this.descriptionTextbox.fill(description);
  }

  async fillBookAuthor(author: string): Promise<void> {
    await this.authorTextbox.fill(author);
  }

  async fillBookYear(year: string): Promise<void> {
    await this.yearSpinbutton.fill(year);
  }

  async selectGenres(genres: string[]): Promise<void> {
    await this.genreCombobox.click();
    for (const genre of genres) {
      await this.page
        .getByRole("option", { name: genre })
        .getByRole("checkbox")
        .check();
    }
    await this.page.keyboard.press("Escape");
  }

  async uploadPdf(filePath: string = "book1.pdf"): Promise<void> {
    const bookPath = path.join(process.cwd(), "/attachments/", filePath);
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.pdfDropzone.click(),
    ]);
    await fileChooser.setFiles(bookPath);
  }

  getBookCard(bookTitle: string) {
    return this.page.locator(".MuiCard-root", { hasText: bookTitle });
  }

  async hoverBookCard(bookTitle: string): Promise<void> {
    await this.getBookCard(bookTitle).hover();
  }

  async clickEditButtonOnBook(bookTitle: string): Promise<void> {
    const bookCard = this.getBookCard(bookTitle);
    const updateButton = bookCard.locator("[data-testid='EditOutlinedIcon']");
    await updateButton.waitFor();
    await updateButton.click();
  }

  async clickBookCover(bookTitle: string): Promise<void> {
    const bookCard = this.getBookCard(bookTitle);
    await bookCard.locator(".MuiCardMedia-media").click();
  }

  async verifyBookForm(bookDetails: { title: string; description: string; author: string; year: string; genres: string[] }): Promise<void> {
    await expect(this.titleTextbox).toHaveValue(bookDetails.title);
    await expect(this.descriptionTextbox).toHaveValue(bookDetails.description);
    await expect(this.authorTextbox).toHaveValue(bookDetails.author);
    await expect(this.yearSpinbutton).toHaveValue(bookDetails.year);
    await expect(this.page.getByText([...bookDetails.genres].sort().join(", "))).toBeVisible();
  }

  async verifyBookInCollection(bookDetails: { title: string; author: string }): Promise<void> {
    const bookCard = this.getBookCard(bookDetails.title);
    await expect(bookCard).toBeVisible();
    await expect(bookCard.locator(".MuiCardMedia-media")).toBeVisible();
    await expect(bookCard.locator(".MuiCardContent-root")).toContainText(bookDetails.author);
  }

  async deleteBook(bookTitle: string): Promise<void> {
    const bookCard = this.getBookCard(bookTitle);
    await this.hoverBookCard(bookTitle);
    const deleteButton = bookCard.locator("[data-testid='DeleteOutlinedIcon']");
    await deleteButton.waitFor();
    await deleteButton.click();
    await this.page
      .locator(".MuiDialog-container .MuiBox-root button")
      .filter({ hasText: "Delete" })
      .click();
    await expect(bookCard).not.toBeVisible();
  }
  
  async selectGenreFilter(genre: string): Promise<void> {
    await this.page
      .locator(".MuiFormControl-root", { hasText: "Genre" })
      .click();
    await this.page.getByRole("option", { name: genre }).click();
  }

  async fillAuthorFilter(author: string): Promise<void> {
    await this.page.locator("input[name='author']").fill(author);
  }

  async fillYearFilter(year: string): Promise<void> {
    await this.page.locator("input[name='year']").fill(year);
  }
}
