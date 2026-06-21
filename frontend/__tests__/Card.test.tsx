import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { Card } from "@/components/Card";
import { BoardProvider, useBoard } from "@/lib/boardContext";
import type { BoardState } from "@/lib/types";

function Wrapper({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: BoardState;
}) {
  return (
    <BoardProvider initialState={initialState}>
      <DndContext>
        <SortableContext items={initialState.columns[0].cardIds}>
          {children}
        </SortableContext>
      </DndContext>
    </BoardProvider>
  );
}

function CardCountProbe() {
  const { state } = useBoard();
  return <output data-testid="count">{Object.keys(state.cards).length}</output>;
}

describe("Card", () => {
  const initialState: BoardState = {
    columns: [{ id: "col", title: "Col", cardIds: ["x"] }],
    cards: { x: { id: "x", title: "Hello", details: "World" } },
  };

  it("renders title and details", () => {
    render(
      <Wrapper initialState={initialState}>
        <Card card={initialState.cards.x} columnId="col" />
      </Wrapper>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("dispatches DELETE_CARD when the delete button is clicked", async () => {
    render(
      <Wrapper initialState={initialState}>
        <Card card={initialState.cards.x} columnId="col" />
        <CardCountProbe />
      </Wrapper>,
    );
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    await userEvent.click(
      screen.getByRole("button", { name: /delete card: hello/i }),
    );
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("hides the details paragraph when details are empty", () => {
    const state: BoardState = {
      columns: [{ id: "col", title: "Col", cardIds: ["y"] }],
      cards: { y: { id: "y", title: "Just title", details: "" } },
    };
    render(
      <Wrapper initialState={state}>
        <Card card={state.cards.y} columnId="col" />
      </Wrapper>,
    );
    expect(screen.getByText("Just title")).toBeInTheDocument();
  });
});
