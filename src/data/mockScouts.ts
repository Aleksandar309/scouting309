"use client";

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
    scoutingAttributes: {
      analysingData: 16,
      judgingPlayerAbility: 18,
      judgingPlayerPotential: 17,
      judgingStaffAbility: 15,
      judgingStaffPotential: 14, // Dodato
      negotiating: 14,
      tacticalKnowledge: 16,
    },
    mentalAttributes: {
      adaptability: 15,
      authority: 17,
      determination: 18,
      motivating: 16,
      peopleManagement: 17,
      ambition: 16,
      loyalty: 18,
      pressure: 15,
      professionalism: 19,
      temperament: 16,
      controversy: 5,
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
      analysingData: 14,
      judgingPlayerAbility: 16,
      judgingPlayerPotential: 17,
      judgingStaffAbility: 12,
      judgingStaffPotential: 13, // Dodato
      negotiating: 10,
      tacticalKnowledge: 15,
    },
    mentalAttributes: {
      adaptability: 18,
      authority: 14,
      determination: 16,
      motivating: 15,
      peopleManagement: 16,
      ambition: 17,
      loyalty: 15,
      pressure: 17,
      professionalism: 17,
      temperament: 14,
      controversy: 7,
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
      analysingData: 10,
      judgingPlayerAbility: 14,
      judgingPlayerPotential: 16,
      judgingStaffAbility: 8,
      judgingStaffPotential: 9, // Dodato
      negotiating: 7,
      tacticalKnowledge: 12,
    },
    mentalAttributes: {
      adaptability: 16,
      authority: 10,
      determination: 14,
      motivating: 12,
      peopleManagement: 13,
      ambition: 14,
      loyalty: 16,
      pressure: 13,
      professionalism: 15,
      temperament: 12,
      controversy: 9,
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