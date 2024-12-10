import { Schema, model } from "mongoose";

const subtaskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    location: { type: String },
    participants: [{ type: String }],
  },
  { timestamps: true }
);

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    location: { type: String },
    participants: [{ type: String }],
    subtasks: [subtaskSchema],
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);

export default Task;
