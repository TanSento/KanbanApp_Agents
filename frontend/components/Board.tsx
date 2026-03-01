"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import type { Board as BoardType, Card as CardType } from "@/types/board";
import {
  moveCard as moveCardAction,
  addCard as addCardAction,
  deleteCard as deleteCardAction,
  renameColumn as renameColumnAction,
} from "@/lib/boardActions";
import { Column } from "./Column";
import { Card } from "./Card";
import styles from "./Board.module.css";
import cardStyles from "./Card.module.css";

function findCardPosition(
  board: BoardType,
  cardId: string
): { columnId: string; index: number } | null {
  for (const col of board.columns) {
    const index = col.cards.findIndex((c) => c.id === cardId);
    if (index !== -1) return { columnId: col.id, index };
  }
  return null;
}

function isColumnId(id: string): boolean {
  return id.startsWith("col-");
}

interface BoardProps {
  initialBoard: BoardType;
}

export function Board({ initialBoard }: BoardProps) {
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === "card" && data.card) {
      setActiveCard(data.card as CardType);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCard(null);
      const { active, over } = event;
      if (!over) return;
      const cardData = active.data.current;
      if (!cardData || cardData.type !== "card") return;
      const cardId = (cardData.card as CardType).id;
      const from = findCardPosition(board, cardId);
      if (!from) return;

      let toColumnId: string;
      let toIndex: number | undefined;

      if (isColumnId(over.id as string)) {
        toColumnId = over.id as string;
        toIndex = undefined;
      } else {
        const to = findCardPosition(board, over.id as string);
        if (!to) return;
        toColumnId = to.columnId;
        toIndex = to.index;
      }

      setBoard((prev) =>
        moveCardAction(prev, cardId, from.columnId, toColumnId, toIndex)
      );
    },
    [board]
  );

  const handleAddCard = useCallback(
    (columnId: string, title: string, details: string) => {
      setBoard((prev) => addCardAction(prev, columnId, title, details));
    },
    []
  );

  const handleDeleteCard = useCallback(
    (columnId: string, cardId: string) => {
      setBoard((prev) => deleteCardAction(prev, columnId, cardId));
    },
    []
  );

  const handleRenameColumn = useCallback((columnId: string, title: string) => {
    setBoard((prev) => renameColumnAction(prev, columnId, title));
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        <h1 className={styles.heading} data-testid="board-heading">
          Kanban
        </h1>
        <div className={styles.columns}>
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddCard={(title, details) =>
                handleAddCard(column.id, title, details)
              }
              onDeleteCard={(cardId) =>
                handleDeleteCard(column.id, cardId)
              }
              onRenameColumn={(title) =>
                handleRenameColumn(column.id, title)
              }
            />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {activeCard ? (
          <div
            className={`${cardStyles.card} ${cardStyles.dragging} ${cardStyles.overlay}`}
          >
            <div className={cardStyles.cardHeader}>
              <h3 className={cardStyles.cardTitle}>{activeCard.title}</h3>
            </div>
            {activeCard.details ? (
              <p className={cardStyles.cardDetails}>{activeCard.details}</p>
            ) : null}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
