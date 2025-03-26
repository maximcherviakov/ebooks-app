import {
  World,
  IWorldOptions,
  setWorldConstructor,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;

  username: string;
  email: string;
  password: string;
  newPassword: string;

  bookTitle: string;
  bookAuthor: string;
  bookDescription: string;
  bookYear: string;
  bookGenres: string[];

  config: {
    baseUrl: string;
  };

  init(): Promise<void>;
  teardown(): Promise<void>;
}

export class CustomWorld extends World implements ICustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  username: string = "";
  email: string = "";
  password: string = "";
  newPassword: string = "";

  bookTitle: string = "";
  bookAuthor: string = "";
  bookDescription: string = "";
  bookYear: string = "";
  bookGenres: string[] = [];

  config = {
    baseUrl: process.env.BASE_URL || "http://localhost",
  };

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async teardown(): Promise<void> {
    await this.page.close();
    await this.context.close();
    await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(10000);
