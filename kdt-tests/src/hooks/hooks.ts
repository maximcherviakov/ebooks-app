import { Before, After, AfterStep } from "@cucumber/cucumber";
import { CustomWorld } from "./customWorld";
import * as fs from "fs";
import * as path from "path";

// Ensure screenshots directory exists
const screenshotsDir = path.join(process.cwd(), "test-results", "screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

Before(async function (this: CustomWorld) {
  await this.init();
});

AfterStep(async function (this: CustomWorld, { pickle, pickleStep }) {
  // Generate a unique filename for the screenshot
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const stepText = pickleStep.text.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
  const scenarioName = pickle.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
  const filename = `${scenarioName}_${stepText}_${timestamp}.png`;
  const screenshotPath = path.join(screenshotsDir, filename);

  try {
    // Take screenshot
    await this.page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      type: 'png'
    });
    
    console.log(`Screenshot saved: ${screenshotPath}`);
    
    // Attach screenshot to cucumber report if needed
    if (this.attach) {
      const screenshot = fs.readFileSync(screenshotPath);
      this.attach(screenshot, 'image/png');
    }
  } catch (error) {
    console.error(`Failed to take screenshot: ${error}`);
  }
});

After(async function (this: CustomWorld) {
  await this.teardown();
});
