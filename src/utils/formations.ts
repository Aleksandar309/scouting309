import { Player, PlayerPosition } from '@/types/player';
import { Formation, FormationPosition, PlayerFormationFitPosition } from '@/types/formation';

// Transformed for horizontal pitch (defense left, attack right)
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "10%", y: "50%" }, // Golman na levoj strani
  "CB": { x: "22%", y: "50%" },
  "LCB": { x: "22%", y: "30%" },
  "RCB": { x: "22%", y: "70%" },
  "LB": { x: "30%", y: "10%" },
  "RB": { x: "30%", y: "90%" },
  "DM": { x: "40%", y: "50%" },
  "LDM": { x: "40%", y: "30%" },
  "RDM": { x: "40%", y: "70%" },
  "LCM": { x: "50%", y: "30%" },
  "RCM": { x: "50%", y: "70%" },
  "CM": { x: "50%", y: "50%" },
  "LWB": { x: "45%", y: "10%" },
  "RWB": { x: "45%", y: "90%" },
  "AM": { x: "70%", y: "50%" },
  "LW": { x: "80%", y: "15%" },
  "RW": { x: "80%", y: "85%" },
  "CF_CENTRAL": { x: "90%", y: "50%" }, // Napadač na desnoj strani
  "CF_LEFT": { x: "90%", y: "35%" },
  "CF_RIGHT": { x: "90%", y: "65%" },
  "CF": { x: "90%", y: "50%" }, // Generic CF
};

export const FM_FORMATIONS: Formation[] = [
  {
    id: "433",
    name: "4-3-3",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LB", ...positionCoordinates["LB"] },
      { name: "LCB", ...positionCoordinates["LCB"] },
      { name: "RCB", ...positionCoordinates["RCB"] },
      { name: "RB", ...positionCoordinates["RB"] },
      { name: "DM", ...positionCoordinates["DM"] },
      { name: "LCM", ...positionCoordinates["LCM"] },
      { name: "RCM", ...positionCoordinates["RCM"] },
      { name: "LW", ...positionCoordinates["LW"] },
      { name: "RW", ...positionCoordinates["RW"] },
      { name: "CF_CENTRAL", ...positionCoordinates["CF_CENTRAL"] },
    ],
  },
  {
    id: "4231",
    name: "4-2-3-1",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LB", ...positionCoordinates["LB"] },
      { name: "LCB", ...positionCoordinates["LCB"] },
      { name: "RCB", ...positionCoordinates["RCB"] },
      { name: "RB", ...positionCoordinates["RB"] },
      { name: "LDM", ...positionCoordinates["LDM"] },
      { name: "RDM", ...positionCoordinates["RDM"] },
      { name: "AM", ...positionCoordinates["AM"] },
      { name: "LW", ...positionCoordinates["LW"] },
      { name: "RW", ...positionCoordinates["RW"] },
      { name: "CF_CENTRAL", ...positionCoordinates["CF_CENTRAL"] },
    ],
  },
  {
    id: "442",
    name: "4-4-2",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LB", ...positionCoordinates["LB"] },
      { name: "LCB", x: "22%", y: "30%" },
      { name: "RCB", x: "22%", y: "70%" },
      { name: "RB", ...positionCoordinates["RB"] },
      { name: "LM", x: "40%", y: "10%" },
      { name: "LCM", x: "50%", y: "30%" },
      { name: "RCM", x: "50%", y: "70%" },
      { name: "RM", x: "40%", y: "90%" },
      { name: "CF_LEFT", ...positionCoordinates["CF_LEFT"] },
      { name: "CF_RIGHT", ...positionCoordinates["CF_RIGHT"] },
    ],
  },
  {
    id: "343",
    name: "3-4-3",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LCB", x: "22%", y: "30%" },
      { name: "CB", x: "22%", y: "50%" },
      { name: "RCB", x: "22%", y: "70%" },
      { name: "LWB", ...positionCoordinates["LWB"] },
      { name: "RWB", ...positionCoordinates["RWB"] },
      { name: "LCM", x: "45%", y: "30%" },
      { name: "RCM", x: "45%", y: "70%" },
      { name: "LW", ...positionCoordinates["LW"] },
      { name: "RW", ...positionCoordinates["RW"] },
      { name: "CF_CENTRAL", ...positionCoordinates["CF_CENTRAL"] },
    ],
  },
  {
    id: "352",
    name: "3-5-2",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LCB", x: "22%", y: "30%" },
      { name: "CB", x: "22%", y: "50%" },
      { name: "RCB", x: "22%", y: "70%" },
      { name: "LWB", ...positionCoordinates["LWB"] },
      { name: "RWB", ...positionCoordinates["RWB"] },
      { name: "DM", ...positionCoordinates["DM"] },
      { name: "LCM", x: "40%", y: "30%" },
      { name: "RCM", x: "40%", y: "70%" },
      { name: "CF_LEFT", ...positionCoordinates["CF_LEFT"] },
      { name: "CF_RIGHT", ...positionCoordinates["CF_RIGHT"] },
    ],
  },
  // New Formations
  {
    id: "41212-narrow",
    name: "4-1-2-1-2 (Narrow Diamond)",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LB", ...positionCoordinates["LB"] },
      { name: "LCB", ...positionCoordinates["LCB"] },
      { name: "RCB", ...positionCoordinates["RCB"] },
      { name: "RB", ...positionCoordinates["RB"] },
      { name: "DM", ...positionCoordinates["DM"] },
      { name: "LCM", x: "50%", y: "38%" }, // Narrower CMs
      { name: "RCM", x: "50%", y: "62%" }, // Narrower CMs
      { name: "AM", ...positionCoordinates["AM"] },
      { name: "CF_LEFT", x: "90%", y: "40%" }, // Two strikers
      { name: "CF_RIGHT", x: "90%", y: "60%" }, // Two strikers
    ],
  },
  {
    id: "532",
    name: "5-3-2",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LCB", x: "22%", y: "30%" },
      { name: "CB", x: "22%", y: "50%" },
      { name: "RCB", x: "22%", y: "70%" },
      { name: "LWB", ...positionCoordinates["LWB"] },
      { name: "RWB", ...positionCoordinates["RWB"] },
      { name: "LCM", x: "50%", y: "30%" },
      { name: "CM", x: "50%", y: "50%" },
      { name: "RCM", x: "50%", y: "70%" },
      { name: "CF_LEFT", ...positionCoordinates["CF_LEFT"] },
      { name: "CF_RIGHT", ...positionCoordinates["CF_RIGHT"] },
    ],
  },
  {
    id: "4312",
    name: "4-3-1-2",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LB", ...positionCoordinates["LB"] },
      { name: "LCB", ...positionCoordinates["LCB"] },
      { name: "RCB", ...positionCoordinates["RCB"] },
      { name: "RB", ...positionCoordinates["RB"] },
      { name: "LDM", x: "40%", y: "30%" }, // Three central midfielders, can be DM or CM
      { name: "CM", x: "40%", y: "50%" },
      { name: "RDM", x: "40%", y: "70%" },
      { name: "AM", ...positionCoordinates["AM"] },
      { name: "CF_LEFT", x: "90%", y: "40%" },
      { name: "CF_RIGHT", x: "90%", y: "60%" },
    ],
  },
];

