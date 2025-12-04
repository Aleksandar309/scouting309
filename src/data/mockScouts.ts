"use client";

import { Scout, Assignment } from '@/types/scout';

// Helper to scale 1-20 rating to 1-10
const scaleRating = (rating20: number): number => {
  if (rating20 <= 2) return 1;
  if (rating20 <= 4) return 2;
  if (rating20 <= 6) return 3;
  if (rating20 <= 8) return 4;
  if (rating20 <= 10) return 5;
  if (rating20 <= 12) return 6;
  if (rating20 <= 14) return 7;
  if (rating20 <= 16) return 8;
  if (rating20 <= 18) return 9;
  return 10; // 19-20
};

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
    scoutingAttributes: {
      analysingData: scaleRating(16),
      judgingPlayerAbility: scaleRating(18),
      judgingPlayerPotential: scaleRating(17),
      judgingStaffAbility: scaleRating(15),
      judgingStaffPotential: scaleRating(14), // Dodato
      negotiating: scaleRating(14),
      tacticalKnowledge: scaleRating(16),
    },
    mentalAttributes: {
      adaptability: scaleRating(15),
      authority: scaleRating(17),
      determination: scaleRating(18),
      motivating: scaleRating(16),
      peopleManagement: scaleRating(17),
      ambition: scaleRating(16),
      loyalty: scaleRating(18),
      pressure: scaleRating(15),
      professionalism: scaleRating(19),
      temperament: scaleRating(16),
      controversy: scaleRating(5),
    },
    preferredJobs: ["Head Scout", "Technical Director", "Director of Football"],
  },
  {
    id: "2",
    name: "Mia Scout",
    role: "Senior Scout", // Changed from European Scout
    email: "mia.scout@brighton.com",
    phone: "+44 7987 654321",
    activePlayers: 8,
    lastReportDate: "2024-07-22",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MS",
    scoutingAttributes: {
      analysingData: scaleRating(14),
      judgingPlayerAbility: scaleRating(16),
      judgingPlayerPotential: scaleRating(17),
      judgingStaffAbility: scaleRating(12),
      judgingStaffPotential: scaleRating(13), // Dodato
      negotiating: scaleRating(10),
      tacticalKnowledge: scaleRating(15),
    },
    mentalAttributes: {
      adaptability: scaleRating(18),
      authority: scaleRating(14),
      determination: scaleRating(16),
      motivating: scaleRating(15),
      peopleManagement: scaleRating(16),
      ambition: scaleRating(17),
      loyalty: scaleRating(15),
      pressure: scaleRating(17),
      professionalism: scaleRating(17),
      temperament: scaleRating(14),
      controversy: scaleRating(7),
    },
    preferredJobs: ["Senior Scout", "Scout", "Recruitment Analyst"], // Updated preferred jobs
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
    scoutingAttributes: {
      analysingData: scaleRating(10),
      judgingPlayerAbility: scaleRating(14),
      judgingPlayerPotential: scaleRating(16),
      judgingStaffAbility: scaleRating(8),
      judgingStaffPotential: scaleRating(9), // Dodato
      negotiating: scaleRating(7),
      tacticalKnowledge: scaleRating(12),
    },
    mentalAttributes: {
      adaptability: scaleRating(16),
      authority: scaleRating(10),
      determination: scaleRating(14),
      motivating: scaleRating(12),
      peopleManagement: scaleRating(13),
      ambition: scaleRating(14),
      loyalty: scaleRating(16),
      pressure: scaleRating(13),
      professionalism: scaleRating(15),
      temperament: scaleRating(12),
      controversy: scaleRating(9),
    },
    preferredJobs: ["Youth Scout", "Head of Youth Development", "Performance Analyst"],
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