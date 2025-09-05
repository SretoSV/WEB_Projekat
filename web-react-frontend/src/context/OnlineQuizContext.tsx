import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from 'react';
import type { UserQuizResult } from "../models/UserQuizResultModel";
import type { GameRoom } from "../models/GameRoomModel";
import { addGameRoom, fetchGameRooms } from "../services/OnlineQuizService";
import { useUserContext } from "./UserContext";
import type { RoomParticipant } from "../models/RoomParticipantModel";
import type { Quiz } from "../models/QuizModel";

interface OnlineQuizContextType {
  gameRooms: GameRoom[];
  setGameRooms: React.Dispatch<React.SetStateAction<GameRoom[]>>;
  startQuiz: (quizResult: UserQuizResult, gameRoomId: number, quiz: Quiz) => void;
  finishQuiz: () => void;
  quizResult: UserQuizResult | null;
  currentUserAnswerIndex: number;
  incrementIndex: () => void;
  loading: boolean;
  handleAddParticipantToGameRoom: (data: RoomParticipant) => void;
  handleRemoveParticipantToGameRoom: (participantId: number) => void;
  handleAddGameRoom: (gameRoom: GameRoom) => void;
  iDontKnowStates: Array<boolean>;
  setIDontKnowStates: React.Dispatch<React.SetStateAction<boolean[]>>;
  finishedQuizResult: UserQuizResult | null;
  setFinishedQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>;
  setQuizResult: React.Dispatch<React.SetStateAction<UserQuizResult | null>>;
  timeLeft: number | null;
  initializeTimer: (durationSeconds: number) => void;
  restoreTimer: (durationSeconds: number) => void;
  
}

const OnlineQuizContext = createContext<OnlineQuizContextType | undefined>(undefined);

export const OnlineQuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizResult, setQuizResult] = useState<UserQuizResult | null>(null);
  const [finishedQuizResult, setFinishedQuizResult] = useState<UserQuizResult | null>(null);
  const [currentUserAnswerIndex, setCurrentUserAnswerIndex] = useState<number>(0);
  const [gameRooms, setGameRooms] = useState<Array<GameRoom>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [iDontKnowStates, setIDontKnowStates] = useState<boolean[]>([]);
  const { handleLogout } = useUserContext();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

      const fetchRooms = async () => {
          try {
              setLoading(true);
              const { fetchedGameRooms } = await fetchGameRooms(handleLogout);
              setGameRooms(fetchedGameRooms);
          } catch (err: any) {
              throw new Error(err);
          }
          finally {
              setLoading(false);
          }
      };
      fetchRooms();
      
  }, []);

  useEffect(() => {
    const savedQuizResult = localStorage.getItem('onlineQuizResult');
    if (savedQuizResult) {
      setQuizResult(JSON.parse(savedQuizResult));
    }
    const savedCurrentUserAnswerIndex = localStorage.getItem('onlineCurrentUserAnswerIndex');
    if (savedCurrentUserAnswerIndex) {
      setCurrentUserAnswerIndex(JSON.parse(savedCurrentUserAnswerIndex));
    }
    const savedIDontKnowStates = localStorage.getItem('iDontKnowStates');
    if (savedIDontKnowStates) {
        setIDontKnowStates(JSON.parse(savedIDontKnowStates));
    }
  }, []);

  useEffect(() => {
    //ucitati tu promenu u localStroage
    if (quizResult !== null) {
      localStorage.setItem('onlineQuizResult', JSON.stringify(quizResult));
    }
  }, [quizResult]);

  useEffect(() => {
    //ucitati tu promenu u localStroage
    if (iDontKnowStates.length !== 0) {
      localStorage.setItem('iDontKnowStates', JSON.stringify(iDontKnowStates));
    }
  }, [iDontKnowStates]);

  const startQuiz = (quizResult: UserQuizResult, gameRoomId: number, quiz: Quiz) => {
    localStorage.setItem('eachQuestionTime', JSON.stringify(quiz.timeLimitSeconds / quiz.questions.length));
    localStorage.setItem('numberOfQuestions', JSON.stringify(quiz.questions.length));

    setQuizResult(quizResult);
    setCurrentUserAnswerIndex(0);
    initializeTimer(quiz.timeLimitSeconds / quiz.questions.length);
    localStorage.setItem('onlineQuizResult', JSON.stringify(quizResult));
    localStorage.setItem('onlineCurrentUserAnswerIndex', JSON.stringify(0));
  };

  const finishQuiz = async () => {
    //setFinishedQuizResult(returnedQuizResult);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setQuizResult(null);
    setCurrentUserAnswerIndex(0);
    setIDontKnowStates([] as boolean[]);
    localStorage.removeItem('onlineQuizResult');
    localStorage.removeItem('onlineCurrentUserAnswerIndex');
    localStorage.removeItem('iDontKnowStates');
    localStorage.removeItem('onlineQuizStartTime');
    localStorage.removeItem('eachQuestionTime');
    localStorage.removeItem('numberOfQuestions');
  };

  const incrementIndex = () => {
      setCurrentUserAnswerIndex(current => {
        const newValue = current + 1;
        const savedQuestionsNumber = localStorage.getItem('numberOfQuestions');
        const savedCurrentUserAnswerIndex = localStorage.getItem('onlineCurrentUserAnswerIndex');
        if (savedQuestionsNumber && savedCurrentUserAnswerIndex) {
          if(JSON.parse(savedQuestionsNumber) !== JSON.parse(savedCurrentUserAnswerIndex)){
            localStorage.setItem('onlineCurrentUserAnswerIndex', JSON.stringify(newValue));
          }
        }
        return newValue;
      });
  };

  const handleAddGameRoom = async (gameRoom: GameRoom) => {
    try {
        const { addedGameRoom } = await addGameRoom(gameRoom, handleLogout);
        setGameRooms([...gameRooms, addedGameRoom]);
    } catch (err: any) {
        throw new Error(err);
    }
  }

  const handleAddParticipantToGameRoom = (data: RoomParticipant) => {
    setGameRooms(prevRooms => {
      return prevRooms.map(room => {
          if (room.id === data.gameRoomId) {
              const alreadyExists = room.roomParticipants?.some(p => p.userId === data.userId);
              if (alreadyExists) return room;

              return {
                  ...room,
                  numberOfUsers: room.numberOfUsers + 1,
                  roomParticipants: [...(room.roomParticipants || []), data]
              };
          }
          return room;
      });
    });
  };

  const handleRemoveParticipantToGameRoom = (participantId: number) => {
    setGameRooms(prevRooms => {
      return prevRooms.map(room => {
          const participantExists = room.roomParticipants?.some(p => p.id === participantId);
          if (!participantExists) return room;

          return {
              ...room,
              numberOfUsers: Math.max(0, room.numberOfUsers - 1),
              roomParticipants: room.roomParticipants?.filter(p => p.id !== participantId) || []
          };
      });
    });
  };

  const initializeTimer = (durationSeconds: number) => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }

    const startTimestamp = Date.now();
    localStorage.setItem('onlineQuizStartTime', startTimestamp.toString());

    const updateTime = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimestamp) / 1000);
        const remaining = durationSeconds - elapsed;

        if (remaining <= 0) {
            setTimeLeft(0);
            clearInterval(timerRef.current!);
            nextQuestion();
        } else {
            setTimeLeft(remaining);
        }
    };

    updateTime();
    timerRef.current = setInterval(updateTime, 1000);
};

