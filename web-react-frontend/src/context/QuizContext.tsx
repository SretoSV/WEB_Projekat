import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from 'react';
import type { Quiz } from "../models/QuizModel";
import { fetchQuizzes, finishQuizFetch } from "../services/QuizService";
import { useUserContext } from "./UserContext";
import type { UserQuizResult } from "../models/UserQuizResultModel";

interface QuizContextType {
  quizzes: Quiz[];
  setQuizzes: (quizzes: Quiz[]) => void;
  startQuiz: (quizResult: UserQuizResult) => void;
  finishQuiz: () => void;
  quizResult: UserQuizResult | null;
  finishedQuizResult: UserQuizResult | null;
  setQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>;
  setFinishedQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>;
  currentUserAnswerIndex: number;
  incrementIndex: () => void;
  decrementIndex: () => void;
  handleSetIndex: (index: number) => void;
  timeLeft: number | null;
  initializeTimer: (durationSeconds: number) => void;
  restoreTimer: (durationSeconds: number) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizResult, setQuizResult] = useState<UserQuizResult | null>(null);
  const [finishedQuizResult, setFinishedQuizResult] = useState<UserQuizResult | null>(null);
  const [currentUserAnswerIndex, setCurrentUserAnswerIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  
  useEffect(() => {
    //ucitati tu promenu u localStroage
    if (quizResult !== null) {
      localStorage.setItem('quizResult', JSON.stringify(quizResult));
    }
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
      localStorage.setItem('currentUserAnswerIndex', JSON.stringify(0));
  };

  const finishQuiz = async () => {
    const savedQuizResult = localStorage.getItem('quizResult');
    if (savedQuizResult) {
      try {
        const { returnedQuizResult } = await finishQuizFetch(JSON.parse(savedQuizResult));
        setFinishedQuizResult(returnedQuizResult);
      } catch (err) {
        alert("Error finishing quiz!");
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setQuizResult(null);
    setCurrentUserAnswerIndex(0);
    setTimeLeft(null);
    localStorage.removeItem('quizResult');
    localStorage.removeItem('currentUserAnswerIndex');
    localStorage.removeItem('quizStartTime');
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

  const handleSetIndex = (index: number) => {
    setCurrentUserAnswerIndex(_ => {
      const newValue = index;
      localStorage.setItem('currentUserAnswerIndex', JSON.stringify(newValue));
      return newValue;
    });
  };

  const initializeTimer = (durationSeconds: number) => {

    const startTimestamp = Date.now();
    localStorage.setItem('quizStartTime', startTimestamp.toString());

    const updateTime = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimestamp) / 1000);
        const remaining = durationSeconds - elapsed;

        if (remaining <= 0) {
            setTimeLeft(0);
            clearInterval(timerRef.current!);
            finishQuiz();
        } else {
            setTimeLeft(remaining);
        }
    };

    updateTime();
    timerRef.current = setInterval(updateTime, 1000);
};

  const restoreTimer = (durationSeconds: number) => {
      const startTimestamp = parseInt(localStorage.getItem("quizStartTime") || "0");
      if (!startTimestamp) return;

      const now = Date.now();
      const elapsed = Math.floor((now - startTimestamp) / 1000);
      const remaining = durationSeconds - elapsed;

      if (remaining <= 0) {
          setTimeLeft(0);
          if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
          }
          finishQuiz();
          localStorage.removeItem("quizStartTime");
      } else {
          setTimeLeft(remaining);
          timerRef.current = setInterval(() => {
              const newElapsed = Math.floor((Date.now() - startTimestamp) / 1000);
              const newRemaining = durationSeconds - newElapsed;
              if (newRemaining <= 0) {
                  setTimeLeft(0);
                  if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                  }
                  finishQuiz();
              } else {
                  setTimeLeft(newRemaining);
              }
          }, 1000);
      }
  };

  useEffect(() => {
      return () => {
          if (timerRef.current) clearInterval(timerRef.current);
      };
  }, []);

  return (
    <QuizContext.Provider value={{ 
      quizzes, 
      setQuizzes, 
      quizResult, 
      finishedQuizResult,
      setQuizResult, 
      setFinishedQuizResult,
      startQuiz, 
      finishQuiz,
      currentUserAnswerIndex,
      incrementIndex,
      decrementIndex,
      handleSetIndex,
      timeLeft,
      initializeTimer,
      restoreTimer
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



