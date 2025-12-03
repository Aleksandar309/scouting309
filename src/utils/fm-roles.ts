export type FmAttributeCategory = "technical" | "tactical" | "physical" | "mentalPsychology" | "setPieces" | "hidden";

export interface FmRoleAttribute {
  name: string; // e.g., "Passing Range", "Composure"
  category: FmAttributeCategory;
  weight: number; // e.g., 3 for primary, 2 for secondary, 1 for tertiary
}

export interface FmRole {
  name: string;
  description: string;
  positionType: string; // e.g., "CDM", "CM", "ST"
  attributes: FmRoleAttribute[];
}

export const FM_ROLES: FmRole[] = [
  // CDM Roles
  {
    name: "Defensive Midfielder",
    description: "A deep-lying midfielder focused on breaking up play and distributing simply.",
    positionType: "CDM",
    attributes: [
      { name: "Defensive Awareness", category: "tactical", weight: 3 },
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Strength", category: "physical", weight: 2 },
    ],
  },
  {
    name: "Deep-Lying Playmaker",
    description: "Controls the tempo of the game from deep, dictating play with a wide range of passes.",
    positionType: "CDM",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Composure", category: "mentalPsychology", weight: 3 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Defensive Awareness", category: "tactical", weight: 1 },
    ],
  },
  // CM Roles
  {
    name: "Box-to-Box Midfielder",
    description: "Covers a lot of ground, contributing to both attack and defence.",
    positionType: "CM",
    attributes: [
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Finishing", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Advanced Playmaker",
    description: "Operates in the space between midfield and attack, creating chances.",
    positionType: "CM",
    attributes: [
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
    ],
  },
  // ST Roles
  {
    name: "Complete Forward",
    description: "Combines the attributes of a Target Man, Poacher, and Deep-Lying Forward.",
    positionType: "ST",
    attributes: [
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Strength", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Passing Range", category: "technical", weight: 1 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
    ],
  },
  {
    name: "Poacher",
    description: "Stays on the shoulder of the last defender, looking for quick finishes.",
    positionType: "ST",
    attributes: [
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
    ],
  },
  // RW/LW Roles (Winger)
  {
    name: "Winger",
    description: "Stays wide, runs at defenders, and delivers crosses or cuts inside.",
    positionType: "RW", // Applicable to LW as well
    attributes: [
      { name: "Dribbling", category: "technical", weight: 3 },
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Crossing", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Work Rate", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Inside Forward",
    description: "Cuts inside from the wing to shoot or create chances.",
    positionType: "RW", // Applicable to LW as well
    attributes: [
      { name: "Dribbling", category: "technical", weight: 3 },
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
    ],
  },
  // CB Roles
  {
    name: "Central Defender",
    description: "A no-nonsense defender focused on winning the ball and clearing danger.",
    positionType: "CB",
    attributes: [
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Defensive Awareness", category: "tactical", weight: 3 },
      { name: "Strength", category: "physical", weight: 3 },
      { name: "Aerial Ability", category: "technical", weight: 2 },
      { name: "Positioning", category: "tactical", weight: 2 },
      { name: "Composure", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Ball-Playing Defender",
    description: "A central defender who also initiates attacks with accurate passes.",
    positionType: "CB",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Composure", category: "mentalPsychology", weight: 3 },
      { name: "Defensive Awareness", category: "tactical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Vision", category: "tactical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 1 },
    ],
  },
  // CAM Roles
  {
    name: "Attacking Midfielder",
    description: "Plays behind the striker, linking midfield and attack, scoring and assisting.",
    positionType: "CAM",
    attributes: [
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "Finishing", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
    ],
  },
  {
    name: "Shadow Striker",
    description: "An attacking midfielder who pushes forward to act as a second striker.",
    positionType: "CAM",
    attributes: [
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
    ],
  },
  // LB/RB Roles (Full-Back)
  {
    name: "Full-Back",
    description: "Provides defensive cover and supports attacks down the flanks.",
    positionType: "LB", // Applicable to RB as well
    attributes: [
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Defensive Awareness", category: "tactical", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Crossing", category: "technical", weight: 1 },
      { name: "Work Rate", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Wing-Back",
    description: "More attacking than a Full-Back, providing width and crosses.",
    positionType: "LB", // Applicable to RB as well
    attributes: [
      { name: "Crossing", category: "technical", weight: 3 },
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
    ],
  },
  // GK Roles
  {
    name: "Goalkeeper",
    description: "Traditional goalkeeper, focused on shot-stopping and basic distribution.",
    positionType: "GK",
    attributes: [
      { name: "Shot Stopping", category: "technical", weight: 3 },
      { name: "Reflexes", category: "physical", weight: 3 },
      { name: "Handling", category: "technical", weight: 3 },
      { name: "Command of Area", category: "tactical", weight: 2 },
      { name: "Communication", category: "mentalPsychology", weight: 2 },
    ],
  },
  {
    name: "Sweeper Keeper (Support)",
    description: "Acts as an extra defender, sweeping up through balls and distributing quickly.",
    positionType: "GK",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "Shot Stopping", category: "technical", weight: 2 },
    ],
  },
];

// Helper function to get attributes by category
import { Player, PlayerAttribute } from '@/types/player';

export const getAttributesByCategory = (player: Player, category: FmAttributeCategory): PlayerAttribute[] => {
  switch (category) {
    case "technical": return player.technical;
    case "tactical": return player.tactical;
    case "physical": return player.physical;
    case "mentalPsychology": return player.mentalPsychology;
    case "setPieces": return player.setPieces; // NEW
    case "hidden": return player.hidden; // NEW
    default: return [];
  }
};

// Function to calculate role compatibility
export const calculateRoleCompatibility = (player: Player, role: FmRole): number => {
  let totalScore = 0;
  let maxPossibleScore = 0;

  role.attributes.forEach(requiredAttr => {
    const playerCategoryAttrs = getAttributesByCategory(player, requiredAttr.category);
    const playerAttr = playerCategoryAttrs.find(attr => attr.name === requiredAttr.name);

    const playerRating = playerAttr ? playerAttr.rating : 0; // Assume 0 if attribute not found

    // Score for this attribute: player's rating * attribute weight
    totalScore += playerRating * requiredAttr.weight;
    // Max possible score for this attribute: max rating (10) * attribute weight
    maxPossibleScore += 10 * requiredAttr.weight;
  });

  if (maxPossibleScore === 0) return 0; // Avoid division by zero

  return Math.round((totalScore / maxPossibleScore) * 100);
};

// Function to get roles for a specific position type
export const getRolesForPosition = (positionType: string): FmRole[] => {
  // Handle generic positions like "RW" for "LW" roles if needed, or vice-versa
  // For now, direct match
  return FM_ROLES.filter(role => role.positionType === positionType);
};