import type { AnswerOption } from "../../models/AnswerOptionModel";
import type { Question } from "../../models/QuestionModel";
import ButtonWithLongText from "../ButtonWithLongText";
interface TrueFalseQuestionProps{
    optionsForm: Array<AnswerOption>;
    setOptionsForm: React.Dispatch<React.SetStateAction<AnswerOption[]>>;
    onAddOptionsToQuestion: () => void;
    form: Question;
    setForm: React.Dispatch<React.SetStateAction<Question>>;
}
export function TrueFalseQuestion({form, optionsForm, setForm, setOptionsForm, onAddOptionsToQuestion}: TrueFalseQuestionProps){
    return <div>
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
                <ButtonWithLongText onClick1={onAddOptionsToQuestion} type="button" text="Set answer" />
            </div>
}