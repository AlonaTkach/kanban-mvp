"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { boardReducer } from "./boardReducer";
import { dummyBoard } from "./dummyData";
import type { BoardAction, BoardState } from "./types";

type BoardContextValue = {
  state: BoardState;
  dispatch: Dispatch<BoardAction>;
};

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({
  children,
  initialState = dummyBoard,
}: {
  children: ReactNode;
  initialState?: BoardState;
}) {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used within BoardProvider");
  return ctx;
}
