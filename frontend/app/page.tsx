"use client";

import { Board } from "@/components/Board";
import { initialBoard } from "@/data/dummy";

export default function Home() {
  return (
    <main>
      <Board initialBoard={initialBoard} />
    </main>
  );
}
