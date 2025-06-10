import { expect } from "@playwright/test";
import { ICustomWorld } from "../hooks/customWorld";
import { BasePage } from "./BasePage";

export class SettingsPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  private currentPasswordTextbox = this.page.getByLabel("Current Password");
  private newPasswordTextbox = this.page.getByLabel("New Password", { exact: true });
  private confirmNewPasswordTextbox = this.page.getByLabel("Confirm New Password");

  async verifyOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard\/settings/);
  }

  async fillCurrentPassword(password: string): Promise<void> {
    await this.currentPasswordTextbox.fill(password);
  }

  async fillNewPassword(password: string): Promise<void> {
    await this.newPasswordTextbox.fill(password);
  }

  async fillConfirmNewPassword(password: string): Promise<void> {
    await this.confirmNewPasswordTextbox.fill(password);
  }

  async getCurrentPasswordErrorMessage(message: string) {
    return this.page.locator("#currentPassword-helper-text.Mui-error", { hasText: message });
  }

  async getNewPasswordErrorMessage(message: string) {
    return this.page.locator("#newPassword-helper-text.Mui-error", { hasText: message });
  }

  async getConfirmPasswordErrorMessage(message: string) {
    return this.page.locator("#confirmPassword-helper-text.Mui-error", { hasText: message });
  }

  async getSuccessMessage(message: string) {
    return this.page.locator(".MuiAlert-colorSuccess .MuiAlert-message", { hasText: message });
  }
}
