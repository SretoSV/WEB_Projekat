import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OnlineMultipleCorrectAnswers } from "../../components/OnlineUserAnswerOptionsComponents/OnlineMultipleCorrectAnswers";
import type { UserQuizResult } from "../../models/UserQuizResultModel";

// MOCKS
const mocks = vi.hoisted(() => ({
  onChangeMultipleCorrectAnswers: vi.fn(),
  socketInvoke: vi.fn(),
  setQuizResult: vi.fn(),
}));

vi.mock("../../services/QuizService", () => ({
  onChangMultipleCorrectAnswers: mocks.onChangeMultipleCorrectAnswers,
}));

vi.mock("../../sockets/socket", () => ({
  default: {
    invoke: mocks.socketInvoke,
  },
}));

vi.mock("../../context/OnlineQuizContext", () => ({
  useOnlineQuizContext: () => ({
    setQuizResult: mocks.setQuizResult,
    currentUserAnswerIndex: 0,
  }),
}));

vi.mock("../../context/UserContext", () => ({
  useUserContext: () => ({
    user: {
      username: "testUser",
    },
  }),
}));

// TEST DATA
const quizResult: UserQuizResult = {
  id: 1,
  gameRoomId: 22,
  answers: [
    {
      userAnswerOptions: [
        { id: 1, text: "Option A", isCorrect: false },
        { id: 2, text: "Option B", isCorrect: true },
      ],
    },
  ],
} as any;

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe("OnlineMultipleCorrectAnswers", () => {

  it("renders all checkbox options", () => {
    render(<OnlineMultipleCorrectAnswers quizResult={quizResult} />);

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("sets checked state correctly based on quizResult", () => {
    render(<OnlineMultipleCorrectAnswers quizResult={quizResult} />);

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("calls onChangMultipleCorrectAnswers and socket.invoke on checkbox change", () => {
    render(<OnlineMultipleCorrectAnswers quizResult={quizResult} />);

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);

    expect(mocks.onChangeMultipleCorrectAnswers).toHaveBeenCalledWith(
      mocks.setQuizResult,
      0,
      0,
      true
    );

    expect(mocks.socketInvoke).toHaveBeenCalledWith(
      "AnswerInteraction",
      "leave_message",
      22,
      "testUser"
    );
  });
});
