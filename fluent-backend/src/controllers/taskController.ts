import { Request, Response } from "express";
import Task from "../models/Task.ts";

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Task"
 *               description:
 *                 type: string
 *                 example: "Task description"
 *               completed:
 *                 type: boolean
 *                 example: false
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59.000Z"
 *               location:
 *                 type: string
 *                 example: "Office"
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["John Doe", "Jane Doe"]
 *               subtasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Subtask title"
 *                     description:
 *                       type: string
 *                       example: "Subtask description"
 *                     completed:
 *                       type: boolean
 *                       example: false
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-31T23:59:59.000Z"
 *                     location:
 *                       type: string
 *                       example: "Office"
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["John Doe", "Jane Doe"]
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
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

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/{taskId}/subtasks:
 *   get:
 *     summary: Get all subtasks for a task
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: List of subtasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subtask'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/subtask/{subtaskId}:
 *   get:
 *     summary: Get a subtask by ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         description: The subtask ID
 *     responses:
 *       200:
 *         description: Subtask found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subtask'
 *       404:
 *         description: Subtask not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/subtask/{subtaskId}:
 *   put:
 *     summary: Update a subtask by ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         description: The subtask ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subtask'
 *     responses:
 *       200:
 *         description: Subtask updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subtask'
 *       404:
 *         description: Subtask not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/subtask/{subtaskId}:
 *   delete:
 *     summary: Delete a subtask by ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         description: The subtask ID
 *     responses:
 *       200:
 *         description: Subtask deleted successfully
 *       404:
 *         description: Subtask not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   put:
 *     summary: Mark a task as completed
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /api/tasks/subtask/{subtaskId}/complete:
 *   put:
 *     summary: Mark a subtask as completed
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         description: The subtask ID
 *     responses:
 *       200:
 *         description: Subtask marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subtask'
 *       404:
 *         description: Subtask not found
 *       400:
 *         description: Bad request
 */
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
