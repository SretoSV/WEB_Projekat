import styles from '../styles/AllQuizzesPagesStyles/QuizCardStyle.module.css';
import editImage from '../images/edit.png';
import rejectImage from '../images/reject.png';
import { useState } from 'react';
import ButtonWithImage from './ButtonWithImage';
import { QuizInformationCard } from './QuizInformationCard';
import { useUserContext } from '../context/UserContext';
import { motion } from "framer-motion";
import EditQuizModal from './EditQuizModal';
import type { Quiz } from '../models/QuizModel';
import { useQuizContext } from '../context/QuizContext';
import { deleteQuiz, editQuiz } from '../services/QuizService';
import { Link } from 'react-router-dom';

export function QuizCard({ quizId }: { quizId: number }){
    
    const { user, handleLogout } = useUserContext();
    const { quizzes, setQuizzes } = useQuizContext();
    const [showEditQuizModal, setShowEditQuizModal] = useState(false);

    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return <div>Quiz not found</div>;
    
    const handleEditQuiz = async (quiz: Quiz) => {
        if(quiz.allQuizCategories.length !== 0){
            try {
                const { editedQuiz } = await editQuiz(quiz, handleLogout);
                const updatedQuizzes = quizzes.map(q => 
                    q.id === editedQuiz.id ? editedQuiz : q
                );
                setQuizzes(updatedQuizzes);
                setShowEditQuizModal(false);
            } catch (err: any) {
                throw new Error(err);
            }
        }    
        else{
            alert("A quiz needs to have at least one category.");
        }
    }
    
    const handleDeleteQuiz = async (quizId: number) => {
        if (window.confirm(`Are you sure you want to delete this quiz?`)){
            try {
                const { deletedQuizId } = await deleteQuiz(quizId, handleLogout);
                setQuizzes(quizzes.filter(q => q.id !== deletedQuizId));
            } catch (err: any) {
                throw new Error(err);
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
                    { (quiz && quiz.results.length === 0) &&
                        <ButtonWithImage title="Edit" onClick={() => setShowEditQuizModal(true)} image={editImage} widthImage={"30px"} heightImage={"30px"} alt={"Edit"}/>
                    }
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
                <Link className={styles.link} to={`/StartQuizPage/${encodeURIComponent(quizId)}`}>Start quiz</Link>
            }
            </div>


        </div>
        </motion.div>
    );
};

