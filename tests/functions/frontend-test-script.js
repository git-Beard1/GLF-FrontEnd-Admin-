const { expect } = require("@playwright/test");
module.exports = { loadTestFrontEnd };

async function loadTestFrontEnd(page) {
  //
  // The code below is just a standard Playwright script:
  //
  // Go to https://artillery.io/

  //first page test, also, event page
  await page.goto("https://www.ilf2024.info/");
  await page.getByRole("button", { name: "Login" }).nth(1).click();
  await page.click('a.no-underline.text-black.hover\\:underline[href="/"]');
  await page.click("img.rounded-t-md.object-contain.w-96.h-36");
  await expect(page.getByText("Information").nth(1)).toBeVisible();

  //test google map
  await page.click('a.no-underline.text-black.hover\\:underline[href="/map"]');
  await expect(page.getByText("Water Refill")).toBeVisible();
  await page.getByText("Water Refill").click();
  await expect(page.getByText("Registration Desks")).toBeVisible();
  await page.getByText("Registration Desks").click();
  await expect(page.getByText("Convention Centre")).toBeVisible();
  await page.getByText("Convention Centre").click();
  await expect(page.getByText("Restrooms")).toBeVisible();
  await page.getByText("Restrooms").click();

  // Expect the restroom image 
  const image = await page.locator('img[alt="Marker"]');
  await expect(image).toBeVisible();
}
