import { Before, After, AfterStep } from "@cucumber/cucumber";
import { CustomWorld } from "./customWorld";

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld) {
  await this.teardown();
});
