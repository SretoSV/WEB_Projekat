import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from 'react';
import type { Quiz } from "../models/QuizModel";
import { fetchQuizzes } from "../services/QuizService";
import { useUserContext } from "./UserContext";
import type { UserQuizResult } from "../models/UserQuizResultModel";
import type { UserAnswerOption } from "../models/UserAnswerOptionModel";

interface QuizContextType {
  quizzes: Quiz[];
  setQuizzes: (quizzes: Quiz[]) => void;
  startQuiz: (quizResult: UserQuizResult) => void;
  finishQuiz: () => void;
  quizResult: UserQuizResult | null;
  setQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>;
  currentUserAnswerIndex: number;
  incrementIndex: () => void;
  decrementIndex: () => void;
  handleSetWholeNewUserQuizResult: (userAnswerOptions: Array<UserAnswerOption>) => void;
  setCurrentUserAnswerIndex: React.Dispatch<React.SetStateAction<number>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizResult, setQuizResult] = useState<UserQuizResult | null>(null);
  const [currentUserAnswerIndex, setCurrentUserAnswerIndex] = useState<number>(0);
  
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

  const handleSetWholeNewUserQuizResult = (userAnswerOptions: Array<UserAnswerOption>) => {
    setQuizResult(prev => {
      if (!prev || !prev.answers) return prev;

      const updatedAnswers = [...prev.answers];
      const updatedAnswer = { ...updatedAnswers[currentUserAnswerIndex], userAnswerOptions };
      updatedAnswers[currentUserAnswerIndex] = updatedAnswer;

      return {
        ...prev,
        answers: updatedAnswers
      };
    });
  };

  useEffect(() => {
    //ucitati tu promenu u localStroage
    localStorage.setItem('quizResult', JSON.stringify(quizResult));
  }, [quizResult]);

  useEffect(() => {
    const savedQuizResult = localStorage.getItem('quizResult');
    if (savedQuizResult) {
      setQuizResult(JSON.parse(savedQuizResult));
    }
    const savedCurrentUserAnswerIndex = localStorage.getItem('currentUserAnswerIndex');
    if (savedCurrentUserAnswerIndex) {
      setCurrentUserAnswerIndex(JSON.parse(savedCurrentUserAnswerIndex));
    }
  }, []);


  const startQuiz = (quizResult: UserQuizResult) => {
      setQuizResult(quizResult);
      setCurrentUserAnswerIndex(0);
      localStorage.setItem('quizResult', JSON.stringify(quizResult));
  };

  const finishQuiz = () => {
    setQuizResult(null);
    setCurrentUserAnswerIndex(0);
    localStorage.removeItem('quizResult');
  };

  const incrementIndex = () => {
      setCurrentUserAnswerIndex(current => {
        const newValue = current + 1;
        localStorage.setItem('currentUserAnswerIndex', JSON.stringify(newValue));
        return newValue;
      });
  };

  const decrementIndex = () => {
      setCurrentUserAnswerIndex(current => {
        const newValue = current - 1;
        localStorage.setItem('currentUserAnswerIndex', JSON.stringify(newValue));
        return newValue;
      });
  };

  return (
    <QuizContext.Provider value={{ 
      quizzes, 
      setQuizzes, 
      quizResult, 
      setQuizResult, 
      startQuiz, 
      finishQuiz,
      currentUserAnswerIndex,
      incrementIndex,
      decrementIndex,
      handleSetWholeNewUserQuizResult,
      setCurrentUserAnswerIndex
      }}>
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