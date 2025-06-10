import { expect } from "@playwright/test";
import { ICustomWorld } from "../hooks/customWorld";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  private settingsLink = this.page.getByRole("link", { name: "Settings" });
  private myBooksLink = this.page.getByRole("link", { name: "My Books" });
  private logoutLink = this.page.getByRole("link", { name: "Logout" });

  async verifyLoggedIn(username: string, email: string): Promise<void> {
    await this.page.getByRole("heading", { name: `User name: ${username}` }).waitFor();
    await this.page.getByRole("heading", { name: `Email: ${email}` }).waitFor();
    await expect(this.page).toHaveURL(/dashboard/);
  }

  async navigateToSettings(): Promise<void> {
    await this.settingsLink.click();
    await expect(this.page).toHaveURL(/dashboard\/settings/);
  }

  async navigateToMyBooks(): Promise<void> {
    await this.myBooksLink.click();
    await expect(this.page).toHaveURL(/dashboard\/books/);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/\/$/);
  }

  async clickCatalog(catalogName: string): Promise<void> {
    await this.page
      .locator(".MuiAppBar-root .MuiBox-root", { hasText: catalogName })
      .click();
  }

  async search(searchTerm: string): Promise<void> {
    const searchField = this.page.getByPlaceholder("Search…");
    await searchField.click();
    await searchField.fill(searchTerm);
    await this.page.keyboard.press("Enter");
  }
}
