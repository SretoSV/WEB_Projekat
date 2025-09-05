import { useEffect, useState } from "react";
import socket from "../sockets/socket";
import { Navigation } from "../components/Navigation";
import { useUserContext } from "../context/UserContext";
import styles from "../styles/OnlineQuizCompetitionStyles/OnlineQuizCompetitionStyle.module.css";
import { GameRoomCard } from "../components/OnlineQuizCompetitionComponents/GameRoomCard";
import ButtonWithLongText from "../components/ButtonWithLongText";
import { AddGameRoomModal } from "../components/OnlineQuizCompetitionComponents/AddGameRoomModal";
import type { RoomParticipant } from "../models/RoomParticipantModel";
import type { UserQuizResult } from "../models/UserQuizResultModel";
import { useOnlineQuizContext } from "../context/OnlineQuizContext";
import type { Quiz } from "../models/QuizModel";

export function OnlineQuizCompetition(){
    const { user } = useUserContext();
    const { startQuiz, gameRooms, handleAddParticipantToGameRoom, handleRemoveParticipantToGameRoom, loading, setGameRooms } = useOnlineQuizContext();
    const [addGameRoomState, setAddGameRoomState] = useState<boolean>(false);
    const [isJoined, setIsJoined] = useState<boolean>(false);
    useEffect(() => {
        socket.start().then(() => {
            console.log("Connected to WebSocket");

            socket.on("start_message", (gameRoomId: number, userQuizResult: UserQuizResult, quiz: Quiz) => {
                console.log("Working received data:", gameRoomId);
                console.log("AA" + userQuizResult);
                if(userQuizResult !== null){                    
                    startQuiz(userQuizResult, gameRoomId, quiz);
                }
                setGameRooms(prevRooms => {
                    return prevRooms.map(room => {
                        if (room.id !== gameRoomId) return room;

                        return {
                            ...room,
                            isStarted: true
                        };
                    });
                });
            });

            socket.on("join_message", (data: RoomParticipant) => {
                if(data !== null){
                    handleAddParticipantToGameRoom(data);
                }
            });

            socket.on("leave_message", (participantId: number) => {
                handleRemoveParticipantToGameRoom(participantId);
            });

        });
    
        return () => {
            socket.off("start_message");
            socket.off("join_message");
            socket.off("leave_message");
        };
    }, []);

    useEffect(() => {
        const joinedRoom = gameRooms.find(room =>
            room?.roomParticipants?.some(p => p.userProfile?.username === user?.username)
        );

        if (joinedRoom) {
            setIsJoined(true);
        } else {
            setIsJoined(false);
        }
    }, [gameRooms, user]);

    const handleStart = async (gameRoomId: number) => {
        const gameRoom = gameRooms.find(room => room.id === gameRoomId);
        if (!gameRoom) {
            console.error("GameRoom not found for ID:", gameRoomId);
            return;
        }
        socket.invoke("StartCompetition", "start_message", gameRoomId, gameRoom.quizID);
    }

    const handleJoin = async (gameRoomId: number) => {
        socket.invoke("JoinGameRoom", "join_message", gameRoomId, user?.username);
    }

    const handleLeave = async (gameRoomId: number) => {
        socket.invoke("LeaveGameRoom", "leave_message", gameRoomId, user?.username);
    }


    return <>
        {user && user.isAdmin && <Navigation />}
        <div className={styles.mainDiv}>

            <div className={styles.filtersDiv}>
                GAME ROOMS
                {user && user.isAdmin && 
                    <div className={styles.buttonAdd}>
                        <ButtonWithLongText text="Add Game Room" onClick={() => setAddGameRoomState(c => !c)}/>
                    </div>
                }
            </div>
            <div className={styles.filtersDiv}>
                {addGameRoomState &&
                    <AddGameRoomModal />
                }
            </div>

            {
                loading ? <div>Loading...</div> : 
                gameRooms.map((gameRoom) => {
                    const joinedThatRoom = gameRoom?.roomParticipants?.some(p => p.userProfile?.username === user?.username);

                    return <GameRoomCard 
                        key={gameRoom.id}
                        id={gameRoom.id}
                        quizId={gameRoom.quizID}
                        numberOfUsers={gameRoom.numberOfUsers}
                        isStarted={gameRoom.isStarted}
                        isFinished={gameRoom.isFinished}
                        onJoin={handleJoin}
                        onStart={handleStart}
                        onLeave={handleLeave}
                        isJoined={isJoined}
                        joinedThatRoom={joinedThatRoom}
                        roomParticipants={gameRoom.roomParticipants || []}
                    />
                }
                )
            }
        </div>

    </>
}