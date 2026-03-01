"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/types/board";
import styles from "./Card.module.css";

interface CardProps {
  card: CardType;
  onDelete: () => void;
}

export function Card({ card, onDelete }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { card, type: "card" },
  });

  const style =
    transform && transition
      ? {
          transform: CSS.Transform.toString(transform),
          transition,
        }
      : undefined;

  return (
    <div
      ref={setNodeRef}
      data-testid={`card-${card.id}`}
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        <button
          type="button"
          data-testid={`card-${card.id}-delete`}
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete card"
        >
          Delete
        </button>
      </div>
      {card.details ? (
        <p className={styles.cardDetails}>{card.details}</p>
      ) : null}
    </div>
  );
}
