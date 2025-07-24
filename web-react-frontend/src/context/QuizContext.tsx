import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';
import type { Quiz } from "../models/QuizModel";

interface QuizContextType {
  quizzes: Quiz[];
  setQuizzes: (quizzes: Quiz[]) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  return (
    <QuizContext.Provider value={{ quizzes, setQuizzes }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};