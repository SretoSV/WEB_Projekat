import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrueFalse } from "../../components/UserAnswerOptionsComponents/TrueFalse";
import type { UserQuizResult } from "../../models/UserQuizResultModel";

// MOCKS
const mockOnChangeTrueFalse = vi.fn();

vi.mock("../../services/QuizService", () => ({
  onChangTrueFalse: (...args: any[]) => mockOnChangeTrueFalse(...args),
}));

const mockSetQuizResult = vi.fn();

vi.mock("../../context/QuizContext", () => ({
  useQuizContext: () => ({
    setQuizResult: mockSetQuizResult,
    currentUserAnswerIndex: 0,
  }),
}));

const baseQuizResult: UserQuizResult = {
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
          text: "True/False",
          isCorrect: null,
          userAnswerId: 1,
        },
      ],
    },
  ],
};

// TESTS
describe("TrueFalse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders True and False radio options", () => {
    render(<TrueFalse quizResult={baseQuizResult} />);

    expect(screen.getByLabelText("True")).toBeInTheDocument();
    expect(screen.getByLabelText("False")).toBeInTheDocument();

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
  });

  it("checks True radio when answer is true", () => {
    const quizResultTrue: UserQuizResult = {
      ...baseQuizResult,
      answers: [
        {
          ...baseQuizResult.answers![0],
          userAnswerOptions: [
            {
              ...baseQuizResult.answers![0].userAnswerOptions![0],
              isCorrect: true,
            },
          ],
        },
      ],
    };

    render(<TrueFalse quizResult={quizResultTrue} />);

    const trueRadio = screen.getByLabelText("True") as HTMLInputElement;
    const falseRadio = screen.getByLabelText("False") as HTMLInputElement;

    expect(trueRadio.checked).toBe(true);
    expect(falseRadio.checked).toBe(false);
  });

  it("checks False radio when answer is false", () => {
    const quizResultFalse: UserQuizResult = {
      ...baseQuizResult,
      answers: [
        {
          ...baseQuizResult.answers![0],
          userAnswerOptions: [
            {
              ...baseQuizResult.answers![0].userAnswerOptions![0],
              isCorrect: false,
            },
          ],
        },
      ],
    };

    render(<TrueFalse quizResult={quizResultFalse} />);

    const trueRadio = screen.getByLabelText("True") as HTMLInputElement;
    const falseRadio = screen.getByLabelText("False") as HTMLInputElement;

    expect(trueRadio.checked).toBe(false);
    expect(falseRadio.checked).toBe(true);
  });

  it("calls onChangTrueFalse with true when True is selected", () => {
    render(<TrueFalse quizResult={baseQuizResult} />);

    fireEvent.click(screen.getByLabelText("True"));

    expect(mockOnChangeTrueFalse).toHaveBeenCalledWith(
      mockSetQuizResult,
      0,
      true
    );
  });

  it("calls onChangTrueFalse with false when False is selected", () => {
    render(<TrueFalse quizResult={baseQuizResult} />);

    fireEvent.click(screen.getByLabelText("False"));

    expect(mockOnChangeTrueFalse).toHaveBeenCalledWith(
      mockSetQuizResult,
      0,
      false
    );
  });
});
