import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GlobalSelectionArea } from "../../components/GlobalRanglistPageComponents/GlobalSelectionArea";

// MOCKS
const mockUseQuizContext = vi.fn();

vi.mock("../../context/QuizContext", () => ({
  useQuizContext: () => mockUseQuizContext(),
}));

const mockQuizzes = [
  { id: 1, title: "Math Quiz" },
  { id: 2, title: "Science Quiz" },
];

const onChangeQuiz = vi.fn();
const onChangeTimePeriod = vi.fn();

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe("GlobalSelectionArea", () => {

  it("renders loading state when quizzes are loading", () => {
    mockUseQuizContext.mockReturnValue({
      quizzes: [],
      loadingQuizzes: true,
    });

    render(
      <GlobalSelectionArea
        selectedQuizId={0}
        selectedTimePeriod=""
        onChangeQuiz={onChangeQuiz}
        onChangeTimePeriod={onChangeTimePeriod}
      />
    );

    expect(screen.getByText("Loading quizzes...")).toBeInTheDocument();
  });

  it("renders quiz and time period dropdowns when not loading", () => {
    mockUseQuizContext.mockReturnValue({
      quizzes: mockQuizzes,
      loadingQuizzes: false,
    });

    render(
      <GlobalSelectionArea
        selectedQuizId={1}
        selectedTimePeriod=""
        onChangeQuiz={onChangeQuiz}
        onChangeTimePeriod={onChangeTimePeriod}
      />
    );

    expect(screen.getByDisplayValue("Math Quiz")).toBeInTheDocument();
    expect(screen.getByText("Time period")).toBeInTheDocument();
  });

  it("renders all quiz options from context", () => {
    mockUseQuizContext.mockReturnValue({
      quizzes: mockQuizzes,
      loadingQuizzes: false,
    });

    render(
      <GlobalSelectionArea
        selectedQuizId={0}
        selectedTimePeriod=""
        onChangeQuiz={onChangeQuiz}
        onChangeTimePeriod={onChangeTimePeriod}
      />
    );

    expect(screen.getByText("Math Quiz")).toBeInTheDocument();
    expect(screen.getByText("Science Quiz")).toBeInTheDocument();
  });

  it("calls onChangeQuiz when quiz is changed", () => {
    mockUseQuizContext.mockReturnValue({
      quizzes: mockQuizzes,
      loadingQuizzes: false,
    });

    render(
      <GlobalSelectionArea
        selectedQuizId={0}
        selectedTimePeriod=""
        onChangeQuiz={onChangeQuiz}
        onChangeTimePeriod={onChangeTimePeriod}
      />
    );

    fireEvent.change(screen.getByTestId("select-quiz"), {
      target: { value: "2" },
    });

    expect(onChangeQuiz).toHaveBeenCalledWith("2");
  });

  it("calls onChangeTimePeriod when time period is changed", () => {
    mockUseQuizContext.mockReturnValue({
      quizzes: mockQuizzes,
      loadingQuizzes: false,
    });

    render(
      <GlobalSelectionArea
        selectedQuizId={0}
        selectedTimePeriod=""
        onChangeQuiz={onChangeQuiz}
        onChangeTimePeriod={onChangeTimePeriod}
      />
    );

    fireEvent.change(screen.getByDisplayValue("Time period"), {
      target: { value: "Weekly" },
    });

    expect(onChangeTimePeriod).toHaveBeenCalledWith("Weekly");
  });

  it("shows selected time period value", () => {
    mockUseQuizContext.mockReturnValue({
      quizzes: mockQuizzes,
      loadingQuizzes: false,
    });

    render(
      <GlobalSelectionArea
        selectedQuizId={0}
        selectedTimePeriod="Monthly"
        onChangeQuiz={onChangeQuiz}
        onChangeTimePeriod={onChangeTimePeriod}
      />
    );

    expect(screen.getByDisplayValue("Monthly")).toBeInTheDocument();
  });
});
