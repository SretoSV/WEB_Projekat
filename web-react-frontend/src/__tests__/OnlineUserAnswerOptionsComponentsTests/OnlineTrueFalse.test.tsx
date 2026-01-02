import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OnlineTrueFalse } from "../../components/OnlineUserAnswerOptionsComponents/OnlineTrueFalse";
import type { UserQuizResult } from "../../models/UserQuizResultModel";

// MOCKS
const mocks = vi.hoisted(() => ({
  onChangTrueFalse: vi.fn(),
  socketInvoke: vi.fn(),
  setQuizResult: vi.fn(),
}));

vi.mock("../../services/QuizService", () => ({
  onChangTrueFalse: mocks.onChangTrueFalse,
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
const quizResultTrue: UserQuizResult = {
  id: 1,
  gameRoomId: 99,
  answers: [
    {
      userAnswerOptions: [
        {
          id: 1,
          text: "True/False",
          isCorrect: true,
        },
      ],
    },
  ],
} as any;

const quizResultFalse: UserQuizResult = {
  id: 2,
  gameRoomId: 99,
  answers: [
    {
      userAnswerOptions: [
        {
          id: 1,
          text: "True/False",
          isCorrect: false,
        },
      ],
    },
  ],
} as any;

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});


// TESTS
describe("OnlineTrueFalse", () => {

  it("renders True and False radio buttons", () => {
    render(<OnlineTrueFalse quizResult={quizResultTrue} />);

    expect(screen.getByLabelText("True")).toBeInTheDocument();
    expect(screen.getByLabelText("False")).toBeInTheDocument();
  });

  it("checks True radio when answer is true", () => {
    render(<OnlineTrueFalse quizResult={quizResultTrue} />);

    const trueRadio = screen.getByLabelText("True") as HTMLInputElement;
    const falseRadio = screen.getByLabelText("False") as HTMLInputElement;

    expect(trueRadio.checked).toBe(true);
    expect(falseRadio.checked).toBe(false);
  });

  it("checks False radio when answer is false", () => {
    render(<OnlineTrueFalse quizResult={quizResultFalse} />);

    const trueRadio = screen.getByLabelText("True") as HTMLInputElement;
    const falseRadio = screen.getByLabelText("False") as HTMLInputElement;

    expect(trueRadio.checked).toBe(false);
    expect(falseRadio.checked).toBe(true);
  });

  it("calls service and socket when True is selected", () => {
    render(<OnlineTrueFalse quizResult={quizResultFalse} />);

    fireEvent.click(screen.getByLabelText("True"));

    expect(mocks.onChangTrueFalse).toHaveBeenCalledWith(
      mocks.setQuizResult,
      0,
      true
    );

    expect(mocks.socketInvoke).toHaveBeenCalledWith(
      "AnswerInteraction",
      "answer_interaction",
      99,
      "testUser"
    );
  });

  it("calls service and socket when False is selected", () => {
    render(<OnlineTrueFalse quizResult={quizResultTrue} />);

    fireEvent.click(screen.getByLabelText("False"));

    expect(mocks.onChangTrueFalse).toHaveBeenCalledWith(
      mocks.setQuizResult,
      0,
      false
    );

    expect(mocks.socketInvoke).toHaveBeenCalledWith(
      "AnswerInteraction",
      "answer_interaction",
      99,
      "testUser"
    );
  });
});
