import { expect } from "@playwright/test";
import { ICustomWorld } from "../hooks/customWorld";
import { BasePage } from "./BasePage";

export class BookDetailsPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  async verifyBookDetails(book: {
    title: string;
    description?: string;
    author: string;
    year: string;
    genres?: string[];
  }): Promise<void> {
    await this.page.getByRole("heading", { name: book.title }).waitFor();
    if (book.description) {
      await this.page.getByText(book.description).waitFor();
    }
    await this.page.getByText(book.author).waitFor();
    await this.page.getByText(book.year).waitFor();

    if (book.genres) {
      for (const genre of book.genres) {
        await this.page.locator(".MuiChip-root", { hasText: genre }).waitFor();
      }
    }
  }

  async verifyDownloadAndReadOnlineButtons(): Promise<void> {
    await this.page.getByRole("link", { name: "Download" }).waitFor();
    await this.page.getByRole("button", { name: "Read Online" }).waitFor();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async verifyPdfViewer(): Promise<void> {
    await this.page.getByRole("button", { name: "Close Reader" }).waitFor();
    const iframeLocator = this.page.locator('iframe[title="PDF Viewer"]');
    await iframeLocator.waitFor({ state: "attached" });
    const frameHandle = await iframeLocator.elementHandle();
    const frame = await frameHandle?.contentFrame();
    if (!frame) throw new Error("Iframe with PDF Viewer not found or not loaded");
    await frame.locator("embed[type='application/pdf']").waitFor();
  }

  async waitForDownload(expectedTitle: string): Promise<string> {
    // Set up the download promise before clicking the link
    const downloadPromise = this.page.waitForEvent("download");
    
    // Click the download link to trigger the download
    await this.page.getByRole("link", { name: "Download" }).click();
    
    // Wait for the download to complete
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).toBeTruthy();
    
    // Verify the download has the correct filename
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toContain(".pdf");
    expect(suggestedFilename.toLowerCase()).toContain(expectedTitle.toLowerCase());
    return suggestedFilename;
  }
}
