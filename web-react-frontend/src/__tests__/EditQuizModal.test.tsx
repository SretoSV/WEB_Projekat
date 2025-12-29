import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditQuizModal from '../components/EditQuizModal';

// MOCKS
vi.mock('../components/ButtonWithText', () => ({
  default: ({ text, onClick1, ...rest }: any) => (
    <button onClick={onClick1} {...rest}>{text}</button>
  ),
}));

vi.mock('../components/ButtonWithLongText', () => ({
  default: ({ text, ...props }: any) => <button {...props}>{text}</button>,
}));

vi.mock('../components/ButtonWithImage', () => ({
  default: ({ title, onClick1 }: any) => (
    <button onClick={onClick1}>{title}</button>
  ),
}));

vi.mock('../components/CategoryCheckboxesCard', () => ({
  default: () => <div data-testid="category-checkboxes" />,
}));

vi.mock('../components/QuestionsEditBox', () => ({
  QuestionsEditBox: () => <div data-testid="questions-edit-box" />,
}));

vi.mock('../components/AddQuestion', () => ({
  AddQuestion: () => <div data-testid="add-question" />,
}));

vi.mock('../components/EditQuestion', () => ({
  EditQuestion: () => <div data-testid="edit-question" />,
}));

vi.mock('../services/QuizCategoryService', () => ({
  fetchCategories: vi.fn().mockResolvedValue({
    categories: [{ id: 1, name: 'Sport', isUsed: false }],
  }),
  createNewCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

const quizzesMock = [
  {
    id: 1,
    title: 'Test Quiz',
    description: 'Test Desc',
    quizDifficultyId: 1,
    timeLimitSeconds: 60,
    allQuizCategories: [
      { id: 1, name: 'Sport', isUsed: true },
    ],
    questions: [],
    results: [],
  },
];

vi.mock('../context/QuizContext', () => ({
  useQuizContext: () => ({
    quizzes: quizzesMock,
  }),
}));

vi.mock('../context/UserContext', () => ({
  useUserContext: () => ({
    handleLogout: vi.fn(),
  }),
}));

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('EditQuizModal', () => {

  it('renders quiz data', async () => {
    render(<EditQuizModal quizId={1} onClose={vi.fn()} onEditQuiz={vi.fn()} />);

    expect(await screen.findByDisplayValue('Test Quiz')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Desc')).toBeInTheDocument();
    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    const onCloseMock = vi.fn();

    render(<EditQuizModal quizId={1} onClose={onCloseMock} onEditQuiz={vi.fn()} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onEditQuiz on submit', () => {
    const onEditQuizMock = vi.fn();

    render(<EditQuizModal quizId={1} onClose={vi.fn()} onEditQuiz={onEditQuizMock} />);

    fireEvent.click(screen.getByText('Edit quiz'));

    expect(onEditQuizMock).toHaveBeenCalledTimes(1);
  });

  it('toggles questions list', () => {
    render(<EditQuizModal quizId={1} onClose={vi.fn()} onEditQuiz={vi.fn()} />);

    fireEvent.click(screen.getByText('Toggle'));

    expect(screen.getByTestId('questions-edit-box')).toBeInTheDocument();
  });

  it('renders fallback when quiz is not found', () => {
    render(<EditQuizModal quizId={999} onClose={vi.fn()} onEditQuiz={vi.fn()} />);

    expect(screen.getByText('Quiz not found')).toBeInTheDocument();
  });

});
