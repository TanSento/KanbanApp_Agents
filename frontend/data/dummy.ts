import type { Board } from "@/types/board";

export const initialBoard: Board = {
  columns: [
    {
      id: "col-1",
      title: "Backlog",
      cards: [
        { id: "card-1", title: "Setup repo", details: "Initialize project and tooling." },
        { id: "card-2", title: "Design board", details: "Define column layout and card UI." },
      ],
    },
    {
      id: "col-2",
      title: "To Do",
      cards: [
        { id: "card-3", title: "Implement drag and drop", details: "Use @dnd-kit for moving cards." },
      ],
    },
    {
      id: "col-3",
      title: "In Progress",
      cards: [
        { id: "card-4", title: "Add card form", details: "Form to create new cards in a column." },
      ],
    },
    {
      id: "col-4",
      title: "Review",
      cards: [],
    },
    {
      id: "col-5",
      title: "Done",
      cards: [
        { id: "card-5", title: "MVP scope", details: "Single board, 5 columns, no persistence." },
      ],
    },
  ],
};
