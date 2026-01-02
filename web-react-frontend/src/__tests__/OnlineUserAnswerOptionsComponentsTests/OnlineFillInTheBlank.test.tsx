import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OnlineFillInTheBlank } from "../../components/OnlineUserAnswerOptionsComponents/OnlineFillInTheBlank";

// MOCKS
vi.mock("../../context/UserContext", () => ({
  useUserContext: () => ({
    user: { username: "testuser" },
  }),
}));

const mockSetQuizResult = vi.fn();

vi.mock("../../context/OnlineQuizContext", () => ({
  useOnlineQuizContext: () => ({
    setQuizResult: mockSetQuizResult,
    currentUserAnswerIndex: 0,
  }),
}));

const mockOnChangeFillInTheBlank = vi.fn();

vi.mock("../../services/QuizService", () => ({
  onChangFillInTheBlank: (...args: any[]) =>
    mockOnChangeFillInTheBlank(...args),
}));

const mockInvoke = vi.fn();

vi.mock("../../sockets/socket", () => ({
  default: {
    invoke: (...args: any[]) => mockInvoke(...args),
  },
}));

const mockSetFillInAnswer = vi.fn();

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe("OnlineFillInTheBlank", () => {

  it("renders text and input field", () => {
    render(
      <OnlineFillInTheBlank
        fillInAnswer=""
        setFillInAnswer={mockSetFillInAnswer}
        gameRoomId={1}
      />
    );

    expect(screen.getByText("fill-in-the-blank")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter correct answer")
    ).toBeInTheDocument();
  });

  it("updates answer and triggers all side effects on input change", () => {
    render(
      <OnlineFillInTheBlank
        fillInAnswer=""
        setFillInAnswer={mockSetFillInAnswer}
        gameRoomId={5}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter correct answer"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Paris" } });

    expect(mockSetFillInAnswer).toHaveBeenCalledWith("Paris");

    expect(mockOnChangeFillInTheBlank).toHaveBeenCalledWith(
      mockSetQuizResult,
      0,
      "Paris"
    );

    // socket invoke
    expect(mockInvoke).toHaveBeenCalledWith(
      "AnswerInteraction",
      "answer_interaction",
      5,
      "testuser"
    );
  });

  it("works even if gameRoomId is undefined", () => {
    render(
      <OnlineFillInTheBlank
        fillInAnswer=""
        setFillInAnswer={mockSetFillInAnswer}
        gameRoomId={undefined}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter correct answer"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Answer" } });

    expect(mockInvoke).toHaveBeenCalledWith(
      "AnswerInteraction",
      "answer_interaction",
      undefined,
      "testuser"
    );
  });
});
