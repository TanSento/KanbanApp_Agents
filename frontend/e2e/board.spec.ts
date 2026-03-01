import { test, expect } from "@playwright/test";

test.describe("Kanban board", () => {
  test("loads with dummy data: columns and cards visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("board-heading")).toHaveText("Kanban");
    await expect(page.getByTestId("column-col-1")).toBeVisible();
    await expect(page.getByTestId("column-col-5")).toBeVisible();
    await expect(page.getByTestId("column-col-1-title")).toHaveText("Backlog");
    await expect(page.getByTestId("card-card-1")).toBeVisible();
    await expect(page.getByText("Setup repo")).toBeVisible();
    await expect(page.getByText("MVP scope")).toBeVisible();
  });

  test("add a card and verify it appears in the column", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("column-col-4-add").click();
    await page.getByTestId("column-col-4-new-title").fill("E2E card");
    await page.getByTestId("column-col-4-submit-card").click();
    await expect(page.getByText("E2E card")).toBeVisible();
    await expect(page.getByTestId("column-col-4").getByText("E2E card")).toBeVisible();
  });

  test("delete a card and verify it disappears", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("card-card-1")).toBeVisible();
    await page.getByTestId("card-card-1-delete").click();
    await expect(page.getByTestId("card-card-1")).not.toBeVisible();
    await expect(page.getByText("Setup repo")).not.toBeVisible();
  });

  test("rename a column and verify new title is shown", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("column-col-2-title")).toHaveText("To Do");
    await page.getByTestId("column-col-2-title").click();
    await page.getByTestId("column-col-2-title-input").fill("Ready");
    await page.getByTestId("column-col-2-title-input").blur();
    await expect(page.getByTestId("column-col-2-title")).toHaveText("Ready");
  });

  test("move a card to another column via drag and drop", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("card-card-1");
    const targetColumn = page.getByTestId("column-col-4");
    await expect(card).toBeVisible();
    await expect(targetColumn.getByTestId("card-card-1")).not.toBeVisible();
    const cardBox = await card.boundingBox();
    const targetBox = await targetColumn.boundingBox();
    if (!cardBox || !targetBox) throw new Error("Missing bounding box");
    await page.mouse.move(
      cardBox.x + cardBox.width / 2,
      cardBox.y + cardBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );
    await page.mouse.up();
    await expect(targetColumn.getByTestId("card-card-1")).toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByTestId("column-col-1").getByTestId("card-card-1")).not.toBeVisible();
  });
});
