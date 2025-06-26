"use client"
// CounterContext.tsx
import React, { createContext, useState, ReactNode } from "react";
export interface CounterContextType {
  shape: "rect"|"circle"|"line";
  setShape: React.Dispatch<React.SetStateAction<"rect"|"circle"|"line">>;
}

export const ShapeContext = createContext<CounterContextType | undefined>(undefined);

interface CounterProviderProps {
  children: ReactNode;
}

export const ShapeProvider: React.FC<CounterProviderProps> = ({ children }) => {
  const [shape, setShape] = useState<"rect"|"circle"|"line">("rect");

  return (
    <ShapeContext.Provider value={{ shape, setShape }}>
      {children}
    </ShapeContext.Provider>
  );
};
