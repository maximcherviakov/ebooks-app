import { Page } from "@playwright/test";
import { ICustomWorld } from "../hooks/customWorld";

export class BasePage {
  protected readonly page: Page;
  protected readonly world: ICustomWorld;

  constructor(world: ICustomWorld) {
    this.world = world;
    this.page = world.page;
  }

  async navigateTo(path: string = ""): Promise<void> {
    await this.page.goto(`${this.world.config.baseUrl}${path}`);
  }

  async clickButton(buttonName: string): Promise<void> {
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async clickLink(linkName: string): Promise<void> {
    await this.page.getByRole("link", { name: linkName }).click();
  }

  async getByText(text: string) {
    return this.page.getByText(text);
  }

  async waitForTextMessage(message: string): Promise<void> {
    await this.page.getByText(message).waitFor();
  }
}