// Helper to find the best player position data for a given formation position name
const getPlayerPositionDataForFormationPosition = (playerPositions: PlayerPosition[], formationPositionName: string): PlayerPosition | undefined => {
  // 1. Try direct match
  let playerPos = playerPositions.find(p => p.name === formationPositionName);
  if (playerPos) return playerPos;

  // 2. Try mapping specific formation positions to general player positions
  const specificToGeneralMap: { [key: string]: string } = {
    "LCB": "CB", "RCB": "CB",
    "LDM": "DM", "RDM": "DM", // Map LDM/RDM to general DM
    "LCM": "CM", "RCM": "CM",
    "CF_LEFT": "CF", "CF_RIGHT": "CF", "CF_CENTRAL": "CF", // Map all CF variants to general CF
    "LWB": "LB", "RWB": "RB", // LWB/RWB map to LB/RB for player positions
    "AM": "AM", // Ensure AM maps to AM
    "LM": "LW", "RM": "RW", // Map LM/RM to LW/RW for player positions
  };

  const generalPositionName = specificToGeneralMap[formationPositionName];
  if (generalPositionName) {
    playerPos = playerPositions.find(p => p.name === generalPositionName);
    if (playerPos) return playerPos;
  }

  return undefined;
};

export const calculateFormationFit = (player: Player, formation: Formation): PlayerFormationFitPosition[] => {
  const playerFitPositions: PlayerFormationFitPosition[] = [];

  formation.positions.forEach(formPos => {
    const playerPositionData = getPlayerPositionDataForFormationPosition(player.positionsData, formPos.name);

    let fitType: "natural" | "alternative" | "tertiary" | "unsuited" = "unsuited";
    let fitRating = 0;

    if (playerPositionData) {
      fitType = playerPositionData.type;
      fitRating = playerPositionData.rating;
    }

    playerFitPositions.push({
      name: formPos.name,
      rating: fitRating,
      type: fitType,
      x: formPos.x,
      y: formPos.y,
    });
  });

  return playerFitPositions;
};

// Function to calculate overall formation fit for a player
export const calculateFormationOverallFit = (player: Player, formation: Formation): number => {
  const playerFitPositions = calculateFormationFit(player, formation); // Use the enhanced fit calculation
  let totalRating = 0;
  let totalPossibleRating = 0;

  playerFitPositions.forEach(pos => {
    // Give more weight to natural and alternative positions
    let weight = 1;
    if (pos.type === "natural") weight = 3;
    else if (pos.type === "alternative") weight = 2;
    // Tertiary and unsuited positions get less or no weight for overall score

    totalRating += pos.rating * weight;
    totalPossibleRating += 10 * weight; // Max rating is 10 for each position
  });

  if (totalPossibleRating === 0) return 0;
  return Math.round((totalRating / totalPossibleRating) * 100);
};

// Function to get star rating based on overall fit percentage (0-100)
export const getStarRating = (overallFit: number): number => {
  if (overallFit < 10) return 0.5;
  if (overallFit < 20) return 1;
  if (overallFit < 30) return 1.5;
  if (overallFit < 40) return 2;
  if (overallFit < 50) return 2.5;
  return 3; // 50% and above
};