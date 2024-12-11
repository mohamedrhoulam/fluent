export interface Subtask {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date; 
  location?: string;
  participants: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date; 
  location?: string;
  participants: string[];
  subtasks: Subtask[];
  createdAt?: Date;
  updatedAt?: Date;
}
