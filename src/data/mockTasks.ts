import { Task } from "@/types/task";

export const initialMockTasks: Task[] = [
  {
    id: "task1",
    title: "Scout new talents in Brazilian Serie A",
    description: "Identify 5 promising young players (U21) in the Brazilian Serie A for potential future transfers. Focus on attacking midfielders and wingers.",
    type: "Freewatch",
    priority: "P1",
    assignedTo: "2", // Mia Scout
    assignedToName: "Mia Scout",
    dueDate: "2024-11-30",
    status: "In Progress",
    createdAt: "2024-08-01T10:00:00Z",
  },
  {
    id: "task2",
    title: "Track progress of Evan Ferguson",
    description: "Provide a detailed report on Evan Ferguson's performance, fitness, and development over the next three months. Include match analysis and training observations.",
    type: "Player Tracking",
    priority: "P2",
    assignedTo: "1", // James Clark
    assignedToName: "James Clark",
    dueDate: "2024-12-31",
    status: "Pending",
    createdAt: "2024-08-05T14:30:00Z",
  },
  {
    id: "task3",
    title: "Identify potential left-back targets in Bundesliga",
    description: "Scout for 3-4 potential left-back targets in the German Bundesliga. Key attributes: pace, crossing, defensive awareness. Age 22-26.",
    type: "Area Tracking",
    priority: "P1",
    assignedTo: "2", // Mia Scout
    assignedToName: "Mia Scout",
    dueDate: "2024-10-15",
    status: "Pending",
    createdAt: "2024-08-10T09:00:00Z",
  },
  {
    id: "task4",
    title: "Review youth academy prospects",
    description: "Conduct a comprehensive review of all U18 players in our youth academy. Assess their potential, current ability, and readiness for the first team or loan moves.",
    type: "Freewatch",
    priority: "P3",
    assignedTo: "3", // David Lee
    assignedToName: "David Lee",
    dueDate: "2024-09-30",
    status: "Completed",
    createdAt: "2024-07-01T11:00:00Z",
  },
];