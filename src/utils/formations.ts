import { Player, PlayerPosition } from '@/types/player';
import { Formation, FormationPosition, PlayerFormationFitPosition } from '@/types/formation';

// Transformed for vertical pitch (attack top, defense bottom)
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "50%", y: "90%" }, // Golman na dnu
  "CB": { x: "50%", y: "78%" },
  "LCB": { x: "30%", y: "78%" },
  "RCB": { x: "70%", y: "78%" },
  "LB": { x: "10%", y: "70%" },
  "RB": { x: "90%", y: "70%" },
  "DM": { x: "50%", y: "60%" },
  "LDM": { x: "30%", y: "60%" },
  "RDM": { x: "70%", y: "60%" },
  "LCM": { x: "30%", y: "50%" },
  "RCM": { x: "70%", y: "50%" },
  "CM": { x: "50%", y: "50%" },
  "LWB": { x: "10%", y: "55%" },
  "RWB": { x: "90%", y: "55%" },
  "AM": { x: "50%", y: "30%" },
  "LW": { x: "15%", y: "20%" },
  "RW": { x: "85%", y: "20%" },
  "CF_CENTRAL": { x: "50%", y: "10%" }, // Napadač na vrhu
  "CF_LEFT": { x: "35%", y: "10%" },
  "CF_RIGHT": { x: "65%", y: "10%" },
  "CF": { x: "50%", y: "10%" }, // Generic CF
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
      { name: "LCB", x: "30%", y: "78%" },
      { name: "RCB", x: "70%", y: "78%" },
      { name: "RB", ...positionCoordinates["RB"] },
      { name: "LM", x: "10%", y: "40%" },
      { name: "LCM", x: "30%", y: "50%" },
      { name: "RCM", x: "70%", y: "50%" },
      { name: "RM", x: "90%", y: "40%" },
      { name: "CF_LEFT", ...positionCoordinates["CF_LEFT"] },
      { name: "CF_RIGHT", ...positionCoordinates["CF_RIGHT"] },
    ],
  },
  {
    id: "343",
    name: "3-4-3",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LCB", x: "30%", y: "78%" },
      { name: "CB", x: "50%", y: "78%" },
      { name: "RCB", x: "70%", y: "78%" },
      { name: "LWB", ...positionCoordinates["LWB"] },
      { name: "RWB", ...positionCoordinates["RWB"] },
      { name: "LCM", x: "30%", y: "45%" },
      { name: "RCM", x: "70%", y: "45%" },
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
      { name: "LCB", x: "30%", y: "78%" },
      { name: "CB", x: "50%", y: "78%" },
      { name: "RCB", x: "70%", y: "78%" },
      { name: "LWB", ...positionCoordinates["LWB"] },
      { name: "RWB", ...positionCoordinates["RWB"] },
      { name: "DM", ...positionCoordinates["DM"] },
      { name: "LCM", x: "30%", y: "40%" },
      { name: "RCM", x: "70%", y: "40%" },
      { name: "CF_LEFT", ...positionCoordinates["CF_LEFT"] },
      { name: "CF_RIGHT", ...positionCoordinates["CF_RIGHT"] },
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
  };

  const generalPositionName = specificToGeneralMap[formationPositionName];
  if (generalPositionName) {
    playerPos = playerPositions.find(p => p.name === generalPositionName);
    if (playerPos) return playerPos;
  }

  return undefined;
};

// REMOVED: adjustRatingForFootedness function

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

    // REMOVED: Apply footedness adjustment for LCB/RCB

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