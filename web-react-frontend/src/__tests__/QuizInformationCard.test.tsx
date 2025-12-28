import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizInformationCard } from '../components/QuizInformationCard';
import { useQuizContext } from '../context/QuizContext';
import type { Quiz } from '../models/QuizModel';
import type { Question } from '../models/QuestionModel';

// MOCKS
vi.mock('../context/QuizContext', () => ({
  useQuizContext: vi.fn(),
}));

vi.mock('../services/QuizService', () => ({
  setQuizDifficultyText: vi.fn((id: number) => `DIFFICULTY_${id}`),
}));

// TEST DATA
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

const quiz: Quiz = {
  id: 1,
  title: 'General Knowledge Quiz',
  description: 'Test your general knowledge.',
  quizDifficultyId: 2,
  timeLimitSeconds: 125,
  questions: questions,
  allQuizCategories: [
    { id: 1, name: 'General', isUsed: true },
    { id: 2, name: 'Science', isUsed: true },
  ],
  results: []
};

const quizzes: Quiz[] = [quiz];

// HELPERS
const renderComponent = (quizId = 1, quizzesData: Quiz[] = quizzes) => {
  (useQuizContext as any).mockReturnValue({
    quizzes: quizzesData,
  });

  render(<QuizInformationCard quizId={quizId} />);
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('QuizInformationCard', () => {

  it('renders quiz title and description', () => {
    renderComponent();

    expect(screen.getByText('General Knowledge Quiz')).toBeInTheDocument();

    expect(screen.getByText('Test your general knowledge.')).toBeInTheDocument();
  });

  it('renders quiz categories', () => {
    renderComponent();

    expect(screen.getByText('- General')).toBeInTheDocument();
    expect(screen.getByText('- Science')).toBeInTheDocument();
  });

  it('renders number of questions', () => {
    renderComponent();

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders quiz difficulty using helper function', () => {
    renderComponent();

    expect(screen.getByText('DIFFICULTY_2')).toBeInTheDocument();
  });

  it('renders formatted time limit', () => {
    renderComponent();

    expect(screen.getByText('125 sec | 02:05 min')).toBeInTheDocument();
  });

  it('renders "Quiz not found" when quiz does not exist', () => {
    renderComponent(999, quizzes);

    expect(screen.getByText('Quiz not found')).toBeInTheDocument();
  });

  it('renders "Quiz not found" when quizzes list is empty', () => {
    renderComponent(1, []);

    expect(screen.getByText('Quiz not found')).toBeInTheDocument();
  });
});
