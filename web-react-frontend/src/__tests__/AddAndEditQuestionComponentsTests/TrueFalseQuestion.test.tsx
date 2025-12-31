import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrueFalseQuestion } from "../../components/AddAndEditQuestionComponents/TrueFalseQuestion";

// MOCKS
const mockOnAddOptionsToQuestion = vi.fn();
const mockForm = { id: 1, answerOptions: [] } as any;
const mockOptions = [{ id: 1, text: "True/False Answer", isCorrect: false, questionId: 1 }];
let executedSetOptionsForm: any;
let executedSetForm: any;

// SETUP
beforeEach(() => {
  vi.clearAllMocks();

  // Mock koji izvrsava callback funkciju ako je prosledjena
  executedSetOptionsForm = vi.fn((arg) => (typeof arg === "function" ? arg([...mockOptions]) : arg));
  executedSetForm = vi.fn((arg) => (typeof arg === "function" ? arg({ ...mockForm }) : arg));
});

// TESTS
describe("TrueFalseQuestion", () => {

  it("renders text and checkbox", () => {
    render(
      <TrueFalseQuestion
        form={mockForm}
        optionsForm={mockOptions}
        setOptionsForm={executedSetOptionsForm}
        setForm={executedSetForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    expect(screen.getByText("true-false")).toBeInTheDocument();
    expect(screen.getByLabelText("Is this statement true?")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByText("Set answer")).toBeInTheDocument();
  });

  it("updates form and options when checkbox is clicked", () => {
    render(
      <TrueFalseQuestion
        form={mockForm}
        optionsForm={mockOptions}
        setOptionsForm={executedSetOptionsForm}
        setForm={executedSetForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    // Poziva setOptionsForm
    const newOptions = typeof executedSetOptionsForm.mock.calls[0][0] === "function"
      ? executedSetOptionsForm.mock.calls[0][0]([...mockOptions])
      : executedSetOptionsForm.mock.calls[0][0];

    expect(newOptions).toEqual([
      { id: 1, text: "True/False Answer", isCorrect: true, questionId: 1 }
    ]);

    // Poziva setForm
    const newForm = typeof executedSetForm.mock.calls[0][0] === "function"
      ? executedSetForm.mock.calls[0][0]({ ...mockForm })
      : executedSetForm.mock.calls[0][0];

    expect(newForm).toEqual(expect.objectContaining({
      answerOptions: [{ id: 1, text: "True/False Answer", isCorrect: true, questionId: 1 }]
    }));
  });

  it("calls onAddOptionsToQuestion when 'Set answer' button is clicked", () => {
    render(
      <TrueFalseQuestion
        form={mockForm}
        optionsForm={mockOptions}
        setOptionsForm={executedSetOptionsForm}
        setForm={executedSetForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const button = screen.getByText("Set answer");
    fireEvent.click(button);

    expect(mockOnAddOptionsToQuestion).toHaveBeenCalled();
  });
});
