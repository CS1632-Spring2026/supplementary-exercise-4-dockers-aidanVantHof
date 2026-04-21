import { test, expect } from '@playwright/test';

// I added this to make setting up the text fixture easier
// You don't need to add the page.goto("the main site") unless it's for a different url like for test-10
// We don't need to worry about checking the chrome/firefox version because that's assumed that the user is on
// an up to date version
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.evaluate(() => {
    document.cookie = "1=false";
    document.cookie = "2=false";
    document.cookie = "3=false";
  });
});


test('TEST-1-RESET', async ({ page }) => {
  await page.getByRole('link', { name: 'Reset' }).click();
  await expect(page.locator('.list-group-item').nth(0)).toHaveText("ID 1. Jennyanydots");
  await expect(page.locator('.list-group-item').nth(1)).toHaveText("ID 2. Old Deuteronomy");
  await expect(page.locator('.list-group-item').nth(2)).toHaveText("ID 3. Mistoffelees");
});


test('TEST-2-CATALOG', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await expect(page.locator('img').nth(1)).toHaveAttribute("src", "/images/cat2.jpg")

});


test('TEST-3-LISTING', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await expect(page.locator('.list-group-item')).toHaveCount(3);
  await expect(page.locator('.list-group-item').nth(2)).toHaveText("ID 3. Mistoffelees");

});


test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();

});


test('TEST-5-RENT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).click();
  await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).fill('1');
  await page.getByRole('button', { name: 'Rent' }).click();

  await expect(page.locator('.list-group-item').nth(0)).toHaveText("Rented out");
  await expect(page.locator('.list-group-item').nth(1)).toHaveText("ID 2. Old Deuteronomy");
  await expect(page.locator('.list-group-item').nth(2)).toHaveText("ID 3. Mistoffelees");
  await expect(page.locator('#rentResult')).toHaveText("Success!");
});


test('TEST-6-RETURN', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
  await page.goto('http://localhost:8080');
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

  await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).click();
  await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).fill('2');
  await page.getByRole('button', { name: 'Return' }).click();

  await expect(page.locator('.list-group-item').nth(0)).toHaveText("ID 1. Jennyanydots");
  await expect(page.locator('.list-group-item').nth(1)).toHaveText("ID 2. Old Deuteronomy");
  await expect(page.locator('.list-group-item').nth(2)).toHaveText("Rented out");
  await expect(page.locator('#returnResult')).toHaveText("Success!");


});


test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();

});


test('TEST-8-FEED', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).click();
  await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('6');
  await page.getByRole('button', { name: 'Feed' }).click();


  await expect(page.locator('#feedResult')).toHaveText("Nom, nom, nom.", { timeout: 10000 });

});


test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
  await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible();

});


test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');
  await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();

});


test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

  await expect(page.locator('body')).toHaveScreenshot();
});