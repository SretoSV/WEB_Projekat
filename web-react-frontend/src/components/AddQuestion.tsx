import { useEffect, useState } from "react";
import { handleInputChange } from "../functions/formChangeFunction";
import type { Question } from "../models/QuestionModel";
import styles from '../styles/QuestionsStyles/EditQuestionStyle.module.css';
import { setQuestionType } from "../services/QuestionService";
import type { QuizCategory } from "../models/QuizCategoryModel";
import type { AnswerOption } from "../models/AnswerOptionModel";
import plusImage from '../images/plus.png';
import ButtonWithImage from "./ButtonWithImage";
import { setQuizDifficultyText } from "../services/QuizService";
import { MultipleChoiceQuestion } from "./AddAndEditQuestionComponents/MultipleChoiceQuestion";
import { MultipleCorrectAnswersQuestion } from "./AddAndEditQuestionComponents/MultipleCorrectAnswersQuestion";
import { TrueFalseQuestion } from "./AddAndEditQuestionComponents/TrueFalseQuestion";
import { FillInTheBlankQuestion } from "./AddAndEditQuestionComponents/FillInTheBlankQuestion";

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
        questionDifficultyId: 1,
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
            questionDifficultyId: 1,
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

            <label htmlFor="QuestionDifficultyId">Question difficulty:</label>
            <br />
            <select
              id="QuestionDifficultyId"
              name="questionDifficultyId"
              className={styles.dropdownInput}
              value={form.questionDifficultyId}
              onChange={(e) => handleInputChange(e, setForm, "number")}
              required
            >
              <option value={1} >{setQuizDifficultyText(1)}</option>
              <option value={2} >{setQuizDifficultyText(2)}</option>
              <option value={3} >{setQuizDifficultyText(3)}</option>
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
                <MultipleChoiceQuestion 
                    optionsForm={optionsForm} 
                    onOptionChange={handleOptionChange}
                    setOptionsForm={setOptionsForm}
                    onAddOptionsToQuestion={handleAddOptionsToQuestion}
                />
            }
            {
                Number(form.questionTypeId) === 2 && 
                <MultipleCorrectAnswersQuestion 
                    optionsForm={optionsForm} 
                    onOptionChange={handleOptionChange}
                    setOptionsForm={setOptionsForm}
                    onAddOptionsToQuestion={handleAddOptionsToQuestion} 
                    form={form}
                />
            }
            
            {
               Number(form.questionTypeId)=== 3 && 
                <TrueFalseQuestion 
                    optionsForm={optionsForm} 
                    setOptionsForm={setOptionsForm}
                    onAddOptionsToQuestion={handleAddOptionsToQuestion} 
                    form={form}
                    setForm={setForm}
                />
            }
            {
                Number(form.questionTypeId) === 4 && 
                <FillInTheBlankQuestion
                    optionsForm={optionsForm} 
                    setOptionsForm={setOptionsForm}
                    form={form}
                    setForm={setForm}
                    fillInAnswer={fillInAnswer}
                    setFillInAnswer={setFillInAnswer}
                />
            }
            <br />
            <div className={styles.plusButtonDiv}>
                <ButtonWithImage title="Add" widthImage="30px" heightImage='25px' type="submit" image={plusImage} alt={"plusImage"}/>
            </div>
        </div>
        </form>
}
