import { render, screen, fireEvent } from '@testing-library/react';
import CategoryCheckboxesCard from '../components/CategoryCheckboxesCard';
import { canToggleCategory } from '../services/QuizCategoryService';
import type { QuizCategory } from '../models/QuizCategoryModel';
import type { Question } from '../models/QuestionModel';
import { vi } from 'vitest';

// MOCKS
vi.mock('../services/QuizCategoryService', () => ({
  canToggleCategory: vi.fn(),
}));

const mockAllCategories: QuizCategory[] = [
  { id: 1, name: 'Category 1', isUsed: true },
  { id: 2, name: 'Category 2', isUsed: false },
];

const mockQuizCategories: QuizCategory[] = [
  { id: 1, name: 'Category 1', isUsed: true },
];

const mockQuizQuestions: Question[] = [
  { id: 1, text: 'Q1', questionTypeId: 1, quizCategoryId: 1, questionDifficultyId: 1, quizId: 1, answerOptions: [] },
];

const mockOnCategoryToggle = vi.fn();
const mockOnDeleteCategory = vi.fn();

// HELPERS
const renderComponent = () => {
    render(      
        <CategoryCheckboxesCard
        allCategories={mockAllCategories}
        quizCategories={mockQuizCategories}
        quizQuestions={mockQuizQuestions}
        onCategoryToggle={mockOnCategoryToggle}
        onDeleteCategory={mockOnDeleteCategory}
      />
    );
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('CategoryCheckboxesCard', () => {

  it('renders all categories with checkboxes and labels', () => {
    (canToggleCategory as any).mockReturnValue(true);

    renderComponent();

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(checkboxes).toHaveLength(2);

    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();

    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);

    //Button x postoji samo za category 2 (isUsed: false)
    expect(screen.getByText('x')).toBeInTheDocument();
  });

  it('calls onCategoryToggle when checkbox is changed and canToggleCategory returns true', () => {
    (canToggleCategory as any).mockReturnValue(true);

    renderComponent();

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    fireEvent.click(checkboxes[1]);

    expect(canToggleCategory).toHaveBeenCalledWith(mockAllCategories[1], mockQuizCategories, mockQuizQuestions);
    expect(mockOnCategoryToggle).toHaveBeenCalledWith(mockAllCategories[1], true);
  });

  it('does not call onCategoryToggle if canToggleCategory returns false', () => {
    (canToggleCategory as any).mockReturnValue(false);

    renderComponent();

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    fireEvent.click(checkboxes[1]);

    expect(canToggleCategory).toHaveBeenCalled();
    expect(mockOnCategoryToggle).not.toHaveBeenCalled();
  });

  it('calls onDeleteCategory when "x" button is clicked', () => {
    (canToggleCategory as any).mockReturnValue(true);

    renderComponent();

    const deleteButton = screen.getByText('x');
    fireEvent.click(deleteButton);

    expect(mockOnDeleteCategory).toHaveBeenCalledWith(2);
  });
});
