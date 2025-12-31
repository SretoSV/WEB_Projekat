import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SelectionArea } from "../../components/UserResultsPageComponents/SelectionArea";


// MOCKS
const mockUseUserContext = vi.fn();

vi.mock("../../context/UserContext", () => ({
  useUserContext: () => mockUseUserContext(),
}));

const mockQuizzes = [
  { id: 1, title: "Quiz 1" },
  { id: 2, title: "Quiz 2" },
] as any;

const baseProps = {
  selectedUserUsername: "",
  onChangeUserUsername: vi.fn(),
  usersUsernames: ["user1", "user2"],
  selectedQuizId: 0,
  onChangeQuiz: vi.fn(),
  quizzes: mockQuizzes,
  selectedQuiz: null,
  setToggleChart: vi.fn(),
};

// TESTS
describe("SelectionArea", () => {
  it("renders quiz select dropdown", () => {
    mockUseUserContext.mockReturnValue({
      user: { isAdmin: false },
    });

    render(<SelectionArea {...baseProps} />);

    expect(screen.getByText("Select quiz")).toBeInTheDocument();
    expect(screen.getByText("Quiz 1")).toBeInTheDocument();
    expect(screen.getByText("Quiz 2")).toBeInTheDocument();
  });

  it("does not render user select if user is not admin", () => {
    mockUseUserContext.mockReturnValue({
      user: { isAdmin: false },
    });

    render(<SelectionArea {...baseProps} />);

    expect(screen.queryByText("Select user")).not.toBeInTheDocument();
  });

  it("renders user select if user is admin", () => {
    mockUseUserContext.mockReturnValue({
      user: { isAdmin: true },
    });

    render(<SelectionArea {...baseProps} />);

    expect(screen.getByText("Select user")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();
  });

  it("calls onChangeUserUsername when user is selected", () => {
    mockUseUserContext.mockReturnValue({
      user: { isAdmin: true },
    });

    render(<SelectionArea {...baseProps} />);

    fireEvent.change(screen.getByTestId("select-user"), {
      target: { value: "user1" },
    });

    expect(baseProps.onChangeUserUsername).toHaveBeenCalledWith("user1");
  });

  it("calls onChangeQuiz when quiz is selected", () => {
    mockUseUserContext.mockReturnValue({
      user: { isAdmin: false },
    });

    render(<SelectionArea {...baseProps} />);

    fireEvent.change(screen.getByTestId("select-quiz"), {
      target: { value: "2" },
    });

    expect(baseProps.onChangeQuiz).toHaveBeenCalledWith("2");
  });

  it("renders toggle chart button when selectedQuiz exists", () => {
    mockUseUserContext.mockReturnValue({
      user: { isAdmin: false },
    });

    render(
      <SelectionArea
        {...baseProps}
        selectedQuiz={mockQuizzes[0]}
      />
    );

    expect(screen.getByText("Toggle chart")).toBeInTheDocument();
  });

  it("toggles chart state when toggle button is clicked", () => {
    mockUseUserContext.mockReturnValue({
      user: { isAdmin: false },
    });

    const setToggleChart = vi.fn();

    render(
      <SelectionArea
        {...baseProps}
        selectedQuiz={mockQuizzes[0]}
        setToggleChart={setToggleChart}
      />
    );

    fireEvent.click(screen.getByText("Toggle chart"));

    expect(setToggleChart).toHaveBeenCalled();
    expect(typeof setToggleChart.mock.calls[0][0]).toBe("function");
  });
});
