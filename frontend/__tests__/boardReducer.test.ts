import { describe, expect, it } from "vitest";
import { boardReducer } from "@/lib/boardReducer";
import type { BoardState } from "@/lib/types";

function makeState(): BoardState {
  return {
    columns: [
      { id: "a", title: "A", cardIds: ["c1", "c2"] },
      { id: "b", title: "B", cardIds: ["c3"] },
      { id: "c", title: "C", cardIds: [] },
    ],
    cards: {
      c1: { id: "c1", title: "One", details: "" },
      c2: { id: "c2", title: "Two", details: "" },
      c3: { id: "c3", title: "Three", details: "" },
    },
  };
}

describe("ADD_CARD", () => {
  it("appends the card to the target column and registers it in cards", () => {
    const next = boardReducer(makeState(), {
      type: "ADD_CARD",
      columnId: "b",
      card: { id: "c4", title: "Four", details: "d" },
    });
    expect(next.columns.find((c) => c.id === "b")?.cardIds).toEqual([
      "c3",
      "c4",
    ]);
    expect(next.cards.c4).toEqual({ id: "c4", title: "Four", details: "d" });
  });

  it("does not mutate other columns", () => {
    const state = makeState();
    const next = boardReducer(state, {
      type: "ADD_CARD",
      columnId: "a",
      card: { id: "c5", title: "Five", details: "" },
    });
    expect(next.columns.find((c) => c.id === "b")?.cardIds).toEqual(["c3"]);
  });
});

describe("DELETE_CARD", () => {
  it("removes the card from the cards map and from its column", () => {
    const next = boardReducer(makeState(), {
      type: "DELETE_CARD",
      cardId: "c1",
    });
    expect(next.cards.c1).toBeUndefined();
    expect(next.columns.find((c) => c.id === "a")?.cardIds).toEqual(["c2"]);
  });

  it("is a no-op for unknown card ids (other state unchanged)", () => {
    const state = makeState();
    const next = boardReducer(state, {
      type: "DELETE_CARD",
      cardId: "missing",
    });
    expect(next.cards).toEqual(state.cards);
    expect(next.columns.map((c) => c.cardIds)).toEqual(
      state.columns.map((c) => c.cardIds),
    );
  });
});

describe("MOVE_CARD across columns", () => {
  it("moves a card between columns at the requested index", () => {
    const next = boardReducer(makeState(), {
      type: "MOVE_CARD",
      cardId: "c1",
      fromColumnId: "a",
      toColumnId: "b",
      toIndex: 0,
    });
    expect(next.columns.find((c) => c.id === "a")?.cardIds).toEqual(["c2"]);
    expect(next.columns.find((c) => c.id === "b")?.cardIds).toEqual([
      "c1",
      "c3",
    ]);
  });

  it("moves a card to an empty column", () => {
    const next = boardReducer(makeState(), {
      type: "MOVE_CARD",
      cardId: "c2",
      fromColumnId: "a",
      toColumnId: "c",
      toIndex: 0,
    });
    expect(next.columns.find((c) => c.id === "a")?.cardIds).toEqual(["c1"]);
    expect(next.columns.find((c) => c.id === "c")?.cardIds).toEqual(["c2"]);
  });

  it("clamps toIndex beyond the column length", () => {
    const next = boardReducer(makeState(), {
      type: "MOVE_CARD",
      cardId: "c1",
      fromColumnId: "a",
      toColumnId: "b",
      toIndex: 99,
    });
    expect(next.columns.find((c) => c.id === "b")?.cardIds).toEqual([
      "c3",
      "c1",
    ]);
  });
});

describe("MOVE_CARD within a column", () => {
  it("reorders within the same column", () => {
    const next = boardReducer(makeState(), {
      type: "MOVE_CARD",
      cardId: "c1",
      fromColumnId: "a",
      toColumnId: "a",
      toIndex: 1,
    });
    expect(next.columns.find((c) => c.id === "a")?.cardIds).toEqual([
      "c2",
      "c1",
    ]);
  });

  it("no-op when moving to current index", () => {
    const state = makeState();
    const next = boardReducer(state, {
      type: "MOVE_CARD",
      cardId: "c1",
      fromColumnId: "a",
      toColumnId: "a",
      toIndex: 0,
    });
    expect(next.columns.find((c) => c.id === "a")?.cardIds).toEqual([
      "c1",
      "c2",
    ]);
  });
});

describe("RENAME_COLUMN", () => {
  it("updates the column title and trims whitespace", () => {
    const next = boardReducer(makeState(), {
      type: "RENAME_COLUMN",
      columnId: "a",
      title: "  Planning  ",
    });
    expect(next.columns.find((c) => c.id === "a")?.title).toBe("Planning");
  });

  it("ignores empty or whitespace-only titles", () => {
    const state = makeState();
    const next = boardReducer(state, {
      type: "RENAME_COLUMN",
      columnId: "a",
      title: "   ",
    });
    expect(next).toBe(state);
  });
});
