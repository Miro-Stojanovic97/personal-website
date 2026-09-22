'use client';
import { createContext, useState, ReactNode } from 'react';

interface DndContextType {
    isFireActive: boolean | null;
    setIsFireActive: (isActive: boolean | null) => void;
    diceRollNumber: number | null;
    setDiceRollNumber: (number: number | null) => void;
}

export const DndContext = createContext<DndContextType | undefined>(undefined);

export function DndProvider({ children }: { children: ReactNode }) {
    const [isFireActive, setIsFireActive] = useState<boolean | null>(true);
    const [diceRollNumber, setDiceRollNumber] = useState<number | null>(null);

  return (
    <DndContext.Provider value={{ isFireActive, setIsFireActive, diceRollNumber, setDiceRollNumber }}>
      {children}
    </DndContext.Provider>
  );
}
