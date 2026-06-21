import { DndContext } from "@dnd-kit/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { Column } from "@/components/Column";
import { BoardProvider, useBoard } from "@/lib/boardContext";
import type { BoardState } from "@/lib/types";

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
});

const initialState: BoardState = {
  columns: [{ id: "col1", title: "Backlog", cardIds: ["a", "b"] }],
  cards: {
    a: { id: "a", title: "First", details: "" },
    b: { id: "b", title: "Second", details: "" },
  },
};

function ColumnTitleProbe() {
  const { state } = useBoard();
  return <output data-testid="title">{state.columns[0].title}</output>;
}

function ColumnCardCountProbe() {
  const { state } = useBoard();
  return (
    <output data-testid="cardcount">{state.columns[0].cardIds.length}</output>
  );
}

function LiveColumn() {
  const { state } = useBoard();
  return <Column column={state.columns[0]} />;
}

function setup(state: BoardState = initialState) {
  return render(
    <BoardProvider initialState={state}>
      <DndContext>
        <LiveColumn />
        <ColumnTitleProbe />
        <ColumnCardCountProbe />
      </DndContext>
    </BoardProvider>,
  );
}

describe("Column", () => {
  it("renders the column title and its cards", () => {
    setup();
    expect(
      screen.getByRole("button", { name: /rename: column: backlog/i }),
    ).toHaveTextContent("Backlog");
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renames the column when the title is edited and Enter is pressed", async () => {
    setup();
    await userEvent.click(
      screen.getByRole("button", { name: /rename: column: backlog/i }),
    );
    const input = screen.getByLabelText("Column: Backlog");
    await userEvent.clear(input);
    await userEvent.type(input, "Planning{Enter}");
    expect(screen.getByTestId("title")).toHaveTextContent("Planning");
  });

  it("adds a card via the add-card dialog", async () => {
    setup();
    expect(screen.getByTestId("cardcount")).toHaveTextContent("2");
    await userEvent.click(
      screen.getByRole("button", { name: /^\+ add card$/i }),
    );
    await userEvent.type(screen.getByLabelText("Title"), "Third");
    await userEvent.click(
      screen.getByRole("button", { name: /^Add card$/ }),
    );
    expect(screen.getByTestId("cardcount")).toHaveTextContent("3");
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("ignores blank rename submissions", async () => {
    setup();
    await userEvent.click(
      screen.getByRole("button", { name: /rename: column: backlog/i }),
    );
    const input = screen.getByLabelText("Column: Backlog");
    await userEvent.clear(input);
    await userEvent.type(input, "   {Enter}");
    expect(screen.getByTestId("title")).toHaveTextContent("Backlog");
  });
});