const restoreTimer = (durationSeconds: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const startTimestamp = parseInt(localStorage.getItem("onlineQuizStartTime") || "0");
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
        nextQuestion();
        localStorage.removeItem("onlineQuizStartTime");
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
                nextQuestion();
            } else {
                setTimeLeft(newRemaining);
            }
        }, 1000);
    }
  };

  const nextQuestion = () => {
    incrementIndex();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const savedQuestionTime = localStorage.getItem('eachQuestionTime');
    if (savedQuestionTime) {
      initializeTimer(JSON.parse(savedQuestionTime));
    }

    //posalji na backend odgovor na trenutno pitanje
    
    const savedQuestionsNumber = localStorage.getItem('numberOfQuestions');
    const savedCurrentUserAnswerIndex = localStorage.getItem('onlineCurrentUserAnswerIndex');
    if (savedQuestionsNumber && savedCurrentUserAnswerIndex) {
      if(JSON.parse(savedQuestionsNumber) === JSON.parse(savedCurrentUserAnswerIndex) + 1){
        console.log("AJMOOOO");
        finishQuiz();
      }
    }
  
  }

  useEffect(() => {
      return () => {
          if (timerRef.current) clearInterval(timerRef.current);
      };
  }, []);

  return (
    <OnlineQuizContext.Provider value={{ 
      gameRooms,
      setGameRooms,
      startQuiz,
      quizResult,
      finishQuiz,
      currentUserAnswerIndex,
      incrementIndex,
      loading,
      handleAddParticipantToGameRoom,
      handleRemoveParticipantToGameRoom,
      handleAddGameRoom,
      iDontKnowStates,
      setIDontKnowStates,
      finishedQuizResult,
      setFinishedQuizResult,
      setQuizResult,
      timeLeft,
      initializeTimer,
      restoreTimer,
      }}>
      {children}
    </OnlineQuizContext.Provider>
  );
};

export const useOnlineQuizContext = () => {
  const context = useContext(OnlineQuizContext);
  if (!context) {
    throw new Error("useOnlineQuizContext must be used within a OnlineQuizProvider");
  }
  return context;
};



