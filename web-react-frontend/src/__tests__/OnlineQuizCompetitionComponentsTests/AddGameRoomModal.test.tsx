import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { AddGameRoomModal } from "../../components/OnlineQuizCompetitionComponents/AddGameRoomModal";

// MOCKS
const mocks = vi.hoisted(() => ({
  handleAddGameRoom: vi.fn(),
}));

vi.mock("../../context/QuizContext", () => ({
  useQuizContext: () => ({
    quizzes: [
      { id: 1, title: "Quiz 1" },
      { id: 2, title: "Quiz 2" },
    ],
  }),
}));

vi.mock("../../context/OnlineQuizContext", () => ({
  useOnlineQuizContext: () => ({
    handleAddGameRoom: mocks.handleAddGameRoom,
  }),
}));

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe("AddGameRoomModal", () => {

  it("renders dropdown and button", () => {
    render(<AddGameRoomModal />);

    expect(screen.getByText("Add GameRoom:")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Quiz:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
  });

  it("renders quiz options from context", () => {
    render(<AddGameRoomModal />);

    const select = screen.getByLabelText("Select Quiz:") as HTMLSelectElement;
    expect(select.options.length).toBe(3); // "Select quiz" + 2 quizzes
    expect(select.options[1].text).toBe("Quiz 1");
    expect(select.options[2].text).toBe("Quiz 2");
  });

  it("updates gameRoom state when selecting a quiz", () => {
    render(<AddGameRoomModal />);

    const select = screen.getByLabelText("Select Quiz:") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "2" } });

    expect(select.value).toBe("2");
  });

  it("calls handleAddGameRoom with selected gameRoom on button click", () => {
    render(<AddGameRoomModal />);

    const select = screen.getByLabelText("Select Quiz:") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "1" } });

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    expect(mocks.handleAddGameRoom).toHaveBeenCalledWith(
      expect.objectContaining({ quizID: 1, id: 0, numberOfUsers: 0 })
    );
  });
});
