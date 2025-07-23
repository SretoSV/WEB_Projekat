import { useEffect, useState } from "react";
import { handleInputChange } from "../functions/formChangeFunction";
import type { Question } from "../models/QuestionModel";
import styles from '../styles/QuestionsStyles/EditQuestionStyle.module.css';
import { setQuestionType } from "../services/QuestionService";
import type { QuizCategory } from "../models/QuizCategoryModel";
import type { AnswerOption } from "../models/AnswerOptionModel";

interface EditQuestionProps{
    selectedQuestion?: Question;
    onEditQuestions: (question: Question) => void;
    selectedCategories: Array<QuizCategory>;
    onSelectQuestion: (question: Question) => void; 
}
export function EditQuestion(props: EditQuestionProps){
    const [form, setForm] = useState<Question>();
    useEffect(()=>{
        console.log("F:  " + form?.questionTypeId + " " + form?.quizCategoryId);
    },[form]);

    useEffect(() => {
        setForm({
            id: props.selectedQuestion?.id || 0,
            text: props.selectedQuestion?.text || "",
            questionTypeId: props.selectedQuestion?.questionTypeId || 0,
            quizCategoryId: props.selectedQuestion?.quizCategoryId || 0,
            quizId: props.selectedQuestion?.quizId || 0,
            answerOptions: props.selectedQuestion?.answerOptions || [] as AnswerOption[],
        });
    }, [props.selectedQuestion]);

    return  <div className={styles.formModal}>
            <div className={styles.title}>Edit Question: {props.selectedQuestion?.id || ""}</div>
            <label htmlFor="QuestionTypeId">Question type:</label>
            <br />
            <select
              id="QuestionTypeId"
              name="questionTypeId"
              className={styles.dropdownInput}
              value={form?.questionTypeId}
              onChange={(e) => handleInputChange(e, setForm)}
              required
            >
              <option value={1} >{setQuestionType(1)}</option>
              <option value={2} >{setQuestionType(2)}</option>
              <option value={3} >{setQuestionType(3)}</option>
              <option value={4} >{setQuestionType(4)}</option>
            </select>
            <br />

            <label htmlFor="QuizCategoryId">Question category:</label>
            <br />
            <select
                id="QuizCategoryId"
                name="quizCategoryId"
                className={styles.dropdownInput}
                value={form?.quizCategoryId}
                onChange={(e) => handleInputChange(e, setForm)}
                required
            >
                {props.selectedCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            {
                Number(form?.questionTypeId) === 1 && <div>multiple-choice</div>
            }
            {
                Number(form?.questionTypeId) === 2 && <div>multiple-correct-answers</div>
            }
            {
               Number(form?.questionTypeId)=== 3 && <div>true-false</div>
            }
            {
                Number(form?.questionTypeId) === 4 && <div>fill-in-the-blank</div>
            }
        </div>
}
