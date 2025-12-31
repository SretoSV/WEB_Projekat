import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MultipleCorrectAnswersQuestion } from "../../components/AddAndEditQuestionComponents/MultipleCorrectAnswersQuestion";

// MOCKS
const mockOnOptionChange = vi.fn();
const mockOnAddOptionsToQuestion = vi.fn();
const mockForm = { id: 1 } as any;
let executedSetOptionsForm: any;

const mockOptions = [
  { id: 1, text: "Option 1", isCorrect: true, questionId: 1 },
  { id: 2, text: "Option 2", isCorrect: false, questionId: 1 },
];


// SETUP
beforeEach(() => {
  vi.clearAllMocks();

  //mock koji izvrsava funkciju ako se prosledi
  executedSetOptionsForm = vi.fn((arg) => {
    return typeof arg === "function" ? arg([...mockOptions]) : arg;
  });
});

// TESTS
describe("MultipleCorrectAnswersQuestion", () => {

  it("renders options and buttons", () => {
    render(
      <MultipleCorrectAnswersQuestion
        form={mockForm}
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={executedSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    expect(screen.getByText("multiple-correct-answers")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(mockOptions.length);
    expect(screen.getAllByRole("checkbox")).toHaveLength(mockOptions.length);
    expect(screen.getByText("Add Option")).toBeInTheDocument();
    expect(screen.getByText("Set options")).toBeInTheDocument();
  });

  it("calls onOptionChange when text input changes", () => {
    render(
      <MultipleCorrectAnswersQuestion
        form={mockForm}
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={executedSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const input = screen.getByDisplayValue("Option 2");
    fireEvent.change(input, { target: { value: "Changed Option 2" } });

    expect(mockOnOptionChange).toHaveBeenCalledWith(1, "text", "Changed Option 2");
  });

  it("calls onOptionChange when checkbox is toggled", () => {
    render(
      <MultipleCorrectAnswersQuestion
        form={mockForm}
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={executedSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const checkbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(checkbox);

    expect(mockOnOptionChange).toHaveBeenCalledWith(1, "isCorrect", true);
  });

  it("adds a new option when 'Add Option' button is clicked", () => {
    render(
      <MultipleCorrectAnswersQuestion
        form={mockForm}
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={executedSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const addButton = screen.getByText("Add Option");
    fireEvent.click(addButton);

    const result = executedSetOptionsForm.mock.calls[0][0];
    const newOptions = typeof result === "function" ? result([...mockOptions]) : result;

    expect(newOptions).toEqual([
      ...mockOptions,
      { id: mockOptions.length + 1, text: "", isCorrect: false, questionId: mockForm.id }
    ]);
  });

  it("removes an option when 'x' button is clicked", () => {
    render(
      <MultipleCorrectAnswersQuestion
        form={mockForm}
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={executedSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const removeButton = screen.getAllByText("x")[0];
    fireEvent.click(removeButton);

    const result = executedSetOptionsForm.mock.calls[0][0];
    const newOptions = typeof result === "function" ? result([...mockOptions]) : result;

    expect(newOptions).toEqual(
      mockOptions.filter((_, index) => index !== 0)
    );
  });

  it("calls onAddOptionsToQuestion when 'Set options' button is clicked", () => {
    render(
      <MultipleCorrectAnswersQuestion
        form={mockForm}
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={executedSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const button = screen.getByText("Set options");
    fireEvent.click(button);

    expect(mockOnAddOptionsToQuestion).toHaveBeenCalled();
  });
});
