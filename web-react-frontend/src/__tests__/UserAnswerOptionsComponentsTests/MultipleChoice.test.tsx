import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MultipleChoice } from "../../components/UserAnswerOptionsComponents/MultipleChoice";
import type { UserQuizResult } from "../../models/UserQuizResultModel";

// MOCKS
const mockOnChangeMultipleChoice = vi.fn();

vi.mock("../../services/QuizService", () => ({
  onChangeMultipleChoice: (...args: any[]) =>
    mockOnChangeMultipleChoice(...args),
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
          isCorrect: false,
          userAnswerId: 1,
        },
        {
          id: 2,
          text: "Option B",
          isCorrect: true,
          userAnswerId: 1,
        },
      ],
    },
  ],
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe("MultipleChoice", () => {

  it("renders radio options with labels", () => {
    render(<MultipleChoice quizResult={mockQuizResult} />);

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
  });

  it("checks radio based on isCorrect value", () => {
    render(<MultipleChoice quizResult={mockQuizResult} />);

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
  });

  it("calls onChangeMultipleChoice with correct arguments when radio is clicked", () => {
    render(<MultipleChoice quizResult={mockQuizResult} />);

    const radios = screen.getAllByRole("radio");

    fireEvent.click(radios[0]);

    expect(mockOnChangeMultipleChoice).toHaveBeenCalledWith(
      mockSetQuizResult, // setQuizResult
      0,                 // currentUserAnswerIndex
      0                  // option index
    );
  });
});
