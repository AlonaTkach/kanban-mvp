"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBoard } from "@/lib/boardContext";
import type { Card as CardType } from "@/lib/types";

type Props = {
  card: CardType;
  columnId: string;
};

export function Card({ card, columnId }: Props) {
  const { dispatch } = useBoard();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "card", columnId },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`card-${card.id}`}
      className="group relative rounded-lg bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] p-3 shadow-sm hover:border-[color:var(--color-primary)] hover:shadow-[0_8px_24px_-12px_rgba(109,40,217,0.6)] hover:-translate-y-px transition-all cursor-grab active:cursor-grabbing select-none"
    >
      <button
        type="button"
        aria-label={`Delete card: ${card.title}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "DELETE_CARD", cardId: card.id });
        }}
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-[color:var(--color-text-muted)] hover:text-[color:var(--color-accent)] text-base leading-none h-6 w-6 flex items-center justify-center rounded-md hover:bg-[color:var(--color-primary)]/20 transition-all"
      >
        ×
      </button>
      <div className="text-sm font-medium pr-6 leading-snug">{card.title}</div>
      {card.details && (
        <div className="text-xs text-[color:var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
          {card.details}
        </div>
      )}
    </div>
  );
}

export function CardOverlay({ card }: { card: CardType }) {
  return (
    <div className="rounded-lg bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-accent)] p-3 shadow-[0_20px_60px_-20px_rgba(250,204,21,0.6)] rotate-2 cursor-grabbing">
      <div className="text-sm font-medium leading-snug">{card.title}</div>
      {card.details && (
        <div className="text-xs text-[color:var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
          {card.details}
        </div>
      )}
    </div>
  );
}
