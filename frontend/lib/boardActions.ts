import type { Board, Card } from "@/types/board";

function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function moveCard(
  board: Board,
  cardId: string,
  fromColumnId: string,
  toColumnId: string,
  toIndex?: number
): Board {
  const fromCol = board.columns.find((c) => c.id === fromColumnId);
  const toCol = board.columns.find((c) => c.id === toColumnId);
  if (!fromCol || !toCol) return board;
  const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return board;
  const card = fromCol.cards[cardIndex];

  if (fromColumnId === toColumnId) {
    const newCards = fromCol.cards.filter((c) => c.id !== cardId);
    const insertAt = toIndex ?? newCards.length;
    const clamped = Math.max(0, Math.min(insertAt, newCards.length));
    if (clamped === cardIndex) return board;
    newCards.splice(clamped, 0, card);
    return {
      columns: board.columns.map((col) =>
        col.id === fromColumnId ? { ...col, cards: newCards } : col
      ),
    };
  }

  const insertAt =
    toIndex !== undefined
      ? Math.max(0, Math.min(toIndex, toCol.cards.length))
      : toCol.cards.length;
  const toCards = [...toCol.cards];
  toCards.splice(insertAt, 0, card);

  return {
    columns: board.columns.map((col) => {
      if (col.id === fromColumnId) {
        return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
      }
      if (col.id === toColumnId) {
        return { ...col, cards: toCards };
      }
      return col;
    }),
  };
}

export function addCard(
  board: Board,
  columnId: string,
  title: string,
  details: string
): Board {
  const column = board.columns.find((c) => c.id === columnId);
  if (!column) return board;
  const newCard: Card = {
    id: generateId(),
    title,
    details,
  };
  return {
    columns: board.columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    ),
  };
}

export function deleteCard(
  board: Board,
  columnId: string,
  cardId: string
): Board {
  return {
    columns: board.columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        : col
    ),
  };
}

export function renameColumn(
  board: Board,
  columnId: string,
  title: string
): Board {
  return {
    columns: board.columns.map((col) =>
      col.id === columnId ? { ...col, title } : col
    ),
  };
}
