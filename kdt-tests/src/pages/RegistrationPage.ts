import { expect } from "@playwright/test";
import { ICustomWorld } from "../hooks/customWorld";
import { BasePage } from "./BasePage";

export class RegistrationPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  private usernameTextbox = this.page.getByRole("textbox", { name: "Username" });
  private emailTextbox = this.page.getByRole("textbox", { name: "Email" });
  private passwordTextbox = this.page.getByRole("textbox", { name: "Password" });
  private signUpButton = this.page.getByRole("button", { name: "Sign up" });

  async navigate(): Promise<void> {
    await super.navigateTo();
    await this.clickLink("Login");
    await this.clickLink("Sign up");
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameTextbox.fill(username);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailTextbox.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordTextbox.fill(password);
  }

  async clickSignUpButton(): Promise<void> {
    await this.signUpButton.click();
  }

  async register(username: string, email: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignUpButton();
  }

  async getUsernameErrorMessage(message: string) {
    return this.page.locator("#username-helper-text.Mui-error", { hasText: message });
  }

  async getEmailErrorMessage(message: string) {
    return this.page.locator("#email-helper-text.Mui-error", { hasText: message });
  }

  async getPasswordErrorMessage(message: string) {
    return this.page.locator("#password-helper-text.Mui-error", { hasText: message });
  }
}
