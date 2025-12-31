import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MultipleChoiceQuestion } from "../../components/AddAndEditQuestionComponents/MultipleChoiceQuestion";

// MOCKS
const mockOnOptionChange = vi.fn();
const mockSetOptionsForm = vi.fn();
const mockOnAddOptionsToQuestion = vi.fn();

const mockOptions = [
  { id: 1, text: "Option 1", isCorrect: true, questionId: 1 },
  { id: 2, text: "Option 2", isCorrect: false, questionId: 1 },
  { id: 3, text: "Option 3", isCorrect: false, questionId: 1 },
  { id: 4, text: "Option 4", isCorrect: false, questionId: 1 },
];

// TESTS
describe("MultipleChoiceQuestion", () => {

  it("renders 4 input fields and the button", () => {
    render(
      <MultipleChoiceQuestion
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={mockSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const textInputs = screen.getAllByRole("textbox");
    expect(textInputs).toHaveLength(4);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(4);

    expect(screen.getByText("Edit options")).toBeInTheDocument();
  });

  it("calls onOptionChange when text input changes", () => {
    render(
      <MultipleChoiceQuestion
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={mockSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const input = screen.getByDisplayValue("Option 2");
    fireEvent.change(input, { target: { value: "Changed Option 2" } });

    expect(mockOnOptionChange).toHaveBeenCalledWith(1, "text", "Changed Option 2");
  });

  it("updates optionsForm when radio button is clicked", () => {
    const optionsCopy = [...mockOptions];

    const mockSetOptionsFormExecuted = vi.fn((arg: any) => {
        return typeof arg === "function" ? arg(optionsCopy) : arg;
    });

    render(
        <MultipleChoiceQuestion
        optionsForm={optionsCopy}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={mockSetOptionsFormExecuted}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
        />
    );

    const radioToClick = screen.getAllByRole("radio")[2]; // Option 3
    fireEvent.click(radioToClick);

    const updatedOptions = mockSetOptionsFormExecuted.mock.calls[0][0];
    const result = typeof updatedOptions === "function" ? updatedOptions(optionsCopy) : updatedOptions;

    expect(result).toEqual(
        optionsCopy.map((opt, i) => ({ ...opt, isCorrect: i === 2 }))
    );
  });


  it("calls onAddOptionsToQuestion when 'Edit options' button is clicked", () => {
    render(
      <MultipleChoiceQuestion
        optionsForm={mockOptions}
        onOptionChange={mockOnOptionChange}
        setOptionsForm={mockSetOptionsForm}
        onAddOptionsToQuestion={mockOnAddOptionsToQuestion}
      />
    );

    const button = screen.getByText("Edit options");
    fireEvent.click(button);

    expect(mockOnAddOptionsToQuestion).toHaveBeenCalled();
  });
});
