export type ScoutAttributeCategory = "scouting" | "mental"; // Extend as needed

export interface ScoutAttribute {
  name: string;
  rating: number; // 1-20 scale
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

export const getQualitativeRating = (rating: number): { label: string; colorClass: string } => {
  if (rating <= 5) {
    return { label: "Unsuited", colorClass: "bg-destructive text-destructive-foreground" };
  } else if (rating <= 10) {
    return { label: "Reasonable", colorClass: "bg-yellow-600 text-white" };
  } else if (rating <= 15) {
    return { label: "Competent", colorClass: "bg-green-600 text-white" };
  } else { // 16-20
    return { label: "Excellent", colorClass: "bg-blue-600 text-white" };
  }
};

export const createDefaultScoutAttributes = (attributeNames: string[], defaultRating: number = 10): ScoutAttribute[] => {
  return attributeNames.map(name => ({
    name,
    rating: defaultRating,
  }));
};