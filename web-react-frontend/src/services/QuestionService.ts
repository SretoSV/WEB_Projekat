import type { QuizCategory } from "../models/QuizCategoryModel";

export function setQuestionType(
  questionTypeId: number
): string {
    switch(questionTypeId){
        case 1:
            return "multiple-choice";
        case 2:
            return "multiple-correct-answers";
        case 3:
            return "true-false";
        case 4:
            return "fill-in-the-blank";
    }
    return "";
}

export function findQuizCategoryName(
  questionTypeId: number,
  allCategories: Array<QuizCategory>
): string | undefined{
    return allCategories.find(cat => cat.id === questionTypeId)?.name;
}
