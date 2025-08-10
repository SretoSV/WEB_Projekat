import type { Question } from "../models/QuestionModel";
import type { QuizCategory } from "../models/QuizCategoryModel";
import { serverPath } from "../serverPath";
import { authFetch } from "./RefreshTokenService";

export interface FetchCategoriesResponse {
  categories: Array<QuizCategory>;
}

export async function fetchCategories(): Promise<FetchCategoriesResponse> {
  const response = await authFetch(`${serverPath()}/api/categories`, { method: "GET" });
  if (response.status === 204) { return { categories: [] }; }
  const data = await response.json();
  if (!response.ok) { throw new Error(data.message || "Fetching categories failed."); }
  return { categories: data };
}

export interface DeleteCategoryResponse {
  deletedCategoryId: number;
}

export async function deleteCategory(categoryId: number): Promise<DeleteCategoryResponse> {
  const response = await authFetch(`${serverPath()}/api/categories/${categoryId}`, { method: "DELETE" });
  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to delete category");
  }
  return { deletedCategoryId: categoryId };
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
    isUsed: false,
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

/*
export interface FetchCategoriesResponse {
    categories: Array<QuizCategory>;
}

export async function fetchCategories(): Promise<FetchCategoriesResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/categories`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status === 204) {
            return { categories: [] };
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed.');
        }

        return {
            categories: data,
        };
    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }
}

export interface DeleteCategoryResponse {
    deletedCategoryId: number;
}

export async function deleteCategory(categoryId: number): Promise<DeleteCategoryResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to delete quiz");
        }

        return {
            deletedCategoryId: categoryId,
        };

    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while deleting the quiz.");
    }
}
*/