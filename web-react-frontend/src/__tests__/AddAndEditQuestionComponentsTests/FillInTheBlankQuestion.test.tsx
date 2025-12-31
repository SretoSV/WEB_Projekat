import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FillInTheBlankQuestion } from "../../components/AddAndEditQuestionComponents/FillInTheBlankQuestion";

// MOCKS
const mockSetForm = vi.fn();
const mockSetOptionsForm = vi.fn();
const mockSetFillInAnswer = vi.fn();

const mockForm = {
  id: 1,
  text: "Sample question",
  questionTypeId: 4,
  quizCategoryId: 1,
  questionDifficultyId: 1,
  quizId: 1,
  answerOptions: [],
};

// TESTS
describe("FillInTheBlankQuestion", () => {

  it("renders input and button", () => {
    render(
      <FillInTheBlankQuestion
        form={mockForm}
        optionsForm={[]}
        setForm={mockSetForm}
        setOptionsForm={mockSetOptionsForm}
        fillInAnswer=""
        setFillInAnswer={mockSetFillInAnswer}
      />
    );

    expect(screen.getByPlaceholderText("Enter correct answer")).toBeInTheDocument();
    expect(screen.getByText("Set answer")).toBeInTheDocument();
  });

  it("calls setFillInAnswer when input changes", () => {
    render(
      <FillInTheBlankQuestion
        form={mockForm}
        optionsForm={[]}
        setForm={mockSetForm}
        setOptionsForm={mockSetOptionsForm}
        fillInAnswer=""
        setFillInAnswer={mockSetFillInAnswer}
      />
    );

    const input = screen.getByPlaceholderText("Enter correct answer");
    fireEvent.change(input, { target: { value: "Test answer" } });

    expect(mockSetFillInAnswer).toHaveBeenCalledWith("Test answer");
  });

  it("sets answer correctly when 'Set answer' button is clicked", () => {
    render(
      <FillInTheBlankQuestion
        form={mockForm}
        optionsForm={[]}
        setForm={mockSetForm}
        setOptionsForm={mockSetOptionsForm}
        fillInAnswer="My answer"
        setFillInAnswer={mockSetFillInAnswer}
      />
    );

    const button = screen.getByText("Set answer");
    fireEvent.click(button);

    expect(mockSetOptionsForm).toHaveBeenCalledWith([
      {
        id: 1,
        text: "Fill-answer",
        isCorrect: true,
        questionId: 1,
        fieldAnswerText: "My answer",
      },
    ]);

    expect(mockSetForm).toHaveBeenCalled();
    const arg = mockSetForm.mock.calls[0][0];
    const result = typeof arg === "function" ? arg(mockForm) : arg;

    expect(result.answerOptions).toEqual([
    {
        id: 1,
        text: "Fill-answer",
        isCorrect: true,
        questionId: 1,
        fieldAnswerText: "My answer",
    },
    ]);

  });

  it("shows value from optionsForm if exists", () => {
    render(
      <FillInTheBlankQuestion
        form={mockForm}
        optionsForm={[{ fieldAnswerText: "Option answer", id: 1, text: "", isCorrect: true, questionId: 1 }]}
        setForm={mockSetForm}
        setOptionsForm={mockSetOptionsForm}
        fillInAnswer="Fallback"
        setFillInAnswer={mockSetFillInAnswer}
      />
    );

    const input = screen.getByPlaceholderText("Enter correct answer") as HTMLInputElement;
    expect(input.value).toBe("Option answer");
  });
});
