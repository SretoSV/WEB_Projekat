import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FillInTheBlank } from "../../components/UserAnswerOptionsComponents/FillInTheBlank";

// MOCKS
const mockOnChangeFillInTheBlank = vi.fn();

vi.mock("../../services/QuizService", () => ({
  onChangFillInTheBlank: (...args: any[]) =>
    mockOnChangeFillInTheBlank(...args),
}));

const mockSetQuizResult = vi.fn();

vi.mock("../../context/QuizContext", () => ({
  useQuizContext: () => ({
    setQuizResult: mockSetQuizResult,
    currentUserAnswerIndex: 2,
  }),
}));

// TESTS
describe("FillInTheBlank", () => {
  it("renders label and input", () => {
    render(
      <FillInTheBlank
        fillInAnswer=""
        setFillInAnswer={vi.fn()}
      />
    );

    expect(screen.getByText("fill-in-the-blank")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter correct answer")
    ).toBeInTheDocument();
  });

  it("shows current fillInAnswer value", () => {
    render(
      <FillInTheBlank
        fillInAnswer="test answer"
        setFillInAnswer={vi.fn()}
      />
    );

    expect(
      screen.getByDisplayValue("test answer")
    ).toBeInTheDocument();
  });

  it("calls setFillInAnswer and onChangFillInTheBlank on input change", () => {
    const setFillInAnswer = vi.fn();

    render(
      <FillInTheBlank
        fillInAnswer=""
        setFillInAnswer={setFillInAnswer}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter correct answer"
    );

    fireEvent.change(input, {
      target: { value: "Paris" },
    });

    expect(setFillInAnswer).toHaveBeenCalledWith("Paris");

    expect(mockOnChangeFillInTheBlank).toHaveBeenCalledWith(
      mockSetQuizResult,
      2,
      "Paris"
    );
  });
});
