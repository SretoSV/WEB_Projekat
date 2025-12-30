import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddQuestion } from '../components/AddQuestion';

//MOCKS
vi.mock('../styles/QuestionsStyles/EditQuestionStyle.module.css', () => ({
  default: {
    formModal: 'formModal',
    title: 'title',
    textInput: 'textInput',
    dropdownInput: 'dropdownInput',
    plusButtonDiv: 'plusButtonDiv'
  }
}));

vi.mock('../services/QuestionService', () => ({
  setQuestionType: (id: number) => {
    const map: Record<number, string> = {
      1: 'Multiple Choice',
      2: 'Multiple Correct',
      3: 'True / False',
      4: 'Fill in the blank'
    };
    return map[id];
  }
}));

vi.mock('../services/QuizService', () => ({
  setQuizDifficultyText: (id: number) => {
    const map: Record<number, string> = {
      1: 'easy',
      2: 'medium',
      3: 'hard'
    };
    return map[id];
  }
}));

vi.mock('../components/ButtonWithImage', () => ({
  default: ({ title }: any) => (
    <button type="submit">{title}</button>
  )
}));

vi.mock('../components/AddAndEditQuestionComponents/MultipleChoiceQuestion', () => ({
  MultipleChoiceQuestion: () => <div>MultipleChoiceQuestion</div>
}));

vi.mock('../components/AddAndEditQuestionComponents/MultipleCorrectAnswersQuestion', () => ({
  MultipleCorrectAnswersQuestion: () => <div>MultipleCorrectAnswersQuestion</div>
}));

vi.mock('../components/AddAndEditQuestionComponents/TrueFalseQuestion', () => ({
  TrueFalseQuestion: () => <div>TrueFalseQuestion</div>
}));

vi.mock('../components/AddAndEditQuestionComponents/FillInTheBlankQuestion', () => ({
  FillInTheBlankQuestion: () => <div>FillInTheBlankQuestion</div>
}));

// TEST DATA
const selectedCategories = [
  { id: 1, name: 'Math', isUsed: true }
];

const questions = [
  { id: 1, text: 'Q1' },
  { id: 2, text: 'Q2' }
] as any;

// SETUP
const onAddQuestion = vi.fn();
const onAddNewQuestionState = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

// HELPERS
const renderComponent = () => {
    render(
      <AddQuestion
        onAddQuestion={onAddQuestion}
        onAddNewQuestionState={onAddNewQuestionState}
        selectedCategories={selectedCategories}
        questions={questions}
        quizId={10}
      />
    );
};

// TESTS 
describe('AddQuestion', () => {

  it('renders form fields correctly', () => {
    renderComponent();

    expect(screen.getByText(/Add Question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question type:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question difficulty:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question category:/i)).toBeInTheDocument();
  });

  it('shows MultipleChoiceQuestion by default', () => {
    renderComponent();

    expect(screen.getByText('MultipleChoiceQuestion')).toBeInTheDocument();
  });

  it('changes question type and renders correct component', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Question type:/i), {
      target: { value: 3 }
    });

    await waitFor(() => {
      expect(screen.getByText('TrueFalseQuestion')).toBeInTheDocument();
    });
  });

  it('submits form and calls onAddQuestion and onAddNewQuestionState', async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Question.../i), {
      target: { value: 'New Question Text' }
    });

    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(onAddQuestion).toHaveBeenCalledTimes(1);
      expect(onAddQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'New Question Text',
          quizId: 10
        })
      );
    });

    expect(onAddNewQuestionState).toHaveBeenCalled();
  });

  it('resets form after submit', async () => {
    renderComponent();

    const textarea = screen.getByPlaceholderText(/Question.../i);

    fireEvent.change(textarea, {
      target: { value: 'Temp question' }
    });

    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect((textarea as HTMLTextAreaElement).value).toBe('');
    });
  });
});
