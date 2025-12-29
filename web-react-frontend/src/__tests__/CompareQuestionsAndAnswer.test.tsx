import { render, screen } from '@testing-library/react';
import { CompareQuestionAndAnswer } from '../components/CompareQuestionsAndAnswer';
import { useQuizContext } from '../context/QuizContext';
import { vi } from 'vitest';

// MOCKS
vi.mock('../context/QuizContext', () => ({
  useQuizContext: vi.fn(),
}));

// TEST DATA 
const mockQuiz = {
  id: 1,
  title: 'Sample Quiz',
  description: 'Description',
  quizDifficultyId: 1,
  timeLimitSeconds: 300,
  allQuizCategories: [],
  questions: [
    {
      id: 1,
      text: 'Question 1',
      questionTypeId: 1,
      quizCategoryId: 1,
      questionDifficultyId: 1,
      quizId: 1,
      answerOptions: [
        { id: 1, text: 'Answer 1', isCorrect: true, questionId: 1 },
        { id: 2, text: 'Answer 2', isCorrect: false, questionId: 1 },
      ],
    },
    {
      id: 2,
      text: 'Question 2',
      questionTypeId: 4,
      quizCategoryId: 1,
      questionDifficultyId: 1,
      quizId: 1,
      answerOptions: [
        { id: 3, text: 'Fill 1', isCorrect: true, questionId: 2, fieldAnswerText: 'Correct Answer' },
      ],
    },
  ],
  results: [],
};

const mockFinishedQuizResult = {
  id: 1,
  userId: 1,
  quizId: 1,
  startedAt: new Date(),
  isStarted: true,
  correctAnswers: 1,
  scorePercentage: 50,
  answers: [
    {
      id: 1,
      quizId: 1,
      resultId: 1,
      questionId: 1,
      userId: '1',
      isTrue: 'true',
      userAnswerOptions: [
        { id: 1, text: 'Answer 1', isCorrect: true, userAnswerId: 1 },
        { id: 2, text: 'Answer 2', isCorrect: false, userAnswerId: 1 },
      ],
    },
    {
      id: 2,
      quizId: 1,
      resultId: 1,
      questionId: 2,
      userId: '1',
      isTrue: 'false',
      userAnswerOptions: [
        { id: 3, text: 'Fill 1', isCorrect: false, fieldAnswerText: 'Wrong Answer', userAnswerId: 2 },
      ],
    },
  ],
};

// SETUP
beforeEach(() => {
  (useQuizContext as any).mockReturnValue({
    quizzes: [mockQuiz],
  });
});

// TESTS
describe('CompareQuestionAndAnswer', () => {

  it('renders total questions', () => {
    render(<CompareQuestionAndAnswer selectedQuizId={1} finishedQuizResult={mockFinishedQuizResult} />);
    expect(screen.getByText(/Total Questions: 2/)).toBeInTheDocument();
  });

  it('renders correct answers count', () => {
    render(<CompareQuestionAndAnswer selectedQuizId={1} finishedQuizResult={mockFinishedQuizResult} />);
    expect(screen.getByText(/Correct Answers: 1/)).toBeInTheDocument();
  });

  it('renders questions and answer options', () => {
    render(<CompareQuestionAndAnswer selectedQuizId={1} finishedQuizResult={mockFinishedQuizResult} />);
    expect(screen.getAllByText(/1. Question 1/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Answer 1 \| true/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Answer 2 \| false/)[0]).toBeInTheDocument();

    expect(screen.getAllByText(/Fill 1 \| Correct Answer/)[0]).toBeInTheDocument();
  });

});
