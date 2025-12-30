import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddQuizModal from '../components/AddQuizModal';

// MOCKS
vi.mock('../context/UserContext', () => ({
  useUserContext: () => ({
    handleLogout: vi.fn()
  })
}));

vi.mock('../context/QuizContext', () => ({
  useQuizContext: () => ({
    quizzes: [
      { id: 1 },
      { id: 2 }
    ]
  })
}));

const fetchCategoriesMock = vi.fn();
const deleteCategoryMock = vi.fn();

vi.mock('../services/QuizCategoryService', () => ({
  fetchCategories: (...args: any[]) => fetchCategoriesMock(...args),
  deleteCategory: (...args: any[]) => deleteCategoryMock(...args),
  createNewCategory: (name: string) => ({
    id: 99,
    name,
    isUsed: true
  })
}));

vi.mock('../components/ButtonWithImage', () => ({
  default: ({ onClick1 }: any) => (
    <button onClick={onClick1}>Add Category</button>
  )
}));

vi.mock('../components/CategoryCheckboxesCard', () => ({
  default: () => <div>CategoryCheckboxesCard</div>
}));

vi.mock('../components/ButtonWithLongText', () => ({
  default: ({ text, onClick }: any) => (
    <button onClick={onClick}>{text}</button>
  )
}));

vi.mock('../components/QuestionsEditBox', () => ({
  QuestionsEditBox: () => <div>QuestionsEditBox</div>
}));

vi.mock('../components/AddQuestion', () => ({
  AddQuestion: () => <div>AddQuestion</div>
}));

vi.mock('../components/EditQuestion', () => ({
  EditQuestion: () => <div>EditQuestion</div>
}));

const onClose = vi.fn();
const onAddQuiz = vi.fn();

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
  fetchCategoriesMock.mockResolvedValue({
    categories: [
      { id: 1, name: 'Math', isUsed: false }
    ]
  });
});

//TESTS
describe('AddQuizModal', () => {

  it('renders modal and form fields', async () => {
    render(<AddQuizModal onClose={onClose} onAddQuiz={onAddQuiz} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Difficulty/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time limit/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchCategoriesMock).toHaveBeenCalled();
    });
  });

  it('calls onClose when Cancel is clicked', async () => {
    render(<AddQuizModal onClose={onClose} onAddQuiz={onAddQuiz} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('submits form and calls onAddQuiz', async () => {
    render(<AddQuizModal onClose={onClose} onAddQuiz={onAddQuiz} />);

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'My Quiz' }
    });

    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Quiz description' }
    });

    fireEvent.change(screen.getByLabelText(/Time limit/i), {
      target: { value: 60 }
    });

    fireEvent.click(screen.getByText('Add quiz'));

    await waitFor(() => {
      expect(onAddQuiz).toHaveBeenCalledTimes(1);
      expect(onAddQuiz).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'My Quiz',
          description: 'Quiz description',
          timeLimitSeconds: 60
        })
      );
    });
  });

  it('adds new category when Add Category button is clicked', async () => {
    render(<AddQuizModal onClose={onClose} onAddQuiz={onAddQuiz} />);

    fireEvent.change(screen.getByPlaceholderText(/Type category/i), {
      target: { value: 'Science' }
    });

    fireEvent.click(screen.getByText('Add Category'));

    expect(screen.getByPlaceholderText(/Type category/i)).toHaveValue('');
  });

  it('shows question buttons when category exists', async () => {
    render(<AddQuizModal onClose={onClose} onAddQuiz={onAddQuiz} />);

    await waitFor(() => {
      expect(fetchCategoriesMock).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByPlaceholderText(/Type category/i), {
      target: { value: 'History' }
    });

    fireEvent.click(screen.getByText('Add Category'));

    expect(screen.getByText('Toggle')).toBeInTheDocument();
    expect(screen.getByText('Add question')).toBeInTheDocument();
  });
});
