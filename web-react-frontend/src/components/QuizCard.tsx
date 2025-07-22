import styles from '../styles/AllQuizzesPagesStyles/QuizCardStyle.module.css';
import editImage from '../images/edit.png';
import rejectImage from '../images/reject.png';
import { useState } from 'react';
import ButtonWithImage from './ButtonWithImage';
import { QuizInformationCard } from './QuizInformationCard';
import { useUserContext } from '../context/UserContext';
import ButtonWithText from './ButtonWithText';
import { motion } from "framer-motion";
import EditQuizModal from './EditQuizModal';

export function QuizCard({ quizId }: { quizId: number }){

    const { user } = useUserContext();
    const [showModal, setShowModal] = useState(false);
    const openModal = () => { setShowModal(true); };
    const closeModal = () => { setShowModal(false); };

    return (        
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut"}}
        >
        <div className={styles.cardDiv}>
            <QuizInformationCard quizId={quizId}/>
            <div className={styles.buttonsDiv}>
            {user && user.isAdmin ? 
                <>
                    <ButtonWithImage title="Edit" onClick={openModal} image={editImage} widthImage={"30px"} heightImage={"30px"} alt={"Edit"}/>
                    <EditQuizModal
                        show={showModal} 
                        onClose={closeModal}
                        quizId={quizId}
                    />
                    <ButtonWithImage title="Delete" image={rejectImage} widthImage={"30px"} heightImage={"30px"} alt={"Delete"}/>
                </>
                :
                <ButtonWithText onClick={closeModal} text="Start" />
            }
            </div>


        </div>
        </motion.div>
    );
};

