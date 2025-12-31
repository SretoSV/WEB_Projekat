import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MultipleCorrectAnswers } from "../../components/UserAnswerOptionsComponents/MultipleCorrectAnswers";
import type { UserQuizResult } from "../../models/UserQuizResultModel";

// MOCKS
const mockOnChangeMultipleCorrectAnswers = vi.fn();

vi.mock("../../services/QuizService", () => ({
  onChangMultipleCorrectAnswers: (...args: any[]) =>
    mockOnChangeMultipleCorrectAnswers(...args),
}));

const mockSetQuizResult = vi.fn();

vi.mock("../../context/QuizContext", () => ({
  useQuizContext: () => ({
    setQuizResult: mockSetQuizResult,
    currentUserAnswerIndex: 0,
  }),
}));

const mockQuizResult: UserQuizResult = {
  id: 1,
  userId: 1,
  quizId: 1,
  startedAt: new Date(),
  isStarted: true,
  answers: [
    {
      id: 1,
      quizId: 1,
      resultId: 1,
      questionId: 1,
      userId: "1",
      isTrue: "false",
      userAnswerOptions: [
        {
          id: 1,
          text: "Option A",
          isCorrect: true,
          userAnswerId: 1,
        },
        {
          id: 2,
          text: "Option B",
          isCorrect: false,
          userAnswerId: 1,
        },
      ],
    },
  ],
};

// TESTS
describe("MultipleCorrectAnswers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders checkbox options with labels", () => {
    render(<MultipleCorrectAnswers quizResult={mockQuizResult} />);

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });

  it("sets checked state based on isCorrect value", () => {
    render(<MultipleCorrectAnswers quizResult={mockQuizResult} />);

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
  });

  it("calls onChangMultipleCorrectAnswers with correct arguments on change", () => {
    render(<MultipleCorrectAnswers quizResult={mockQuizResult} />);

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[1]);

    expect(mockOnChangeMultipleCorrectAnswers).toHaveBeenCalledWith(
      mockSetQuizResult, // setQuizResult
      0,                 // currentUserAnswerIndex
      1,                 // option index
      true               // isChecked
    );
  });
});
