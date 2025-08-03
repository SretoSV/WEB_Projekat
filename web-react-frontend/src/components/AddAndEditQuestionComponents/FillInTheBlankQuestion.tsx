import type { AnswerOption } from "../../models/AnswerOptionModel";
import type { Question } from "../../models/QuestionModel";
import ButtonWithLongText from "../ButtonWithLongText";
import styles from '../../styles/QuestionsStyles/EditQuestionStyle.module.css';

interface FillInTheBlankQuestionProps{
    optionsForm: Array<AnswerOption>;
    setOptionsForm: React.Dispatch<React.SetStateAction<AnswerOption[]>>;
    form: Question;
    setForm: React.Dispatch<React.SetStateAction<Question>>;
    fillInAnswer: string;
    setFillInAnswer: React.Dispatch<React.SetStateAction<string>>;
}
export function FillInTheBlankQuestion({form, optionsForm, setForm, setOptionsForm, setFillInAnswer, fillInAnswer}: FillInTheBlankQuestionProps){
    return <div className={styles.optionsDiv}>
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