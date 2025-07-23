import { useEffect, useState } from "react";
import { handleInputChange } from "../functions/formChangeFunction";
import type { Question } from "../models/QuestionModel";
import styles from '../styles/QuestionsStyles/EditQuestionStyle.module.css';
import { setQuestionType } from "../services/QuestionService";
import type { QuizCategory } from "../models/QuizCategoryModel";
import type { AnswerOption } from "../models/AnswerOptionModel";
import plusImage from '../images/plus.png';
import ButtonWithImage from "./ButtonWithImage";
import ButtonWithLongText from "./ButtonWithLongText";

interface EditQuestionProps{
    selectedQuestion: Question;
    onEditQuestion: (question: Question) => void;
    selectedCategories: Array<QuizCategory>;
    onSelectQuestion: (question: Question) => void; 
}
export function EditQuestion(props: EditQuestionProps){
    const [form, setForm] = useState<Question>({
        id: 0,
        text: "",
        questionTypeId: 0,
        quizCategoryId: 0,
        quizId: 0,
        answerOptions: [] as AnswerOption[],
    });
    const [optionsForm, setOptionsForm] = useState<AnswerOption[]>([] as AnswerOption[]);
    useEffect(()=>{
        console.log("F:  " + form.questionTypeId + " " + form.quizCategoryId + form?.answerOptions?.[0]?.text + form?.answerOptions?.[0]?.isCorrect);
    },[form]);

    useEffect(() => {
        setForm({
            id: props.selectedQuestion.id || 0,
            text: props.selectedQuestion.text || "",
            questionTypeId: props.selectedQuestion.questionTypeId || 0,
            quizCategoryId: props.selectedQuestion.quizCategoryId || 0,
            quizId: props.selectedQuestion.quizId || 0,
            answerOptions: props.selectedQuestion.answerOptions || [] as AnswerOption[],
        });

        setOptionsForm(props.selectedQuestion.answerOptions || [] as AnswerOption[]);
    }, [props.selectedQuestion]);

    const handleAddOptionsToQuestion = () => {
        setForm(prev => ({ ...prev, answerOptions: optionsForm }));
    }

    const handleOptionChange = (index: number, field: keyof AnswerOption, value: string | boolean) => {
        setOptionsForm(prevOptions => {
            const updatedOptions = [...prevOptions!];
            updatedOptions[index] = {
                ...updatedOptions[index],
                [field]: value
            };
            return updatedOptions;
        });
    };

    return  <div className={styles.formModal}>
            <div className={styles.title}>Edit Question: {props.selectedQuestion.id || ""}</div>
            <label htmlFor="QuestionTypeId">Question type:</label>
            <br />
            <select
              id="QuestionTypeId"
              name="questionTypeId"
              className={styles.dropdownInput}
              value={form.questionTypeId}
              onChange={(e) => handleInputChange(e, setForm, "number")}
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
                value={form.quizCategoryId}
                onChange={(e) => handleInputChange(e, setForm, "number")}
                required
            >
                {props.selectedCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            {
                Number(form.questionTypeId) === 1 && 
                <div className={styles.optionsDiv}>
                    <div>multiple-choice</div>
                    {optionsForm.map((option, index) => (
                        <div key={option.id} className={styles.optionRow}>
                            <label htmlFor={`Option${index + 1}`}></label>
                            <input
                                id={`Option${index + 1}`}
                                type="text"
                                value={option.text}
                                className={styles.singleOption}
                                onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                                required
                            />
                            <input
                                type="radio"
                                name="correctOption"
                                checked={option.isCorrect}
                                onChange={() => {
                                    setOptionsForm(prevOptions =>
                                        prevOptions.map((opt, i) => ({
                                            ...opt,
                                            isCorrect: i === index
                                        }))
                                    );
                                }}
                            />
                        </div>
                    ))}
                    <ButtonWithLongText onClick1={handleAddOptionsToQuestion} type="button" text="Edit options" />
                </div>
            }
            {
                Number(form.questionTypeId) === 2 && <div>multiple-correct-answers</div>
            }
            {
               Number(form.questionTypeId)=== 3 && <div>true-false</div>
            }
            {
                Number(form.questionTypeId) === 4 && <div>fill-in-the-blank</div>
            }
            <br />
            <ButtonWithImage title="Add" widthImage="30px" heightImage='25px' onClick={() => form && props.onEditQuestion(form)} type="button" image={plusImage} alt={"plusImage"}/>
        </div>
}
