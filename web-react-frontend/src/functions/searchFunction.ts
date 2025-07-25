import type { Quiz } from "../models/QuizModel";
import { setQuizDifficultyText } from "../services/QuizService";

export function filterForQuizzesSearch(quizzes: Quiz[], searchTerm: string) {

    return quizzes.filter(item => {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.allQuizCategories.some(category => {
            return category.name.toLowerCase().includes(searchTerm.toLowerCase());
        }) ||
        setQuizDifficultyText(item.quizDifficultyId).toLowerCase().includes(searchTerm.toLowerCase());
    }
    );

}

export function filterForQuizzesDropDown(quizzes: Quiz[], selectedTerm: string, select: string) {

    if(select === "category"){
        return quizzes.filter(quiz => selectedTerm === '' || 
            quiz.allQuizCategories.some(cat => cat.name === selectedTerm));
    }
    else if (select === "difficulty") {
        return quizzes.filter(quiz => selectedTerm === '' || 
            setQuizDifficultyText(quiz.quizDifficultyId) === selectedTerm);
    }
    else{
        return quizzes;
    }
}