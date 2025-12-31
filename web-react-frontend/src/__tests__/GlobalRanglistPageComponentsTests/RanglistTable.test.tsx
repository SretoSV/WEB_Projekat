import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RanglistTable } from "../../components/GlobalRanglistPageComponents/RanglistTable";

// MOCKS
vi.mock("../../images/placeHolder.png", () => ({
  default: "placeholder-image",
}));

const mockProfiles = [
  {
    id: 1,
    username: "john",
    profileImage: "",
  },
  {
    id: 2,
    username: "anna",
    profileImage: "BASE64IMAGE",
  },
];

const baseResult = {
  id: 1,
  userId: 1,
  quizId: 1,
  correctAnswers: 7,
  totalQuestions: 10,
  startedAt: new Date("2025-01-01T10:00:00"),
  submittedAt: new Date("2025-01-01T10:02:30"),
  isStarted: false,
};

describe("RanglistTable", () => {
  it("renders table headers", () => {
    render(
      <RanglistTable
        selectedQuizId={1}
        results={[]}
        profiles={[]}
      />
    );

    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Points")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
  });

  it("shows 'No results' when results array is empty", () => {
    render(
      <RanglistTable
        selectedQuizId={1}
        results={[]}
        profiles={mockProfiles}
      />
    );

    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("does not render results when selectedQuizId is 0", () => {
    render(
      <RanglistTable
        selectedQuizId={0}
        results={[baseResult]}
        profiles={mockProfiles}
      />
    );

    expect(screen.queryByText("john")).not.toBeInTheDocument();
  });

  it("renders result row with correct rank, username and points", () => {
    render(
      <RanglistTable
        selectedQuizId={1}
        results={[baseResult]}
        profiles={mockProfiles}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument(); // rank
    expect(screen.getByText("john")).toBeInTheDocument();
    expect(screen.getByText("7/10")).toBeInTheDocument();
  });

  it("formats duration correctly when under one minute", () => {
    const result = {
      ...baseResult,
      submittedAt: new Date("2025-01-01T10:00:30"),
    };

    render(
      <RanglistTable
        selectedQuizId={1}
        results={[result]}
        profiles={mockProfiles}
      />
    );

    expect(screen.getByText("30 sec")).toBeInTheDocument();
  });

  it("formats duration correctly when minutes and seconds exist", () => {
    render(
      <RanglistTable
        selectedQuizId={1}
        results={[baseResult]}
        profiles={mockProfiles}
      />
    );

    expect(screen.getByText("2 min 30 sec")).toBeInTheDocument();
  });

  it("shows 'Not submitted' when submittedAt is null", () => {
    const result = {
      ...baseResult,
      submittedAt: undefined,
    };

    render(
      <RanglistTable
        selectedQuizId={1}
        results={[result]}
        profiles={mockProfiles}
      />
    );

    expect(screen.getByText("Not submitted")).toBeInTheDocument();
  });

  it("uses placeholder image when user has no profile image", () => {
    render(
      <RanglistTable
        selectedQuizId={1}
        results={[baseResult]}
        profiles={mockProfiles}
      />
    );

    const img = screen.getByAltText("profile") as HTMLImageElement;
    expect(img.src).toContain("placeholder-image");
  });

  it("uses base64 image when profile image exists", () => {
    const result = {
      ...baseResult,
      id: 2,
      userId: 2,
    };

    render(
      <RanglistTable
        selectedQuizId={1}
        results={[result]}
        profiles={mockProfiles}
      />
    );

    const img = screen.getByAltText("profile") as HTMLImageElement;
    expect(img.src).toContain("data:image/png;base64,BASE64IMAGE");
  });
});
