import type { Question } from "../models/QuestionModel";
import type { QuizCategory } from "../models/QuizCategoryModel";

export interface FetchCategoriesResponse {
    categories: Array<QuizCategory>;
}

export async function fetchCategories(): Promise<FetchCategoriesResponse> {
    //const token = localStorage.getItem('token');

    try {
        /*const response = await fetch(`${serverPath()}/api/Category`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed.');
        }*/
        const categories: QuizCategory[] = [
            { id: 1, name: "General Knowledge"},
            { id: 2, name: "Science"},
            { id: 3, name: "History"},
            { id: 4, name: "Sports"},
            { id: 5, name: "Music"},
            { id: 6, name: "Technology"},
        ];

        return {
            categories,
        };
    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }
}

export function toggleCategorySelection(
  currentSelected: QuizCategory[],
  categoryToToggle: QuizCategory
): QuizCategory[] {
  const isSelected = currentSelected.some(c => c.id === categoryToToggle.id);

  if (isSelected) {
    return currentSelected.filter(c => c.id !== categoryToToggle.id);
  } else {
    return [...currentSelected, categoryToToggle];
  }
}

export function createNewCategory(
  allCategories: QuizCategory[],
  selectedCategories: QuizCategory[],
  newCategoryName: string
): QuizCategory | null {
  const nameExists =
    selectedCategories.some(cat => cat.name === newCategoryName) ||
    allCategories.some(cat => cat.name === newCategoryName);

  if (nameExists) return null;

  const maxId = allCategories.length > 0
    ? Math.max(...allCategories.map(cat => cat.id))
    : 0;

  return {
    id: Number(maxId + 1),
    name: newCategoryName,
  };
}

export function canToggleCategory(
  category: QuizCategory,
  quizCategories: QuizCategory[],
  quizQuestions: Question[]
): boolean {
  const hasQuestionsInCategory = quizQuestions.some(q => q.quizCategoryId === category.id);
  const isCategoryCurrentlyChecked = quizCategories.some(qc => qc.id === category.id);

  if (isCategoryCurrentlyChecked && hasQuestionsInCategory) {
    return false;
  }

  return true;
}