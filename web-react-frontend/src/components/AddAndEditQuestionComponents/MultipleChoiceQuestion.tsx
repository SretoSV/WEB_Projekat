import type { AnswerOption } from "../../models/AnswerOptionModel";
import styles from '../../styles/QuestionsStyles/EditQuestionStyle.module.css';
import ButtonWithLongText from "../ButtonWithLongText";
interface MultipleChoiceQuestionProps{
    optionsForm: Array<AnswerOption>;
    onOptionChange: (index: number, field: keyof AnswerOption, value: string | boolean) => void;
    setOptionsForm: React.Dispatch<React.SetStateAction<AnswerOption[]>>;
    onAddOptionsToQuestion: () => void;
}
export function MultipleChoiceQuestion({optionsForm, onOptionChange, setOptionsForm, onAddOptionsToQuestion}: MultipleChoiceQuestionProps){
    return <div className={styles.optionsDiv}>
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
                                onChange={(e) => onOptionChange(index, "text", e.target.value)}
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
                
                <ButtonWithLongText onClick1={onAddOptionsToQuestion} type="button" text="Edit options" />
            </div>
}