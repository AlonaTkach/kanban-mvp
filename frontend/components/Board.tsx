"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { useBoard } from "@/lib/boardContext";
import type { BoardState } from "@/lib/types";
import { CardOverlay } from "./Card";
import { Column } from "./Column";

function findContainerId(state: BoardState, id: string): string | undefined {
  if (state.columns.some((c) => c.id === id)) return id;
  return state.columns.find((c) => c.cardIds.includes(id))?.id;
}

const dropAnimation: DropAnimation = {
  duration: 220,
  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.4" } },
  }),
};

export function Board() {
  const { state, dispatch } = useBoard();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragStart(event: DragStartEvent) {
    setActiveCardId(String(event.active.id));
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const fromColumnId = findContainerId(state, activeId);
    const toColumnId = findContainerId(state, overId);
    if (!fromColumnId || !toColumnId) return;
    if (fromColumnId === toColumnId) return;

    const toColumn = state.columns.find((c) => c.id === toColumnId);
    if (!toColumn) return;

    dispatch({
      type: "MOVE_CARD",
      cardId: activeId,
      fromColumnId,
      toColumnId,
      toIndex: toColumn.cardIds.length,
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCardId(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromColumnId = findContainerId(state, activeId);
    const toColumnId = findContainerId(state, overId);
    if (!fromColumnId || !toColumnId) return;

    const toColumn = state.columns.find((c) => c.id === toColumnId);
    if (!toColumn) return;

    const overIsColumn = state.columns.some((c) => c.id === overId);
    const toIndex = overIsColumn
      ? toColumn.cardIds.length
      : toColumn.cardIds.indexOf(overId);

    dispatch({
      type: "MOVE_CARD",
      cardId: activeId,
      fromColumnId,
      toColumnId,
      toIndex: toIndex < 0 ? toColumn.cardIds.length : toIndex,
    });
  }

  function onDragCancel() {
    setActiveCardId(null);
  }

  const activeCard = activeCardId ? state.cards[activeCardId] : null;

  return (
    <DndContext
      id="kanban-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="flex-1 overflow-x-auto board-scroll px-8 pb-8">
        <div className="flex gap-4 items-start h-full min-h-[calc(100vh-9rem)]">
          {state.columns.map((column, index) => (
            <Column key={column.id} column={column} index={index} />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeCard ? <CardOverlay card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
