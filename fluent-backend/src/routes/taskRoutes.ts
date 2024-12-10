import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  getTask,
  updateTask,
  getSubtask,
  updateSubtask,
  deleteSubtask,
  markTaskCompleted,
  markSubtaskCompleted,
} from "../controllers/taskController.ts";

const router = Router();


router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/subtask/:subtaskId", getSubtask);
router.put("/subtask/:subtaskId", updateSubtask);
router.delete("/subtask/:subtaskId", deleteSubtask);
router.put("/:id/complete", markTaskCompleted);
router.put("/subtask/:subtaskId/complete", markSubtaskCompleted);

export default router;
