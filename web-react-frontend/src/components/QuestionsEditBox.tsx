import type { Question } from "../models/QuestionModel";
import styles from '../styles/QuestionsStyles/QuestionsStyle.module.css';
import ButtonWithImage from "./ButtonWithImage";
import editImage from '../images/edit.png';
import deleteImage from '../images/reject.png';
import type { QuizCategory } from "../models/QuizCategoryModel";
import { findQuizCategoryName, setQuestionType } from "../services/QuestionService";

interface QuestionsEditBoxProps {
    questions: Array<Question>;
    selectedCategories: Array<QuizCategory>;
    onSelectQuestion: (question: Question) => void; 
    onEditNewQuestionState: () => void;
    onDeleteQuestion: (question: Question) => void; 
}
export function QuestionsEditBox(props: QuestionsEditBoxProps){

    const handleEdit = (question: Question) => {
        props.onSelectQuestion(question);
        props.onEditNewQuestionState();
    };

    const handleDelete = (question: Question) => {
        props.onDeleteQuestion(question);
    };

    return <div>
         {props.questions.map((question, index) => (
            <div key={question.id} className={styles.row}>
                <div>
                <div>{index+1}. {question.text}</div>
                <div>{"- Question type id: " + setQuestionType(question.questionTypeId)}</div>
                <div>{"- Quiz category id: " + findQuizCategoryName(question.quizCategoryId, props.selectedCategories)}</div>
                <div className={styles.answers}>
                    {question.answerOptions.map((answer, index) => (
                        <div key={answer.id}>
                            {(index + 1 + ".") + " | " + answer.text + " | " + answer.isCorrect + (answer.fieldAnswerText ? " | " + answer.fieldAnswerText : "")}
                        </div>
                    ))}
                </div>
                </div>
                <div className={styles.buttons}>
                    <ButtonWithImage onClick={() => handleEdit(question)} image={editImage} widthImage="30px" heightImage="30px" alt="edit" title="edit"/>
                    <ButtonWithImage onClick={() => handleDelete(question)} image={deleteImage} widthImage="30px" heightImage="30px" alt="delete" title="delete"/>
                </div>
            </div>
        ))}
    </div>
}