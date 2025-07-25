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
import type { Quiz } from '../models/QuizModel';
import { useQuizContext } from '../context/QuizContext';
import { deleteQuiz, editQuiz } from '../services/QuizService';

export function QuizCard({ quizId }: { quizId: number }){
    
    const { user } = useUserContext();
    const { quizzes, setQuizzes } = useQuizContext();
    const [showEditQuizModal, setShowEditQuizModal] = useState(false);

    const handleEditQuiz = async (quiz: Quiz) => {
        try {
            const { editedQuiz } = await editQuiz(quiz);
            const updatedQuizzes = quizzes.map(q => 
                q.id === editedQuiz.id ? editedQuiz : q
            );
            setQuizzes(updatedQuizzes);
        } catch (err) {
            alert("Error editing quiz");
        }
    }
    
    const handleDeleteQuiz = async (quizId: number) => {
        if (window.confirm(`Are you sure you want to delete this quiz?`)){
            try {
                const { deletedQuizId } = await deleteQuiz(quizId);
                setQuizzes(quizzes.filter(q => q.id !== deletedQuizId));
            } catch (err) {
                alert("Error deleting quiz");
            }
        }
    }
    
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
                    <ButtonWithImage title="Edit" onClick={() => setShowEditQuizModal(true)} image={editImage} widthImage={"30px"} heightImage={"30px"} alt={"Edit"}/>
                    
                    {showEditQuizModal && 
                    <EditQuizModal
                        onClose={() => setShowEditQuizModal(false)}
                        quizId={quizId}
                        onEditQuiz={handleEditQuiz}
                    />
                    }
                    <ButtonWithImage title="Delete" onClick={() => handleDeleteQuiz(quizId)} image={rejectImage} widthImage={"30px"} heightImage={"30px"} alt={"Delete"}/>
                </>
                :
                <ButtonWithText text="Start" />
            }
            </div>


        </div>
        </motion.div>
    );
};

