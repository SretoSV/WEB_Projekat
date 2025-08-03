import type { AnswerOption } from "../../models/AnswerOptionModel";
import type { Question } from "../../models/QuestionModel";
import styles from '../../styles/QuestionsStyles/EditQuestionStyle.module.css';
import ButtonWithLongText from "../ButtonWithLongText";

interface MultipleCorrectAnswersQuestionProps{
    optionsForm: Array<AnswerOption>;
    onOptionChange: (index: number, field: keyof AnswerOption, value: string | boolean) => void;
    setOptionsForm: React.Dispatch<React.SetStateAction<AnswerOption[]>>;
    onAddOptionsToQuestion: () => void;
    form: Question;
}
export function MultipleCorrectAnswersQuestion({form, optionsForm, onOptionChange, setOptionsForm, onAddOptionsToQuestion}: MultipleCorrectAnswersQuestionProps){
    return <div className={styles.optionsDiv}>
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
                            onOptionChange(index, "text", e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        required
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                                onOptionChange(index, "isCorrect", e.target.checked)
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

                <ButtonWithLongText onClick1={onAddOptionsToQuestion} type="button" text="Set options" />
            </div>
}