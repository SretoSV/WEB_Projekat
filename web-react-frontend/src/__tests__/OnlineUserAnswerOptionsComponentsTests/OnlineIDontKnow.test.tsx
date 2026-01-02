import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OnlineIDontKnow } from "../../components/OnlineUserAnswerOptionsComponents/OnlineIDontKnow";

// MOCKS
const mocks = vi.hoisted(() => ({
  onChangeIDontKnowCheckbox: vi.fn(),
  setQuizResult: vi.fn(),
}));

vi.mock("../../services/QuizService", () => ({
  onChangeIDontKnowCheckbox: mocks.onChangeIDontKnowCheckbox,
}));

vi.mock("../../context/OnlineQuizContext", () => ({
  useOnlineQuizContext: () => ({
    setQuizResult: mocks.setQuizResult,
    currentUserAnswerIndex: 1,
  }),
}));


const mockSetIDontKnowStates = vi.fn();
const mockSetFillInAnswer = vi.fn();

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe("OnlineIDontKnow", () => {

  it("renders checkbox and label", () => {
    render(
      <OnlineIDontKnow
        iDontKnowStates={[false, false]}
        setIDontKnowStates={mockSetIDontKnowStates}
        setFillInAnswer={mockSetFillInAnswer}
      />
    );

    expect(screen.getByLabelText("I don't know")).toBeInTheDocument();
  });

  it("checkbox is checked based on currentUserAnswerIndex", () => {
    render(
      <OnlineIDontKnow
        iDontKnowStates={[false, true]}
        setIDontKnowStates={mockSetIDontKnowStates}
        setFillInAnswer={mockSetFillInAnswer}
      />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChangeIDontKnowCheckbox with correct arguments", () => {
    render(
      <OnlineIDontKnow
        iDontKnowStates={[false, false]}
        setIDontKnowStates={mockSetIDontKnowStates}
        setFillInAnswer={mockSetFillInAnswer}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(mocks.onChangeIDontKnowCheckbox).toHaveBeenCalledWith(
      true,
      1,
      mockSetIDontKnowStates,
      mockSetFillInAnswer,
      mocks.setQuizResult
    );
  });
});
