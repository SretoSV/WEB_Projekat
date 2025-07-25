import type { QuizCategory } from "../models/QuizCategoryModel";
import styles from '../styles/CategoryStyles/CategoryCheckboxesCardStyle.module.css';
import type { Question } from "../models/QuestionModel";
import { canToggleCategory } from "../services/QuizCategoryService";


interface CategoryCheckboxesCardProps{
    allCategories: Array<QuizCategory>;
    quizCategories: Array<QuizCategory>;
    quizQuestions: Array<Question>;
    onCategoryToggle: (category: QuizCategory, checked: boolean) => void;
}
export default function CategoryCheckboxesCard(props: CategoryCheckboxesCardProps){
    
    const handleCheckboxChange = (category: QuizCategory, isChecked: boolean) => {
        const canToggle = canToggleCategory(category, props.quizCategories, props.quizQuestions);

        if (!canToggle) return;

        props.onCategoryToggle(category, isChecked);
    };

    return <>

        {props.allCategories.map((category) => (
            <div key={category.id}>
                <input 
                    type="checkbox" 
                    name={category.name + category.id} 
                    checked={props.quizCategories.some(qc => qc.id === category.id && qc.name === category.name)}
                    className={styles.checkBox}
                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                />
                <label 
                    htmlFor={category.name + category.id}
                    className={styles.labelForCheckbox}
                >
                    {category.name}
                </label>
            </div>
        ))}
    </>
}