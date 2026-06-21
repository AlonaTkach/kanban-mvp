"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { useBoard } from "@/lib/boardContext";
import type { Column as ColumnType } from "@/lib/types";
import { AddCardForm } from "./AddCardForm";
import { Card } from "./Card";
import { EditableTitle } from "./EditableTitle";

type Props = {
  column: ColumnType;
  index?: number;
};

const ACCENT_BARS = [
  "from-[color:var(--color-primary)] to-[color:var(--color-accent)]",
  "from-[color:var(--color-accent)] to-[color:var(--color-primary)]",
  "from-[color:var(--color-primary)] via-[color:var(--color-accent)] to-[color:var(--color-primary)]",
  "from-[color:var(--color-accent)] via-[color:var(--color-primary)] to-[color:var(--color-accent)]",
  "from-[color:var(--color-primary)] to-[color:var(--color-accent)]",
];

export function Column({ column, index = 0 }: Props) {
  const { state, dispatch } = useBoard();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  const accent = ACCENT_BARS[index % ACCENT_BARS.length];

  return (
    <section
      data-testid={`column-${column.id}`}
      className="relative flex flex-col w-80 shrink-0 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] shadow-lg overflow-hidden"
    >
      <div
        aria-hidden
        className={`h-1 w-full bg-gradient-to-r ${accent}`}
      />
      <header className="px-4 pt-4 pb-3 flex items-center justify-between gap-2">
        <EditableTitle
          value={column.title}
          ariaLabel={`Column: ${column.title}`}
          onCommit={(title) =>
            dispatch({ type: "RENAME_COLUMN", columnId: column.id, title })
          }
          className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-text)]"
        />
        <span className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full bg-[color:var(--color-primary)]/20 text-[color:var(--color-accent)] border border-[color:var(--color-primary)]/40">
          {column.cardIds.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={`flex-1 column-scroll overflow-y-auto px-3 pb-3 min-h-24 transition-colors ${
          isOver
            ? "bg-[color:var(--color-primary)]/15 ring-1 ring-inset ring-[color:var(--color-accent)]/50"
            : ""
        }`}
      >
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {column.cardIds.map((cardId) => {
              const card = state.cards[cardId];
              if (!card) return null;
              return <Card key={cardId} card={card} columnId={column.id} />;
            })}
          </div>
        </SortableContext>
      </div>

      <div className="px-3 pb-3 pt-1">
        <AddCardForm
          columnName={column.title}
          onSubmit={(title, details) =>
            dispatch({
              type: "ADD_CARD",
              columnId: column.id,
              card: { id: nanoid(), title, details },
            })
          }
        />
      </div>
    </section>
  );
}
