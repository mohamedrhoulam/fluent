// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import TaskList from "./TaskList";
// import { fetchTasks, updateTask } from "../../services/taskService";
// import { Task } from "../../types/Task";
// import "@testing-library/jest-dom/extend-expect";
// import "@testing-library/jest-dom";

// jest.mock("../../services/taskService");

// jest.mock("../../services/taskService");

// const mockTasks: Task[] = [
//   {
//     _id: "1",
//     title: "Task 1",
//     description: "Description 1",
//     completed: false,
//     dueDate: new Date(),
//     location: "Location 1",
//     participants: ["Participant 1"],
//     subtasks: [],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     _id: "2",
//     title: "Task 2",
//     description: "Description 2",
//     completed: true,
//     dueDate: new Date(),
//     location: "Location 2",
//     participants: ["Participant 2"],
//     subtasks: [],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

// describe("TaskList", () => {
//   beforeEach(() => {
//     (fetchTasks as jest.Mock).mockResolvedValue(mockTasks);
//   });

//   it("fetches and displays tasks", async () => {
//     render(<TaskList />);

//     await waitFor(() => {
//       expect(screen.getByText("Task 1")).toBeInTheDocument();
//       expect(screen.getByText("Task 2")).toBeInTheDocument();
//     });
//   });

//   it("opens the sidebar when 'Add Task' button is clicked", async () => {
//     render(<TaskList />);

//     fireEvent.click(screen.getByText("Add Task"));

//     await waitFor(() => {
//       expect(screen.getByText("Add New Task")).toBeInTheDocument();
//     });
//   });

//   it("toggles task completion", async () => {
//     (updateTask as jest.Mock).mockImplementation((id, updates) => {
//       return {
//         ...mockTasks.find((task) => task._id === id),
//         ...updates,
//       };
//     });

//     render(<TaskList />);

//     await waitFor(() => {
//       expect(screen.getByText("Task 1")).toBeInTheDocument();
//     });

//     const task1Toggle = screen.getAllByText("Undue")[0];
//     fireEvent.click(task1Toggle);

//     await waitFor(() => {
//       expect(updateTask).toHaveBeenCalledWith("1", { completed: true });
//     });
//   });
// });
