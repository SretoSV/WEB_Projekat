import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { IDontKnow } from "../../components/UserAnswerOptionsComponents/IDontKnow";

// MOCKS
const mockOnChangeIDontKnowCheckbox = vi.fn();

vi.mock("../../services/QuizService", () => ({
  onChangeIDontKnowCheckbox: (...args: any[]) =>
    mockOnChangeIDontKnowCheckbox(...args),
}));

const mockSetQuizResult = vi.fn();

vi.mock("../../context/QuizContext", () => ({
  useQuizContext: () => ({
    setQuizResult: mockSetQuizResult,
    currentUserAnswerIndex: 1,
  }),
}));

// TESTS
describe("IDontKnow", () => {
  it("renders label and checkbox", () => {
    render(
      <IDontKnow
        iDontKnowStates={[false, false]}
        setIDontKnowStates={vi.fn()}
        setFillInAnswer={vi.fn()}
      />
    );

    expect(screen.getByText("I don't know")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("checkbox is checked based on currentUserAnswerIndex", () => {
    render(
      <IDontKnow
        iDontKnowStates={[false, true]}
        setIDontKnowStates={vi.fn()}
        setFillInAnswer={vi.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("calls onChangeIDontKnowCheckbox with correct arguments on change", () => {
    const setIDontKnowStates = vi.fn();
    const setFillInAnswer = vi.fn();

    render(
      <IDontKnow
        iDontKnowStates={[false, false]}
        setIDontKnowStates={setIDontKnowStates}
        setFillInAnswer={setFillInAnswer}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(mockOnChangeIDontKnowCheckbox).toHaveBeenCalledWith(
      true,                 // isChecked
      1,                    // currentUserAnswerIndex
      setIDontKnowStates,
      setFillInAnswer,
      mockSetQuizResult
    );
  });
});
