import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { GameRoomCard } from "../../components/OnlineQuizCompetitionComponents/GameRoomCard";

// MOCKS
const mocks = vi.hoisted(() => ({
  onJoin: vi.fn(),
  onLeave: vi.fn(),
  onStart: vi.fn(),
  onDelete: vi.fn(),
}));

vi.mock("../../components/OnlineQuizCompetition/OnlineQuizCard", () => ({
  OnlineQuizCard: ({ quiz }: any) => <div>OnlineQuizCard: {quiz?.title}</div>,
}));

vi.mock("../../components/OnlineQuizCompetition/LiveRangListCard", () => ({
  LiveRangListCard: () => <div>LiveRangListCard</div>,
}));

const userContextMock = vi.fn();
vi.mock("../../context/UserContext", () => ({
  useUserContext: () => userContextMock(),
}));

const onlineQuizContextMock = vi.fn();
vi.mock("../../context/OnlineQuizContext", () => ({
  useOnlineQuizContext: () => onlineQuizContextMock(),
}));

vi.mock("../../context/QuizContext", () => ({
  useQuizContext: () => ({
    quizzes: [{ id: 1, title: "Test Quiz" }],
  }),
}));

// SETUP
beforeEach(() => {
  vi.clearAllMocks();

  userContextMock.mockReturnValue({ user: { username: "admin", isAdmin: true } });
  onlineQuizContextMock.mockReturnValue({
    setQuizResult: vi.fn(),
    currentUserAnswerIndex: 0,
  });
});

// TESTS
describe("GameRoomCard", () => {

  const baseProps = {
    id: 1,
    quizId: 1,
    numberOfUsers: 1,
    isStarted: false,
    roomParticipants: [
      { id: 1, gameRoomId: 1, userId: 1, userProfile: { id: 1, username: "admin", profileImage: "" } },
      { id: 2, gameRoomId: 1, userId: 2, userProfile: { id: 2, username: "user1", profileImage: "" } },
    ],
    isJoined: false,
    joinedThatRoom: false,
    onJoin: mocks.onJoin,
    onLeave: mocks.onLeave,
    onStart: mocks.onStart,
    onDelete: mocks.onDelete,
  };

  it("renders room info and participants", () => {
    render(<GameRoomCard {...baseProps} />);

    expect(screen.getByText(/Id: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Quiz: Test Quiz/)).toBeInTheDocument();
    expect(screen.getByText(/Room Participants:/)).toBeInTheDocument();

    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();
  });

  it("calls onLeave when Leave button clicked", () => {
    render(<GameRoomCard {...baseProps} />);

    const leaveButton = screen.getByRole("button", { name: /Leave/i });
    fireEvent.click(leaveButton);

    expect(mocks.onLeave).toHaveBeenCalledWith(1);
  });

  it("calls onStart when Start button clicked (admin, not started)", () => {
    render(<GameRoomCard {...baseProps} />);

    const startButton = screen.getByRole("button", { name: /Start/i });
    fireEvent.click(startButton);

    expect(mocks.onStart).toHaveBeenCalledWith(1);
  });

  it("calls onDelete when Delete button clicked (admin, no participants)", () => {
    render(<GameRoomCard {...baseProps} roomParticipants={[]} />);

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(mocks.onDelete).toHaveBeenCalledWith(1);
  });

  it("renders Join button when user not joined and room not started", () => {
    userContextMock.mockReturnValue({ user: { username: "user2", isAdmin: false } });

    render(
      <GameRoomCard
        {...baseProps}
        isStarted={false}
        joinedThatRoom={false}
        isJoined={false}
      />
    );

    const joinButton = screen.getByRole("button", { name: /Join/i });
    fireEvent.click(joinButton);
    expect(mocks.onJoin).toHaveBeenCalledWith(1);
  });
});
