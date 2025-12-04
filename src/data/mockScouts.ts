import { Scout, Assignment } from '@/types/scout';

export const mockScouts: Scout[] = [
  {
    id: "1",
    name: "James Clark",
    role: "Head Scout",
    email: "james.clark@brighton.com",
    phone: "+44 7123 456789",
    activePlayers: 5,
    lastReportDate: "2024-07-20",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JC",
  },
  {
    id: "2",
    name: "Mia Scout",
    role: "European Scout",
    email: "mia.scout@brighton.com",
    phone: "+44 7987 654321",
    activePlayers: 8,
    lastReportDate: "2024-07-22",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MS",
  },
  {
    id: "3",
    name: "David Lee",
    role: "Youth Scout",
    email: "david.lee@brighton.com",
    phone: "+44 7555 123456",
    activePlayers: 3,
    lastReportDate: "2024-07-18",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DL",
  },
];

export const initialMockAssignments: Assignment[] = [
  {
    id: "assign1",
    title: "Scout Central Midfielder in Eredivisie",
    description: "Identify 3 potential central midfielders (CDM/CM) in the Eredivisie with strong passing and defensive attributes. Focus on players aged 20-24.",
    priority: "P1",
    assignedTo: "2", // Mia Scout
    assignedToName: "Mia Scout",
    dueDate: "2024-09-30",
    status: "In Progress",
    createdAt: "2024-07-20T10:00:00Z",
  },
  {
    id: "assign2",
    title: "Monitor Youth Talent in Championship",
    description: "Track progress of 5 identified youth talents in the Championship. Provide detailed reports on their development and potential.",
    priority: "P2",
    assignedTo: "3", // David Lee
    assignedToName: "David Lee",
    dueDate: "2024-10-15",
    status: "Pending",
    createdAt: "2024-07-25T14:30:00Z",
  },
  {
    id: "assign3",
    title: "Analyze Premier League Left-Backs",
    description: "Provide a comprehensive analysis of top 5 left-backs in the Premier League, focusing on their offensive contributions and defensive solidity.",
    priority: "P3",
    assignedTo: "1", // James Clark
    assignedToName: "James Clark",
    dueDate: "2024-08-31",
    status: "Completed",
    createdAt: "2024-07-01T09:00:00Z",
  },
  {
    id: "assign4",
    title: "Identify Backup Striker in Ligue 1",
    description: "Find a reliable backup striker in Ligue 1, aged 25-29, with good aerial ability and finishing. Budget up to €15M.",
    priority: "P1",
    assignedTo: "2", // Mia Scout
    assignedToName: "Mia Scout",
    dueDate: "2024-09-15",
    status: "Pending",
    createdAt: "2024-08-01T11:00:00Z",
  },
];