"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import type { Column as ColumnType } from "@/types/board";
import { Card } from "./Card";
import styles from "./Column.module.css";

interface ColumnProps {
  column: ColumnType;
  onAddCard: (title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameColumn: (title: string) => void;
}

export function Column({
  column,
  onAddCard,
  onDeleteCard,
  onRenameColumn,
}: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  const handleSaveTitle = () => {
    const t = editTitle.trim();
    if (t) onRenameColumn(t);
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    const title = newTitle.trim();
    if (title) {
      onAddCard(title, newDetails.trim());
      setNewTitle("");
      setNewDetails("");
      setShowAddForm(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      data-testid={`column-${column.id}`}
      className={`${styles.column} ${isOver ? styles.dropTarget : ""}`}
    >
      <div className={styles.columnHeader}>
        {isEditingTitle ? (
          <input
            data-testid={`column-${column.id}-title-input`}
            className={styles.titleInput}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
            autoFocus
          />
        ) : (
          <h2
            data-testid={`column-${column.id}-title`}
            className={styles.columnTitle}
            onClick={() => setIsEditingTitle(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(true)}
          >
            {column.title}
          </h2>
        )}
      </div>
      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.cards}>
          {column.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </div>
      </SortableContext>
      {showAddForm ? (
        <div className={styles.addForm} data-testid={`column-${column.id}-add-form`}>
          <input
            data-testid={`column-${column.id}-new-title`}
            className={styles.formInput}
            placeholder="Card title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className={styles.formTextarea}
            placeholder="Details"
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
            rows={2}
          />
          <div className={styles.formActions}>
            <button
              type="button"
              data-testid={`column-${column.id}-submit-card`}
              className={styles.submitBtn}
              onClick={handleAddCard}
            >
              Add
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                setShowAddForm(false);
                setNewTitle("");
                setNewDetails("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          data-testid={`column-${column.id}-add`}
          className={styles.addCardBtn}
          onClick={() => setShowAddForm(true)}
        >
          Add card
        </button>
      )}
    </div>
  );
}
