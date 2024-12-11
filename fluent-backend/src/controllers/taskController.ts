import { Request, Response } from "express";
import Task from "../models/Task.ts";
import "./taskController.swagger.ts"


export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description = "",
      completed = false,
      dueDate = null,
      location = "",
      participants = [],
      subtasks = [],
    } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = new Task({
      title,
      description,
      completed,
      dueDate,
      location,
      participants,
      subtasks,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    const tasksWithSubtasks = await Promise.all(
      tasks.map(async (task) => {
        if (task.subtasks && task.subtasks.length > 0) {
          const subtasks = await getSubtasks(task._id.toString());
          return { ...task.toObject(), subtasks };
        }
        return task.toObject();
      })
    );
    res.status(200).json(tasksWithSubtasks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};


export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};


export const getSubtasks = async (taskId: string) => {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    return task.subtasks;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};


export const getSubtask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOne({ "subtasks._id": req.params.subtaskId });
    if (!task) {
      res.status(404).json({ error: "Subtask not found" });
      return;
    }
    const subtask = task.subtasks.id(req.params.subtaskId);
    res.status(200).json(subtask);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};


export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const allSubtasksCompleted = task.subtasks.every(
      (subtask) => subtask.completed
    );
    if (allSubtasksCompleted) {
      task.completed = true;
      await task.save();
    }

    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};


export const updateSubtask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      { "subtasks._id": req.params.subtaskId },
      { $set: { "subtasks.$": req.body } },
      { new: true, runValidators: true }
    );
    if (!task) {
      res.status(404).json({ error: "Subtask not found" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};


export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};


export const deleteSubtask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      { "subtasks._id": req.params.subtaskId },
      { $pull: { subtasks: { _id: req.params.subtaskId } } },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ error: "Subtask not found" });
      return;
    }
    res.status(200).json({ message: "Subtask deleted" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};


export const markTaskCompleted = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};


export const markSubtaskCompleted = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      { "subtasks._id": req.params.subtaskId },
      { $set: { "subtasks.$.completed": true } },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ error: "Subtask not found" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};
