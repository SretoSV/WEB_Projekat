import { useState } from 'react';
import styles from '../../styles/OnlineQuizCompetitionStyles/AddGameRoomModalStyle.module.css';
import ButtonWithText from '../ButtonWithText';
import { useQuizContext } from '../../context/QuizContext';
import type { GameRoom } from '../../models/GameRoomModel';

interface AddGameRoomModalProps{
    onAddGameRoom: (room: GameRoom) => void;
}

export function AddGameRoomModal({onAddGameRoom}: AddGameRoomModalProps){
    const { quizzes } = useQuizContext();
    const [gameRoom, setGameRoom] = useState<GameRoom>({
        id: 0,
        quizID: 0,
        numberOfUsers: 0,
        isFinished: false,
    });

    return <>
                <div className={styles.mainDiv}>
                    <div className={styles.title}>Add GameRoom: </div>
                    <div>
                        <label htmlFor="QuizId">Select Quiz:</label>
                        <select
                            id="QuizId"
                            name="quizId"
                            className={styles.dropdownInput}
                            value={gameRoom.quizID}
                            onChange={(e) => setGameRoom(prev => ({ ...prev, quizId: Number(e.target.value) }))}
                            required
                        >
                            <option value={0}>Select quiz</option>
                            {quizzes.map((q) => (
                                <option key={q.id} value={q.id}>{q.title}</option>
                            ))}
                        </select>
                        <br />
                    </div>
                    <ButtonWithText text='Add' type='submit' onClick={() => onAddGameRoom(gameRoom)}/>
                </div>
            </>
}