import axios from "axios";
import { Task, Subtask } from "../types/Task";

const BASE_URL = "http://localhost:5000/api/tasks";

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Fetch a single task by ID
export const fetchTask = async (id: string): Promise<Task> => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Create a new task
export const createTask = async (
  task: Omit<Task, "_id" | "createdAt" | "updatedAt">
): Promise<Task> => {
  const response = await axios.post(BASE_URL, {
    title: task.title,
    description: task.description || "",
    completed: task.completed || false,
    dueDate: task.dueDate || null,
    location: task.location || "",
    participants: task.participants || [],
    subtasks: task.subtasks || [],
  });
  return response.data;
};

// Update an existing task
export const updateTask = async (
  id: string,
  updates: Partial<Task>
): Promise<Task> => {
  const response = await axios.put(`${BASE_URL}/${id}`, updates);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

// Fetch subtasks for a specific task
export const fetchSubtasks = async (taskId: string): Promise<Subtask[]> => {
  const task = await fetchTask(taskId);
  return task.subtasks;
};

// Update a specific subtask
export const updateSubtask = async (
  taskId: string,
  subtaskId: string,
  updates: Partial<Subtask>
): Promise<Task> => {
  const response = await axios.put(
    `${BASE_URL}/${taskId}/subtasks/${subtaskId}`,
    updates
  );
  return response.data;
};

// Mark a task as completed
export const markTaskCompleted = async (taskId: string): Promise<Task> => {
  const response = await axios.patch(`${BASE_URL}/${taskId}/complete`);
  return response.data;
};

// Mark a subtask as completed
export const markSubtaskCompleted = async (
  taskId: string,
  subtaskId: string
): Promise<Task> => {
  const response = await axios.patch(
    `${BASE_URL}/${taskId}/subtasks/${subtaskId}/complete`
  );
  return response.data;
};
