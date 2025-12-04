import { ScoutAttributeCategory } from '@/types/scout-attributes';

export interface ScoutRoleAttribute {
  name: string; // e.g., "Judging Player Ability", "Determination"
  category: ScoutAttributeCategory;
  weight: 1 | 2 | 3; // 3 for primary, 2 for secondary, 1 for tertiary
}

export interface ScoutRole {
  id: string;
  name: string; // e.g., "Head Scout", "European Scout"
  description: string;
  attributes: ScoutRoleAttribute[];
}

export const SCOUT_ROLES: ScoutRole[] = [
  {
    id: "head-scout",
    name: "Head Scout",
    description: "Oversees all scouting operations, focusing on strategic targets and team fit across all regions.",
    attributes: [
      { name: "Judging Player Ability", category: "scouting", weight: 3 },
      { name: "Judging Player Potential", category: "scouting", weight: 3 },
      { name: "Analysing Data", category: "scouting", weight: 2 },
      { name: "Tactical Knowledge", category: "scouting", weight: 2 },
      { name: "People Management", category: "mental", weight: 3 },
      { name: "Authority", category: "mental", weight: 2 },
      { name: "Determination", category: "mental", weight: 2 },
      { name: "Professionalism", category: "mental", weight: 1 },
    ],
  },
  {
    id: "european-scout",
    name: "European Scout",
    description: "Specializes in identifying talent across major European leagues, with an emphasis on technical ability and tactical intelligence.",
    attributes: [
      { name: "Judging Player Ability", category: "scouting", weight: 3 },
      { name: "Judging Player Potential", category: "scouting", weight: 3 },
      { name: "Tactical Knowledge", category: "scouting", weight: 2 },
      { name: "Analysing Data", category: "scouting", weight: 1 },
      { name: "Adaptability", category: "mental", weight: 3 },
      { name: "Pressure", category: "mental", weight: 2 },
      { name: "Professionalism", category: "mental", weight: 1 },
    ],
  },
  {
    id: "youth-scout",
    name: "Youth Scout",
    description: "Focuses on emerging talents in youth academies and lower leagues, looking for high potential and coachability.",
    attributes: [
      { name: "Judging Player Potential", category: "scouting", weight: 3 },
      { name: "Judging Player Ability", category: "scouting", weight: 2 },
      { name: "People Management", category: "mental", weight: 2 },
      { name: "Motivating", category: "mental", weight: 2 },
      { name: "Determination", category: "mental", weight: 1 },
      { name: "Adaptability", category: "mental", weight: 1 },
    ],
  },
  {
    id: "technical-director",
    name: "Technical Director",
    description: "Responsible for the overall football philosophy, player development pathways, and recruitment strategy.",
    attributes: [
      { name: "Tactical Knowledge", category: "scouting", weight: 3 },
      { name: "Judging Staff Ability", category: "scouting", weight: 3 },
      { name: "Analysing Data", category: "scouting", weight: 2 },
      { name: "People Management", category: "mental", weight: 3 },
      { name: "Authority", category: "mental", weight: 3 },
      { name: "Ambition", category: "mental", weight: 2 },
      { name: "Professionalism", category: "mental", weight: 2 },
    ],
  },
  {
    id: "recruitment-analyst",
    name: "Recruitment Analyst",
    description: "Focuses on data-driven player identification, statistical analysis, and market value assessment.",
    attributes: [
      { name: "Analysing Data", category: "scouting", weight: 3 },
      { name: "Judging Player Ability", category: "scouting", weight: 2 },
      { name: "Judging Player Potential", category: "scouting", weight: 2 },
      { name: "Tactical Knowledge", category: "scouting", weight: 1 },
      { name: "Concentration", category: "mental", weight: 2 },
      { name: "Professionalism", category: "mental", weight: 2 },
    ],
  },
];

// Helper to get highlight type for a scout attribute based on a selected role
export const getHighlightTypeForScoutAttribute = (
  attributeName: string,
  category: ScoutAttributeCategory,
  selectedRole: ScoutRole | null
): 'primary' | 'secondary' | 'tertiary' | null => {
  if (!selectedRole) return null;

  const roleAttr = selectedRole.attributes.find(
    (attr) => attr.name === attributeName && attr.category === category
  );

  if (roleAttr) {
    if (roleAttr.weight === 3) return 'primary';
    if (roleAttr.weight === 2) return 'secondary';
    if (roleAttr.weight === 1) return 'tertiary';
  }
  return null;
};