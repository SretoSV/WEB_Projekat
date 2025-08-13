import { useEffect, useState } from "react";
import socket from "../sockets/socket";
import { Navigation } from "../components/Navigation";
import { useUserContext } from "../context/UserContext";
import styles from "../styles/OnlineQuizCompetitionStyles/OnlineQuizCompetitionStyle.module.css";
import { GameRoomCard } from "../components/OnlineQuizCompetitionComponents/GameRoomCard";
import type { GameRoom } from "../models/GameRoomModel";
import { addGameRoom, fetchGameRooms } from "../services/OnlineQuizService";
import ButtonWithLongText from "../components/ButtonWithLongText";
import { AddGameRoomModal } from "../components/OnlineQuizCompetitionComponents/AddGameRoomModal";
import type { RoomParticipant } from "../models/RoomParticipantModel";

export function OnlineQuizCompetition(){
    const { user, handleLogout } = useUserContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [addGameRoomState, setAddGameRoomState] = useState<boolean>(false);
    const [gameRooms, setGameRooms] = useState<Array<GameRoom>>([]);

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
        socket.start().then(() => {
            console.log("Connected to WebSocket");

            socket.on("start_message", (data: any) => {
                console.log("Working received data:", data);
            });

            socket.on("join_message", (data: RoomParticipant) => {
                if(data !== null){
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
                }
            });

        });
    
        return () => {
            socket.off("start_message");
            socket.off("join_message");
        };
    }, []);

    const handleAddGameRoom = async (gameRoom: GameRoom) => {
        try {
            const { addedGameRoom } = await addGameRoom(gameRoom, handleLogout);
            setGameRooms([...gameRooms, addedGameRoom]);
        } catch (err: any) {
            throw new Error(err);
        }
    }

    const handleStart = async (gameRoomId: number) => {
        socket.invoke("StartCompetition", "start_message", gameRoomId);
    }

    const handleJoin = async (gameRoomId: number) => {
        socket.invoke("JoinGameRoom", "join_message", gameRoomId, user?.username);
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
                    <AddGameRoomModal 
                        onAddGameRoom={handleAddGameRoom}
                    />
                }
            </div>

            {
                loading ? <div>Loading...</div> : 
                gameRooms.map((gameRoom) => (
                    <GameRoomCard 
                        key={gameRoom.id}
                        id={gameRoom.id}
                        quizId={gameRoom.quizID}
                        numberOfUsers={gameRoom.numberOfUsers}
                        onJoin={handleJoin}
                        onStart={handleStart}
                        roomParticipants={gameRoom.roomParticipants || []}
                    />
                ))
            }
        </div>

    </>
}