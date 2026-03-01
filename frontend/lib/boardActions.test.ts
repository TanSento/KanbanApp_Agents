import { describe, it, expect } from "vitest";
import {
  moveCard,
  addCard,
  deleteCard,
  renameColumn,
} from "./boardActions";
import { initialBoard } from "@/data/dummy";

describe("moveCard", () => {
  it("moves a card from one column to another", () => {
    const board = initialBoard;
    const col1 = board.columns[0];
    const col2 = board.columns[1];
    const cardId = col1.cards[0].id;
    const result = moveCard(board, cardId, col1.id, col2.id);
    expect(result.columns[0].cards).toHaveLength(col1.cards.length - 1);
    expect(result.columns[1].cards).toHaveLength(col2.cards.length + 1);
    expect(result.columns[1].cards.some((c) => c.id === cardId)).toBe(true);
  });

  it("returns same board when from and to column are the same and index unchanged", () => {
    const board = initialBoard;
    const col = board.columns[0];
    const result = moveCard(board, col.cards[0].id, col.id, col.id, 0);
    expect(result).toBe(board);
  });

  it("reorders within same column when toIndex is provided", () => {
    const board = initialBoard;
    const col = board.columns[0];
    const cardId = col.cards[0].id;
    const result = moveCard(board, cardId, col.id, col.id, 1);
    expect(result.columns[0].cards).toHaveLength(col.cards.length);
    expect(result.columns[0].cards[1].id).toBe(cardId);
  });
});

describe("addCard", () => {
  it("adds a card to a column", () => {
    const board = initialBoard;
    const col = board.columns[0];
    const result = addCard(board, col.id, "New task", "Some details");
    const newCol = result.columns.find((c) => c.id === col.id)!;
    expect(newCol.cards).toHaveLength(col.cards.length + 1);
    const added = newCol.cards.find((c) => c.title === "New task");
    expect(added).toBeDefined();
    expect(added!.details).toBe("Some details");
  });
});

describe("deleteCard", () => {
  it("removes a card from a column", () => {
    const board = initialBoard;
    const col = board.columns[0];
    const cardId = col.cards[0].id;
    const result = deleteCard(board, col.id, cardId);
    const newCol = result.columns.find((c) => c.id === col.id)!;
    expect(newCol.cards).toHaveLength(col.cards.length - 1);
    expect(newCol.cards.some((c) => c.id === cardId)).toBe(false);
  });
});

describe("renameColumn", () => {
  it("updates column title", () => {
    const board = initialBoard;
    const col = board.columns[0];
    const result = renameColumn(board, col.id, "New Title");
    const newCol = result.columns.find((c) => c.id === col.id)!;
    expect(newCol.title).toBe("New Title");
  });
});
