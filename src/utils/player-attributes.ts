import { PlayerAttribute } from '@/types/player';

export const ALL_ATTRIBUTE_NAMES = [
  // Technical
  "First Touch", "Passing Range", "Ball Striking", "Dribbling", "Crossing",
  "Aerial Ability", "Tackling", "Finishing", "Technique",
  // Tactical
  "Positioning", "Decision Making", "Game Intelligence", "Off-Ball Movement",
  "Pressing", "Defensive Awareness", "Vision", "Anticipation", "Marking", "Command of Area",
  // Physical
  "Pace", "Acceleration", "Strength", "Stamina", "Agility", "Recovery", "Reflexes", "Balance", "Natural Fitness",
  // Mental & Psychology
  "Composure", "Leadership", "Work Rate", "Concentration", "Coachability",
  "Resilience", "Aggression", "Bravery", "Flair", "Teamwork", "Communication",
  // Set Pieces
  "Corners", "Free Kicks", "Penalties", "Long Throws", "Defending corners", "Shot Stopping", "Handling",
  // Hidden (Note: Hidden attributes usually have a different scale, but we'll display them as is)
  "Consistency", "Important Matches", "Versatility", "Dirtiness", "Injury Proneness",
  "Adaptability", "Ambition", "Loyalty",
];

// Helper to create a default attribute list for a new player
export const createDefaultPlayerAttributes = (attributeNames: string[], defaultRating: number = 5): PlayerAttribute[] => {
  return attributeNames.map(name => ({
    name,
    rating: defaultRating,
  }));
};

// Categorized attributes for easier form generation
export const CATEGORIZED_ATTRIBUTES: { [key: string]: string[] } = {
  technical: ["First Touch", "Passing Range", "Ball Striking", "Dribbling", "Crossing", "Aerial Ability", "Tackling", "Finishing", "Technique"],
  tactical: ["Positioning", "Decision Making", "Game Intelligence", "Off-Ball Movement", "Pressing", "Defensive Awareness", "Vision", "Anticipation", "Marking", "Command of Area"],
  physical: ["Pace", "Acceleration", "Strength", "Stamina", "Agility", "Recovery", "Reflexes", "Balance", "Natural Fitness"],
  mentalPsychology: ["Composure", "Leadership", "Work Rate", "Concentration", "Coachability", "Resilience", "Aggression", "Bravery", "Flair", "Teamwork", "Communication"],
  setPieces: ["Corners", "Free Kicks", "Penalties", "Long Throws", "Defending corners", "Shot Stopping", "Handling"],
  hidden: ["Consistency", "Important Matches", "Versatility", "Dirtiness", "Injury Proneness", "Adaptability", "Ambition", "Loyalty"],
};