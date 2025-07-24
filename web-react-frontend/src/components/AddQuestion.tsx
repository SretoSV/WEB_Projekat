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
    onAddQuestion: (question: Question) => void;
    selectedCategories: Array<QuizCategory>;
    questions: Array<Question>;
    quizId: number;
    onAddNewQuestionState: () => void,
}

export function AddQuestion(props: EditQuestionProps){
    const [fillInAnswer, setFillInAnswer] = useState<string>("");
    const [form, setForm] = useState<Question>({
        id: props.questions.length > 0 ? Math.max(...props.questions.map(q => q.id)) + 1 : 1,
        text: "",
        questionTypeId: 1,
        quizCategoryId: props.selectedCategories[0].id || 0,
        quizId: props.quizId,
        answerOptions: [] as AnswerOption[],
    });

    const [optionsForm, setOptionsForm] = useState<AnswerOption[]>([] as AnswerOption[]);

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
                ["questionId"]: form.id,
            };
            return updatedOptions;
        });
    };

    const handleChangeQuestionType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTypeId = Number(e.target.value);
        setOptionsForm([] as AnswerOption[]);
        handleInputChange(e, setForm, "number");

        if (selectedTypeId === 1) {
            const newOptions: AnswerOption[] = Array.from({ length: 4 }).map((_, i) => ({
                id: i + 1,
                text: "",
                isCorrect: i === 0,
                questionId: props.questions.length > 0 ? Math.max(...props.questions.map(q => q.id)) + 1 : 1,
            }));
            setOptionsForm(newOptions);
        } else {
            setOptionsForm([]);
        }

        if (selectedTypeId === 3){
            const newOptions: AnswerOption[] = Array.from({ length: 1 }).map((_, i) => ({
                id: i + 1,
                text: "True/False Answer",
                isCorrect: false,
                questionId: props.questions.length > 0 ? Math.max(...props.questions.map(q => q.id)) + 1 : 1,
            }));
            setOptionsForm(newOptions);
        }
    };

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onAddQuestion(form);
        setForm({
            id: Math.max(...props.questions.map(q => q.id)) + 1,
            text: "",
            questionTypeId: 1,
            quizCategoryId: props.selectedCategories[0].id || 0,
            quizId: props.quizId,
            answerOptions: [] as AnswerOption[],
        });
        setOptionsForm([] as AnswerOption[]);
        props.onAddNewQuestionState();
    }

    useEffect(() => {

        const newOptions: AnswerOption[] = Array.from({ length: 4 }).map((_, i) => ({
            id: i + 1,
            text: "",
            isCorrect: i === 0,
            questionId: props.questions.length > 0 ? Math.max(...props.questions.map(q => q.id)) + 1 : 1,
        }));
        setOptionsForm(newOptions);

    }, []);


    return  <form onSubmit={(e) => handleSend(e)}>
            <div className={styles.formModal}>
            <div className={styles.title}>Add Question: </div>
            <label htmlFor="Text">Question:</label>
            <textarea 
              id="Text" 
              name="text"
              className={styles.textInput} 
              placeholder="Question..." 
              value={form.text} 
              onChange={(e) => handleInputChange(e, setForm, "string")} 
              required
            />
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
                                questionId: form.id,
                            },
                            ])
                        }
                        className={styles.removeAndAddButton}
                    >
                        Add Option
                    </button>
                    <div>Option | correct? | remove</div>
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
                        </label>
                        <button
                            type="button"
                            onClick={() =>
                                setOptionsForm(prevOptions =>
                                    prevOptions.filter((_, indexFilter) => indexFilter !== index)
                                )
                            }
                            className={styles.removeAndAddButton}
                        >
                            x
                        </button>
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
                                questionId: form.id,
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
                                questionId: form.id,
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
            <div className={styles.plusButtonDiv}>
                <ButtonWithImage title="Add" widthImage="30px" heightImage='25px' type="submit" image={plusImage} alt={"plusImage"}/>
            </div>
        </div>
        </form>
}
