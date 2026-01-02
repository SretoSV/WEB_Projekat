import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OnlineFinishedQuizResult } from "../../components/OnlineUserAnswerOptionsComponents/OnlineFinishedQuizResult";

// MOCKS
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../components/CompareQuestionsAndAnswer", () => ({
  CompareQuestionAndAnswer: ({ selectedQuizId }: any) => (
    <div data-testid="compare-component">
      Compare component {selectedQuizId}
    </div>
  ),
}));

const mockSetFinishedQuizResult = vi.fn();
const mockSetGameRooms = vi.fn();

const finishedQuizResultMock = {
  gameRoomId: 10,
  scorePercentage: 85,
};

vi.mock("../../context/OnlineQuizContext", () => ({
  useOnlineQuizContext: () => ({
    finishedQuizResult: finishedQuizResultMock,
    setFinishedQuizResult: mockSetFinishedQuizResult,
    setGameRooms: mockSetGameRooms,
  }),
}));

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe("OnlineFinishedQuizResult", () => {

  it("renders score and percentage", () => {
    render(<OnlineFinishedQuizResult selectedQuizId={3} />);

    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("renders CompareQuestionAndAnswer when finishedQuizResult exists", () => {
    render(<OnlineFinishedQuizResult selectedQuizId={7} />);

    expect(
      screen.getByTestId("compare-component")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Compare component 7")
    ).toBeInTheDocument();
  });

  it("handles navigation and resets state on button click", () => {
    render(<OnlineFinishedQuizResult selectedQuizId={1} />);

    const button = screen.getByText("Go back to rooms");
    fireEvent.click(button);

    expect(mockSetFinishedQuizResult).toHaveBeenCalledWith(null);

    expect(mockSetGameRooms).toHaveBeenCalled();
    const updaterFn = mockSetGameRooms.mock.calls[0][0];

    const prevRooms = [
      {
        id: 10,
        roomParticipants: ["user1"],
        isStarted: true,
      },
      {
        id: 99,
        roomParticipants: ["user2"],
        isStarted: true,
      },
    ];

    const updatedRooms = updaterFn(prevRooms);

    expect(updatedRooms).toEqual([
      {
        id: 10,
        roomParticipants: [],
        isStarted: false,
      },
      {
        id: 99,
        roomParticipants: ["user2"],
        isStarted: true,
      },
    ]);

    expect(mockNavigate).toHaveBeenCalledWith("../OnlineQuizCompetition");
  });
});
