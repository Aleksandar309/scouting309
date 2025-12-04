export interface Scout {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  activePlayers: number;
  lastReportDate: string;
  avatarUrl?: string;
}

export type AssignmentPriority = "P1" | "P2" | "P3";
export type AssignmentStatus = "Pending" | "In Progress" | "Completed" | "Overdue";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  priority: AssignmentPriority;
  assignedTo: string; // Scout ID
  assignedToName: string; // Scout Name for easier display
  dueDate: string; // ISO string or 'YYYY-MM-DD'
  status: AssignmentStatus;
  createdAt: string; // ISO string
}