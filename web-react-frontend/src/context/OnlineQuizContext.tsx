import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from 'react';
import type { UserQuizResult } from "../models/UserQuizResultModel";
import type { GameRoom } from "../models/GameRoomModel";
import { addGameRoom, fetchGameRooms } from "../services/OnlineQuizService";
import { useUserContext } from "./UserContext";
import type { RoomParticipant } from "../models/RoomParticipantModel";

interface OnlineQuizContextType {
  gameRooms: GameRoom[];
  setGameRooms: (gameRooms: GameRoom[]) => void;
  startQuiz: (quizResult: UserQuizResult, gameRoomId: number) => void;
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
    const savedCurrentUserAnswerIndex = localStorage.getItem('currentUserAnswerIndex');
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
    if (gameRooms !== null) {
      localStorage.setItem('gameRooms', JSON.stringify(gameRooms));
    }
  }, [gameRooms]);

  useEffect(() => {
    //ucitati tu promenu u localStroage
    if (iDontKnowStates.length !== 0) {
      localStorage.setItem('iDontKnowStates', JSON.stringify(iDontKnowStates));
    }
  }, [iDontKnowStates]);

  const startQuiz = (quizResult: UserQuizResult, gameRoomId: number) => {
    setQuizResult(quizResult);
    setCurrentUserAnswerIndex(0);
    setGameRooms(prevRooms => {
      return prevRooms.map(room => {
          if (room.id !== gameRoomId) return room;

          return {
              ...room,
              isStarted: true
          };
      });
    });
    localStorage.setItem('onlineQuizResult', JSON.stringify(quizResult));
    localStorage.setItem('currentUserAnswerIndex', JSON.stringify(0));
  };

  const finishQuiz = async () => {
    //setFinishedQuizResult(returnedQuizResult);
    setQuizResult(null);
    setCurrentUserAnswerIndex(0);
    setIDontKnowStates([] as boolean[]);
    localStorage.removeItem('onlineQuizResult');
    localStorage.removeItem('currentUserAnswerIndex');
    localStorage.removeItem('iDontKnowStates');
  };

  const incrementIndex = () => {
      setCurrentUserAnswerIndex(current => {
        const newValue = current + 1;
        localStorage.setItem('currentUserAnswerIndex', JSON.stringify(newValue));
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



