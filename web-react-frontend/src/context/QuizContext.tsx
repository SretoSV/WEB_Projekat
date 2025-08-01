import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from 'react';
import type { Quiz } from "../models/QuizModel";
import { fetchQuizzes } from "../services/QuizService";
import { useUserContext } from "./UserContext";

interface QuizContextType {
  quizzes: Quiz[];
  setQuizzes: (quizzes: Quiz[]) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if(user){
      const fetchData = async () => {
        try {
          const { quizzes } = await fetchQuizzes();
          setQuizzes(quizzes);
        } catch (err: any) {
          alert(err.message);
        }
      };

      fetchData();
    }
  }, [user]);

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