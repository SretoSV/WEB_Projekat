import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionsEditBox } from '../components/QuestionsEditBox';
import type { Question } from '../models/QuestionModel';
import type { QuizCategory } from '../models/QuizCategoryModel';

// MOCKS
vi.mock('../services/QuestionService', () => ({
  setQuestionType: vi.fn((id: number) => `TYPE_${id}`),
  findQuizCategoryName: vi.fn(
    (id: number, categories: QuizCategory[]) =>
      categories.find(c => c.id === id)?.name
  ),
}));

vi.mock('../services/QuizService', () => ({
  setQuizDifficultyText: vi.fn((id: number) => `DIFFICULTY_${id}`),
}));

// TEST DATA
const categories: QuizCategory[] = [
  { id: 1, name: 'Math', isUsed: false },
  { id: 2, name: 'Science', isUsed: false },
];

const questions: Question[] = [
  {
    id: 10,
    text: 'What is 2+2?',
    questionTypeId: 1,
    questionDifficultyId: 2,
    quizCategoryId: 1,
    quizId: 1,
    answerOptions: [
      { id: 1, text: '3', isCorrect: false, questionId: 10, },
      { id: 2, text: '4', isCorrect: true, questionId: 10, },
    ],
  },
  {
    id: 11,
    text: 'What is H2O?',
    questionTypeId: 2,
    questionDifficultyId: 1,
    quizCategoryId: 2,
    quizId: 1,
    answerOptions: [
      { id: 3, text: 'Water', isCorrect: true, questionId: 11, },
      { id: 4, text: 'Stone', isCorrect: false, questionId: 11, },
    ],
  },
];

// HELPERS
const onSelectQuestion = vi.fn();
const onEditNewQuestionState = vi.fn();
const onDeleteQuestion = vi.fn();

const renderComponent = () => {
  render(
    <QuestionsEditBox
      questions={questions}
      selectedCategories={categories}
      onSelectQuestion={onSelectQuestion}
      onEditNewQuestionState={onEditNewQuestionState}
      onDeleteQuestion={onDeleteQuestion}
    />
  );
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('QuestionsEditBox', () => {

  it('renders all questions text with index', () => {
    renderComponent();

    expect(screen.getByText('1. What is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('2. What is H2O?')).toBeInTheDocument();
  });

  it('renders question metadata using service helpers', () => {
    renderComponent();

    expect(screen.getByText('- Question type: TYPE_1')).toBeInTheDocument();
    expect(screen.getByText('- Question difficulty: DIFFICULTY_2')).toBeInTheDocument();
    expect(screen.getByText('- Quiz category: Math')).toBeInTheDocument();
  });

  it('renders answer options for each question', () => {
    renderComponent();

    expect(screen.getByText('1. | 3 | false')).toBeInTheDocument();
    expect(screen.getByText('2. | 4 | true')).toBeInTheDocument();

    expect(screen.getByText('1. | Water | true')).toBeInTheDocument();
    expect(screen.getByText('2. | Stone | false')).toBeInTheDocument();
  });

  it('calls onSelectQuestion and onEditNewQuestionState when edit button is clicked', () => {
    renderComponent();

    //const editButtons = screen.getAllByRole('img', { name: /edit/i });
    const editButtons = screen.getAllByAltText('edit');

    fireEvent.click(editButtons[0]);

    expect(onSelectQuestion).toHaveBeenCalledWith(questions[0]);
    expect(onEditNewQuestionState).toHaveBeenCalled();
  });

  it('calls onDeleteQuestion when delete button is clicked', () => {
    renderComponent();

    //const deleteButtons = screen.getAllByRole('img', { name: /delete/i });
    const deleteButtons = screen.getAllByAltText('delete'); // brze

    fireEvent.click(deleteButtons[1]);

    expect(onDeleteQuestion).toHaveBeenCalledWith(questions[1]);
  });
});
