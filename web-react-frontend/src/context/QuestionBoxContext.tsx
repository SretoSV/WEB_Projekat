import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';
import type { Question } from "../models/QuestionModel";

interface QuestionContextType {
  setQuestions: (quizzes: Question[]) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  return (
    <QuestionContext.Provider value={{ setQuestions }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestionContext must be used within a QuestionProvider");
  }
  return context;
};