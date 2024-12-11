import {
  fetchTasks,
  createTask,
  updateTask,
  updateSubtask,
  fetchTask,
} from "./taskService";
import axios from "axios";
jest.mock("axios");
import { Task, Subtask } from "../types/Task";

describe("Task Service", () => {
  it("fetches tasks successfully", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });
    const tasks = await fetchTasks();
    expect(tasks).toEqual([]);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/tasks");
  });

  it("creates a task successfully", async () => {
    const mockTask: Omit<Task, "_id" | "createdAt" | "updatedAt"> = {
      title: "Sample Task",
      description: "This is a sample task description",
      completed: false,
      dueDate: new Date(),
      location: "Sample Location",
      participants: ["John Doe", "Jane Doe"],
      subtasks: [
        {
          _id: "subtask-id",
          title: "Sample Subtask",
          description: "Subtask description",
          completed: false,
          dueDate: new Date(),
          location: "Subtask Location",
          participants: ["Subtask Participant"],
        },
      ],
    };

    const createdTask: Task = {
      ...mockTask,
      _id: "task-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: createdTask });
    const newTask = await createTask(mockTask);
    expect(newTask).toEqual(createdTask);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/tasks",
      mockTask
    );
  });

  it("updates a subtask successfully", async () => {
    const mockTaskId = "task-id";
    const mockSubtaskId = "subtask-id";
    const mockUpdates: Partial<Subtask> = {
      title: "Updated Subtask Title",
      completed: true,
    };
    const mockUpdatedTask: Task = {
      _id: mockTaskId,
      title: "Sample Task",
      description: "This is a sample task description",
      completed: false,
      dueDate: new Date(),
      location: "Sample Location",
      participants: ["John Doe", "Jane Doe"],
      subtasks: [
        {
          _id: mockSubtaskId,
          title: "Updated Subtask Title",
          description: "Subtask description",
          completed: true,
          dueDate: new Date(),
          location: "Subtask Location",
          participants: ["Subtask Participant"],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (axios.put as jest.Mock).mockResolvedValue({ data: mockUpdatedTask });
    const updatedTask = await updateSubtask(
      mockTaskId,
      mockSubtaskId,
      mockUpdates
    );
    expect(updatedTask).toEqual(mockUpdatedTask);
    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:5000/api/tasks/${mockTaskId}/subtasks/${mockSubtaskId}`,
      mockUpdates
    );
  });

  it("creates a task with only the title", async () => {
    const mockTask: Omit<Task, "_id" | "createdAt" | "updatedAt"> = {
      title: "Title Only Task",
      description: "",
      completed: false,
      dueDate: undefined,
      location: "",
      participants: [],
      subtasks: [],
    };

    const createdTask: Task = {
      ...mockTask,
      description: "",
      completed: false,
      dueDate: undefined,
      location: "",
      participants: [],
      subtasks: [],
      _id: "task-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: createdTask });
    const newTask = await createTask(mockTask);
    expect(newTask).toEqual(createdTask);
    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/tasks", {
      title: "Title Only Task",
      description: "",
      completed: false,
      dueDate: null,
      location: "",
      participants: [],
      subtasks: [],
    });
  });

  it("creates a task with all attributes filled", async () => {
    const mockTask: Omit<Task, "_id" | "createdAt" | "updatedAt"> = {
      title: "Full Task",
      description: "This is a fully detailed task",
      completed: false,
      dueDate: new Date(),
      location: "Office",
      participants: ["John Doe", "Jane Doe"],
      subtasks: [
        {
          _id: "subtask-id",
          title: "Sample Subtask",
          description: "Subtask description",
          completed: false,
          dueDate: new Date(),
          location: "Subtask Location",
          participants: ["Subtask Participant"],
        },
      ],
    };

    const createdTask: Task = {
      ...mockTask,
      _id: "task-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: createdTask });
    const newTask = await createTask(mockTask);
    expect(newTask).toEqual(createdTask);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/tasks",
      mockTask
    );
  });

  it("creates a task with only the title and then updates it with subtasks", async () => {
    const mockTask: Omit<Task, "_id" | "createdAt" | "updatedAt"> = {
      title: "Title Only Task",
      description: "",
      completed: false,
      dueDate: undefined,
      location: "",
      participants: [],
      subtasks: [],
    };

    const createdTask: Task = {
      ...mockTask,
      description: "",
      completed: false,
      dueDate: undefined,
      location: "",
      participants: [],
      subtasks: [],
      _id: "task-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTask: Task = {
      ...createdTask,
      subtasks: [
        {
          _id: "subtask-id",
          title: "New Subtask",
          description: "Subtask description",
          completed: false,
          dueDate: new Date(),
          location: "Subtask Location",
          participants: ["Subtask Participant"],
        },
      ],
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: createdTask });
    const newTask = await createTask(mockTask);
    expect(newTask).toEqual(createdTask);
    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/tasks", {
      title: "Title Only Task",
      description: "",
      completed: false,
      dueDate: null,
      location: "",
      participants: [],
      subtasks: [],
    });

    (axios.put as jest.Mock).mockResolvedValue({ data: updatedTask });
    const updated = await updateTask(createdTask._id, {
      subtasks: updatedTask.subtasks,
    });
    expect(updated).toEqual(updatedTask);
    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:5000/api/tasks/${createdTask._id}`,
      { subtasks: updatedTask.subtasks }
    );
  });

  it("creates a task with a random name, then modifies it by adding a new subtask but keeps the task in the database", async () => {
    const randomName = `Task-${Math.random().toString(36).substring(7)}`;
    const mockTask: Omit<Task, "_id" | "createdAt" | "updatedAt"> = {
      title: randomName,
      description: "",
      completed: false,
      dueDate: undefined,
      location: "",
      participants: [],
      subtasks: [],
    };

    const createdTask: Task = {
      ...mockTask,
      description: "",
      completed: false,
      dueDate: undefined,
      location: "",
      participants: [],
      subtasks: [],
      _id: "task-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTask: Task = {
      ...createdTask,
      subtasks: [
        {
          _id: "subtask-id",
          title: "New Subtask",
          description: "Subtask description",
          completed: false,
          dueDate: new Date(),
          location: "Subtask Location",
          participants: ["Subtask Participant"],
        },
      ],
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: createdTask });
    const newTask = await createTask(mockTask);
    expect(newTask).toEqual(createdTask);
    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/tasks", {
      title: randomName,
      description: "",
      completed: false,
      dueDate: null,
      location: "",
      participants: [],
      subtasks: [],
    });

    (axios.put as jest.Mock).mockResolvedValue({ data: updatedTask });
    const updated = await updateTask(createdTask._id, {
      subtasks: updatedTask.subtasks,
    });
    expect(updated).toEqual(updatedTask);
    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:5000/api/tasks/${createdTask._id}`,
      { subtasks: updatedTask.subtasks }
    );

    (axios.get as jest.Mock).mockResolvedValue({ data: updatedTask });
    const fetchedTask = await fetchTask(createdTask._id);
    expect(fetchedTask).toEqual(updatedTask);
    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:5000/api/tasks/${createdTask._id}`
    );
  });
});
