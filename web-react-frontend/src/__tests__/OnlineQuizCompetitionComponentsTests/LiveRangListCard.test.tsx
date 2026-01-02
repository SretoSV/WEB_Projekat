import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { LiveRangListCard } from "../../components/OnlineQuizCompetitionComponents/LiveRangListCard";

// MOCKS
const mocks = vi.hoisted(() => ({
  handleLogout: vi.fn(),
  useLiveRangListMock: vi.fn(),
}));

vi.mock("../../context/UserContext", () => ({
  useUserContext: () => ({
    handleLogout: mocks.handleLogout,
  }),
}));

vi.mock("../../context/OnlineQuizContext", () => ({
  useOnlineQuizContext: () => ({
    liveRangList: {
      id: 1,
      liveRangListParticipants: [
        { id: 1, userId: 1, points: 10 },
        { id: 2, userId: 2, points: 5 },
      ],
    },
  }),
}));

vi.mock("../../customHooks/useLiveRangList", () => ({
  useLiveRangList: () => mocks.useLiveRangListMock(),
}));

// SETUP
beforeEach(() => {
  vi.clearAllMocks();

  mocks.useLiveRangListMock.mockReturnValue({
    data: {
      profiles: [
        { id: 1, username: "User1", profileImage: "" },
        { id: 2, username: "User2", profileImage: "" },
      ],
    },
    isLoading: false,
  });
});

// TESTS
describe("LiveRangListCard", () => {

  it("renders table headers correctly", () => {
    render(<LiveRangListCard />);

    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Points")).toBeInTheDocument();
  });

  it("renders participants from liveRangList and profiles", () => {
    render(<LiveRangListCard />);

    expect(screen.getByText("User1")).toBeInTheDocument();
    expect(screen.getByText("User2")).toBeInTheDocument();

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders loading state when isLoading is true", () => {
    mocks.useLiveRangListMock.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<LiveRangListCard />);

    // headers are still present
    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Points")).toBeInTheDocument();

    expect(screen.queryByText("User1")).not.toBeInTheDocument();
  });
});
