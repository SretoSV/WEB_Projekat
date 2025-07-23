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
    const [fillInAnswer, setFillInAnswer] = useState<string>("");
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
            const updatedOptions = [...prevOptions];
            updatedOptions[index] = {
                ...updatedOptions[index],
                [field]: value,
                ["id"]: index + 1,
            };
            return updatedOptions;
        });
    };

    const handleChangeQuestionType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOptionsForm([] as AnswerOption[]);
        handleInputChange(e, setForm, "number");
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
              onChange={(e) => handleChangeQuestionType(e)}
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
                    {
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index + 1} className={styles.optionRow}>
                                <label htmlFor={`Option${index + 1}`}></label>
                                <input
                                    id={`Option${index + 1}`}
                                    type="text"
                                    value={optionsForm?.[index]?.text || ""}
                                    className={styles.singleOption}
                                    onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                                    required
                                />
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={optionsForm?.[index]?.isCorrect || false}
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
                            
                        ))
                    }
                    
                    <ButtonWithLongText onClick1={handleAddOptionsToQuestion} type="button" text="Edit options" />
                </div>
            }
            {
                Number(form.questionTypeId) === 2 && 
                <div className={styles.optionsDiv}>
                    <div>multiple-correct-answers</div>
                    <button
                        type="button"
                        onClick={() =>
                            setOptionsForm((prev) => [
                            ...prev,
                            {
                                id: prev.length + 1,
                                text: "",
                                isCorrect: false,
                                questionId: props.selectedQuestion.id,
                            },
                            ])
                        }
                    >
                        Add Option
                    </button>
                    {optionsForm.map((option, index) => (
                    <div key={index} className={styles.optionRow}>
                        <input
                            type="text"
                            value={option.text}
                            className={styles.singleOption}
                            onChange={(e) =>
                                handleOptionChange(index, "text", e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={(e) =>
                                    handleOptionChange(index, "isCorrect", e.target.checked)
                                }
                            />
                            Correct
                        </label>
                    </div>
                    ))}

                    <ButtonWithLongText onClick1={handleAddOptionsToQuestion} type="button" text="Set options" />
                </div>
            }
            
            {
               Number(form.questionTypeId)=== 3 && 
                <div>
                    <div>true-false</div>
                    <label>
                    <input
                        type="checkbox"
                        checked={optionsForm[0]?.isCorrect || false}
                        onChange={(e) => {
                            const updatedOption: AnswerOption = {
                                id: 1,
                                text: "True/False Answer",
                                isCorrect: e.target.checked,
                                questionId: props.selectedQuestion.id,
                            };
                            setOptionsForm([updatedOption]);
                            setForm(prev => ({
                                ...prev,
                                answerOptions: [updatedOption]
                            }));
                        }}
                        />
                    Is this statement true?
                    </label>
                    <ButtonWithLongText onClick1={handleAddOptionsToQuestion} type="button" text="Set answer" />
                </div>
            }
            {
                Number(form.questionTypeId) === 4 && 
                <div className={styles.optionsDiv}>
                    <div>fill-in-the-blank</div>
                    <input
                        type="text"
                        placeholder="Enter correct answer"
                        value={optionsForm?.[0]?.fieldAnswerText || fillInAnswer}
                        className={styles.singleOption}
                        onChange={(e) => setFillInAnswer(e.target.value)}
                        required
                    />
                    <ButtonWithLongText
                        type="button"
                        text="Set answer"
                        onClick1={() => {
                            const answer: AnswerOption = {
                                id: 1,
                                text: "Fill-answer",
                                isCorrect: true,
                                questionId: props.selectedQuestion.id,
                                fieldAnswerText: fillInAnswer
                            };
                            setOptionsForm([answer]);
                            setForm(prev => ({
                                ...prev,
                                answerOptions: [answer]
                            }));
                        }}
                    />
                </div>
            }
            <br />
            <ButtonWithImage title="Add" widthImage="30px" heightImage='25px' onClick={() => form && props.onEditQuestion(form)} type="button" image={plusImage} alt={"plusImage"}/>
        </div>
}
