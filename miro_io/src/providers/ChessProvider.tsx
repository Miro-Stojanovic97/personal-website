'use client';
import { createContext, useState, ReactNode } from 'react';

interface ChessContextType {
  isValidMove: boolean;
  setIsValidMove: (isValid: boolean) => void;
  checkIsValidMove: (startingSquareId: string | null, finalSquareId: string | null) => boolean;
  playerWithCurrentTurn: string;
  setPlayerWithCurrentTurn: (player: string) => void;
  startingSquareId: string | null;
  setStartingSquareId: (id: string | null) => void;
  targetSquareId: string | null;
  setTargetSquareId: (id: string | null) => void;
  draggedPiece: HTMLElement | null;
  setDraggedPiece: (piece: HTMLElement | null) => void;
}

const width = 8;

export const ChessContext = createContext<ChessContextType | undefined>(undefined);

export function ChessProvider({ children }: { children: ReactNode }) {
  const [startingSquareId, setStartingSquareId] = useState<string | null>(null);
  const [targetSquareId, setTargetSquareId] = useState<string | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<HTMLElement | null>(null);
  const [isValidMove, setIsValidMove] = useState(false);
  const [playerWithCurrentTurn, setPlayerWithCurrentTurn] = useState('white');

  function checkIsValidMove(startingSquareId: string | null, finalSquareId: string | null) {
    const movingToNewSquare = !!(finalSquareId && startingSquareId && finalSquareId !== startingSquareId);
    setIsValidMove(movingToNewSquare);
    return movingToNewSquare;
  }

  return (
    <ChessContext.Provider value={{ 
      isValidMove,
      setIsValidMove,
      checkIsValidMove,
      startingSquareId,
      setStartingSquareId,
      targetSquareId,
      setTargetSquareId,
      draggedPiece,
      setDraggedPiece,
      playerWithCurrentTurn,
      setPlayerWithCurrentTurn }}>
      {children}
    </ChessContext.Provider>
  );
}
