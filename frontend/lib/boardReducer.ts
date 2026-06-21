import type { BoardAction, BoardState } from "./types";

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_CARD": {
      const { columnId, card } = action;
      return {
        cards: { ...state.cards, [card.id]: card },
        columns: state.columns.map((col) =>
          col.id === columnId
            ? { ...col, cardIds: [...col.cardIds, card.id] }
            : col,
        ),
      };
    }

    case "DELETE_CARD": {
      const { cardId } = action;
      const cards = { ...state.cards };
      delete cards[cardId];
      return {
        cards,
        columns: state.columns.map((col) =>
          col.cardIds.includes(cardId)
            ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
            : col,
        ),
      };
    }

    case "MOVE_CARD": {
      const { cardId, fromColumnId, toColumnId, toIndex } = action;

      if (fromColumnId === toColumnId) {
        return {
          ...state,
          columns: state.columns.map((col) => {
            if (col.id !== fromColumnId) return col;
            const without = col.cardIds.filter((id) => id !== cardId);
            const clamped = Math.max(0, Math.min(toIndex, without.length));
            const next = [...without];
            next.splice(clamped, 0, cardId);
            return { ...col, cardIds: next };
          }),
        };
      }

      return {
        ...state,
        columns: state.columns.map((col) => {
          if (col.id === fromColumnId) {
            return {
              ...col,
              cardIds: col.cardIds.filter((id) => id !== cardId),
            };
          }
          if (col.id === toColumnId) {
            const clamped = Math.max(0, Math.min(toIndex, col.cardIds.length));
            const next = [...col.cardIds];
            next.splice(clamped, 0, cardId);
            return { ...col, cardIds: next };
          }
          return col;
        }),
      };
    }

    case "RENAME_COLUMN": {
      const { columnId, title } = action;
      const trimmed = title.trim();
      if (!trimmed) return state;
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === columnId ? { ...col, title: trimmed } : col,
        ),
      };
    }
  }
}
