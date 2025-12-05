export type TaskType = "Freewatch" | "Player Tracking" | "Area Tracking";
export type TaskPriority = "P1" | "P2" | "P3";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  assignedTo: string; // Scout ID
  assignedToName: string; // Scout Name for easier display
  dueDate: string; // ISO string or 'YYYY-MM-DD'
  status: TaskStatus;
  createdAt: string; // ISO string
}