import { expect, test, type Page, type Locator } from "@playwright/test";

async function dragTo(page: Page, source: Locator, target: Locator) {
  const src = await source.boundingBox();
  const dst = await target.boundingBox();
  if (!src || !dst) throw new Error("missing bounding box");
  await page.mouse.move(src.x + src.width / 2, src.y + src.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    src.x + src.width / 2 + 12,
    src.y + src.height / 2 + 12,
    { steps: 5 },
  );
  await page.mouse.move(
    dst.x + dst.width / 2,
    dst.y + dst.height / 2,
    { steps: 20 },
  );
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("page loads with five populated columns", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Kanban" })).toBeVisible();
  for (const id of [
    "col-backlog",
    "col-todo",
    "col-in-progress",
    "col-review",
    "col-done",
  ]) {
    await expect(page.getByTestId(`column-${id}`)).toBeVisible();
  }
  await expect(page.getByText("Define onboarding flow")).toBeVisible();
  await expect(page.getByText("Ship dark-mode toggle")).toBeVisible();
});

test("adding a card makes it appear in the chosen column", async ({ page }) => {
  const todo = page.getByTestId("column-col-todo");
  await todo.getByRole("button", { name: "+ Add card", exact: true }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "To Do" })).toBeVisible();
  await dialog.getByLabel("Title").fill("Write release notes");
  await dialog.getByLabel(/description/i).fill("Highlights for v1.2");
  await dialog.getByRole("button", { name: "Add card", exact: true }).click();

  await expect(todo.getByText("Write release notes")).toBeVisible();
  await expect(todo.getByText("Highlights for v1.2")).toBeVisible();
});

test("deleting a card removes it from the board", async ({ page }) => {
  const card = page.getByTestId("card-c7");
  await expect(card).toBeVisible();
  await card.hover();
  await card
    .getByRole("button", { name: "Delete card: Migrate email templates", exact: true })
    .click({ force: true });
  await expect(card).toHaveCount(0);
});

test("renaming a column updates its header", async ({ page }) => {
  const column = page.getByTestId("column-col-backlog");
  await column
    .getByRole("button", { name: "Rename: Column: Backlog", exact: true })
    .click();
  const input = column.getByRole("textbox", { name: "Column: Backlog" });
  await expect(input).toBeVisible();
  await input.fill("Inbox");
  await input.press("Enter");
  await expect(
    column.getByRole("button", { name: "Rename: Column: Inbox", exact: true }),
  ).toHaveText("Inbox");
});

test("dragging a card to another column moves it", async ({ page }) => {
  const card = page.getByTestId("card-c1");
  const targetColumn = page.getByTestId("column-col-done");

  await expect(
    page.getByTestId("column-col-backlog").getByTestId("card-c1"),
  ).toBeVisible();

  await dragTo(page, card, targetColumn);

  await expect(targetColumn.getByTestId("card-c1")).toBeVisible();
  await expect(
    page.getByTestId("column-col-backlog").getByTestId("card-c1"),
  ).toHaveCount(0);
});

test("dragging a card within a column reorders it", async ({ page }) => {
  const backlog = page.getByTestId("column-col-backlog");
  const cards = backlog.locator('[data-testid^="card-"]');

  const initialOrder = await cards.evaluateAll((els) =>
    els.map((e) => e.getAttribute("data-testid")),
  );
  expect(initialOrder).toEqual(["card-c1", "card-c2", "card-c3"]);

  const source = backlog.getByTestId("card-c1");
  const target = backlog.getByTestId("card-c3");
  await dragTo(page, source, target);

  await expect.poll(async () =>
    cards.evaluateAll((els) => els.map((e) => e.getAttribute("data-testid"))),
  ).not.toEqual(initialOrder);
});
