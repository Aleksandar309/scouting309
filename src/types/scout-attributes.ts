export type ScoutAttributeCategory = "scouting" | "mental"; // Extend as needed

export interface ScoutAttribute {
  name: string;
  rating: number; // 1-10 scale
}

export const SCOUT_ATTRIBUTE_CATEGORIES: { [key: string]: string[] } = {
  scouting: [
    "Analysing Data",
    "Judging Player Ability",
    "Judging Player Potential",
    "Judging Staff Ability",
    "Judging Staff Potential", // Dodato
    "Negotiating",
    "Tactical Knowledge",
  ],
  mental: [
    "Adaptability",
    "Authority",
    "Determination",
    "Motivating",
    "People Management",
    "Ambition",
    "Loyalty",
    "Pressure",
    "Professionalism",
    "Temperament",
    "Controversy",
  ],
};

// Removed getQualitativeRating as we will use the player's rating color logic (1-10 scale)

export const createDefaultScoutAttributes = (attributeNames: string[], defaultRating: number = 5): ScoutAttribute[] => {
  return attributeNames.map(name => ({
    name,
    rating: defaultRating,
  }));
};