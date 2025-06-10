import { expect } from "@playwright/test";
import { ICustomWorld } from "../hooks/customWorld";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  private emailTextbox = this.page.getByRole("textbox", { name: "Email" });
  private passwordTextbox = this.page.getByRole("textbox", { name: "Password" });
  private signInButton = this.page.getByRole("button", { name: "Sign in" });
  private signUpLink = this.page.getByRole("link", { name: "Sign up" });

  async navigate(): Promise<void> {
    await super.navigateTo();
    await this.clickLink("Login");
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailTextbox.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordTextbox.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickSignUpLink(): Promise<void> {
    await this.signUpLink.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async getEmailErrorMessage(message: string) {
    return this.page.locator("#email-helper-text.Mui-error", { hasText: message });
  }

  async getPasswordErrorMessage(message: string) {
    return this.page.locator("#password-helper-text.Mui-error", { hasText: message });
  }
}
