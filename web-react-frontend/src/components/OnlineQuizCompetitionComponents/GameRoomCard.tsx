import styles from '../../styles/OnlineQuizCompetitionStyles/OnlineQuizCompetitionStyle.module.css';
import { motion } from "framer-motion";
import ButtonWithLongText from '../ButtonWithLongText';
import { useUserContext } from '../../context/UserContext';
import { useQuizContext } from '../../context/QuizContext';
import type { RoomParticipant } from '../../models/RoomParticipantModel';
import placeHolder from '../../images/placeHolder.png';
import ButtonWithText from '../ButtonWithText';
import { OnlineQuizCard } from './OnlineQuizCard';
import type { LiveRangList } from '../../models/LiveRangListModel';
import { LiveRangListCard } from './LiveRangListCard';

interface GameRoomCardProps{
    id: number;
    quizId: number;
    numberOfUsers: number;
    isStarted: boolean;
    isFinished: boolean;
    onJoin: (gameRoomId: number) => void;
    onStart: (gameRoomId: number) => void;
    onLeave: (gameRoomId: number) => void;
    roomParticipants: Array<RoomParticipant>;
    isJoined: boolean | undefined;
    joinedThatRoom: boolean | undefined;
    liveRangList: LiveRangList | null;
}

export function GameRoomCard({id, quizId, onJoin, onStart, onLeave, isFinished, isStarted, roomParticipants, isJoined, joinedThatRoom, liveRangList }: GameRoomCardProps){
    const { user } = useUserContext();
    const { quizzes } = useQuizContext();

    const quiz = quizzes.find(q => q.id === quizId);

    return (        
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut"}}
        >
        <div className={styles.cardDiv}>
            {
                (!isStarted || !joinedThatRoom) &&
                <div>
                    Id: {id}<br />
                    Quiz: {quiz?.title}<br />
                    Number Of Users: {roomParticipants.length}<br />
                    Room Participants:
                </div>
            }

            <div>
            {
                (!isStarted || !joinedThatRoom) && roomParticipants.map(roomParticipant => (
                    <div key={roomParticipant.id} className={styles.participantProfile}>
                        <img
                            src={roomParticipant.userProfile?.profileImage ? `data:image/png;base64,${roomParticipant.userProfile?.profileImage}` : placeHolder}
                            className={styles.profileImage}
                            alt="profile"
                            />
                        <div>{roomParticipant.userProfile?.username}</div>
                        {user?.username === roomParticipant.userProfile?.username &&
                            <ButtonWithText text="Leave" onClick1={() => onLeave(id)}/>
                        }
                    </div>
                ))
            }
            </div>

            {
                user && user.isAdmin ? 
                    isStarted ? 
                    <div>Active</div>
                    :
                    <ButtonWithLongText text="Start" onClick1={() => onStart(id)}/>    
                :
                    isStarted ? 
                        joinedThatRoom ?
                        <>
                            <LiveRangListCard liveRangList={liveRangList}/>
                            <OnlineQuizCard quiz={quiz || null}/>
                        </>
                        :
                        <div>Active room</div>
                    :
                        isJoined ? 
                        <div></div>
                        :
                        <ButtonWithLongText text="Join" onClick1={() => onJoin(id)}/>    
            }
        </div>
        </motion.div>
    );
};

