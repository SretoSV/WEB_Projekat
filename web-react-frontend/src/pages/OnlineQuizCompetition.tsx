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
import type { LiveRangList } from "../models/LiveRangListModel";

export function OnlineQuizCompetition(){
    const { user } = useUserContext();
    const { startQuiz, gameRooms, handleAddParticipantToGameRoom, handleRemoveParticipantToGameRoom, loading, setGameRooms, setLiveRangList, setFinishedQuizResult } = useOnlineQuizContext();
    const [addGameRoomState, setAddGameRoomState] = useState<boolean>(false);
    const [isJoined, setIsJoined] = useState<boolean>(false);
    
    useEffect(() => {
        socket.start().then(() => {
            console.log("Connected to WebSocket");

            socket.on("start_message", (gameRoomId: number, userQuizResult: UserQuizResult, quiz: Quiz, liveRangList: LiveRangList) => {
                console.log("Working received data:", gameRoomId);
                console.log("AA" + userQuizResult);
                if(userQuizResult !== null){                    
                    startQuiz(userQuizResult, gameRoomId, quiz);
                    setLiveRangList(liveRangList);
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

            socket.on("delete_message", (gameRoomId: number) => {
                setGameRooms((prevGameRooms) =>
                    prevGameRooms.filter((room) => room.id !== gameRoomId)
                );
            });

            socket.on("submit_answer_message", (newLiveRangList: LiveRangList) => {
                setLiveRangList(newLiveRangList);
            });

            socket.on("finish_room_quiz", (gameRoomId: number, userQuizResult: UserQuizResult, usernames: Array<string>) => {
                console.log(usernames);
                if(usernames === null){                    
                    setFinishedQuizResult(userQuizResult);
                }
                else{
                    const storedUser = localStorage.getItem("user");
                    if(storedUser && !usernames.includes(JSON.parse(storedUser).username)){
                        setGameRooms(prevRooms => {
                            return prevRooms.map(room => {
                                if (room.id !== gameRoomId) return room;
    
                                return {
                                    ...room,
                                    roomParticipants: [],
                                    isStarted: false
                                };
                            });
                        });
                    }
                        
                }
            });
        });

        return () => {
            socket.off("start_message");
            socket.off("join_message");
            socket.off("leave_message");
            socket.off("submit_answer_message");
            socket.off("finish_room_quiz");
            socket.off("delete_message");
            socket.off("answer_interaction");
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

    const handleDelete = async (gameRoomId: number) => {
        if (window.confirm(`Are you sure you want to delete this room?`)){
            socket.invoke("DeleteGameRoom", "delete_message", gameRoomId);
        }
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
                        onJoin={handleJoin}
                        onStart={handleStart}
                        onLeave={handleLeave}
                        isJoined={isJoined}
                        joinedThatRoom={joinedThatRoom}
                        roomParticipants={gameRoom.roomParticipants || []}
                        onDelete={handleDelete}
                    />
                }
                )
            }
        </div>

    </>
}