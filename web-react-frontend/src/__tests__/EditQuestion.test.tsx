import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditQuestion } from '../components/EditQuestion';
import type { Question } from '../models/QuestionModel';

// MOCKS
vi.mock('../components/AddAndEditQuestionComponents/MultipleChoiceQuestion', () => ({
  MultipleChoiceQuestion: ({ optionsForm }: any) => <div data-testid="multiple-choice">{optionsForm.length}</div>,
}));

vi.mock('../components/AddAndEditQuestionComponents/MultipleCorrectAnswersQuestion', () => ({
  MultipleCorrectAnswersQuestion: () => <div data-testid="multiple-correct" />,
}));

vi.mock('../components/AddAndEditQuestionComponents/TrueFalseQuestion', () => ({
  TrueFalseQuestion: () => <div data-testid="true-false" />,
}));

vi.mock('../components/AddAndEditQuestionComponents/FillInTheBlankQuestion', () => ({
  FillInTheBlankQuestion: () => <div data-testid="fill-in-the-blank" />,
}));

vi.mock('../services/QuestionService', () => ({
  setQuestionType: (id: number) => `Type ${id}`,
}));

vi.mock('../services/QuizService', () => ({
  setQuizDifficultyText: (id: number) => `Difficulty ${id}`,
}));

vi.mock('../functions/formChangeFunction', () => ({
    handleInputChange: (e: any, setter: any, _type: string) => {
        setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    },
}));

vi.mock('../components/ButtonWithImage', () => ({
  default: ({ title, ...props }: any) => <button {...props}>{title}</button>,
}));

// TEST DATA
const selectedQuestion: Question = {
  id: 1,
  text: 'Test Question',
  questionTypeId: 1,
  quizCategoryId: 10,
  questionDifficultyId: 1,
  quizId: 100,
  answerOptions: [
    { id: 1, text: 'Answer 1', isCorrect: true, questionId: 1 },
    { id: 2, text: 'Answer 2', isCorrect: false, questionId: 1 },
  ],
};

const categories = [{ id: 10, name: 'Math', isUsed: true }, { id: 20, name: 'Science', isUsed: true }];

// HELPERS
const renderComponent = () => {
    render(
      <EditQuestion
        selectedQuestion={selectedQuestion}
        onEditQuestion={onEditQuestionMock}
        onEditNewQuestionState={onEditNewQuestionStateMock}
        selectedCategories={categories}
        questions={[selectedQuestion]}
      />
    );
};

// SETUP
const onEditQuestionMock = vi.fn();
const onEditNewQuestionStateMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('EditQuestion', () => {

  it('renders form with question data', () => {
    renderComponent();

    expect(screen.getByDisplayValue('Test Question')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Type 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Difficulty 1')).toBeInTheDocument();
  });

  it('renders MultipleChoiceQuestion for type 1', () => {
    renderComponent();

    expect(screen.getByTestId('multiple-choice')).toBeInTheDocument();
  });

  it('submits form and calls callbacks', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Add'));

    expect(onEditQuestionMock).toHaveBeenCalledTimes(1);
    expect(onEditNewQuestionStateMock).toHaveBeenCalledTimes(1);
  });

  it('renders fallback if question id is 0', () => {
    const emptyQuestion = { ...selectedQuestion, id: 0 };
    render(
      <EditQuestion
        selectedQuestion={emptyQuestion}
        onEditQuestion={onEditQuestionMock}
        onEditNewQuestionState={onEditNewQuestionStateMock}
        selectedCategories={categories}
        questions={[selectedQuestion]}
      />
    );

    expect(screen.getByText('Edit Question: 0')).toBeInTheDocument();
  });
});
