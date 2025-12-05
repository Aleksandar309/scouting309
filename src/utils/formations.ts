import { Player, PlayerPosition } from '@/types/player';
import { Formation, FormationPosition, PlayerFormationFitPosition } from '@/types/formation';
import { VERTICAL_PITCH_COORDINATES } from './pitch-coordinates'; // Import centralized coordinates

export const FM_FORMATIONS: Formation[] = [
  {
    id: "433",
    name: "4-3-3",
    positions: [
      { name: "GK", ...VERTICAL_PITCH_COORDINATES["GK"] },
      { name: "LB", ...VERTICAL_PITCH_COORDINATES["LB"] },
      { name: "LCB", ...VERTICAL_PITCH_COORDINATES["LCB"] },
      { name: "RCB", ...VERTICAL_PITCH_COORDINATES["RCB"] },
      { name: "RB", ...VERTICAL_PITCH_COORDINATES["RB"] },
      { name: "DM", ...VERTICAL_PITCH_COORDINATES["DM"] },
      { name: "LCM", ...VERTICAL_PITCH_COORDINATES["LCM"] },
      { name: "RCM", ...VERTICAL_PITCH_COORDINATES["RCM"] },
      { name: "LW", ...VERTICAL_PITCH_COORDINATES["LW"] },
      { name: "RW", ...VERTICAL_PITCH_COORDINATES["RW"] },
      { name: "CF_CENTRAL", ...VERTICAL_PITCH_COORDINATES["CF_CENTRAL"] },
    ],
  },
  {
    id: "4231",
    name: "4-2-3-1",
    positions: [
      { name: "GK", ...VERTICAL_PITCH_COORDINATES["GK"] },
      { name: "LB", ...VERTICAL_PITCH_COORDINATES["LB"] },
      { name: "LCB", ...VERTICAL_PITCH_COORDINATES["LCB"] },
      { name: "RCB", ...VERTICAL_PITCH_COORDINATES["RCB"] },
      { name: "RB", ...VERTICAL_PITCH_COORDINATES["RB"] },
      { name: "LDM", ...VERTICAL_PITCH_COORDINATES["LDM"] },
      { name: "RDM", ...VERTICAL_PITCH_COORDINATES["RDM"] },
      { name: "AM", ...VERTICAL_PITCH_COORDINATES["AM"] },
      { name: "LW", ...VERTICAL_PITCH_COORDINATES["LW"] },
      { name: "RW", ...VERTICAL_PITCH_COORDINATES["RW"] },
      { name: "CF_CENTRAL", ...VERTICAL_PITCH_COORDINATES["CF_CENTRAL"] },
    ],
  },
  {
    id: "442",
    name: "4-4-2",
    positions: [
      { name: "GK", ...VERTICAL_PITCH_COORDINATES["GK"] },
      { name: "LB", ...VERTICAL_PITCH_COORDINATES["LB"] },
      { name: "LCB", ...VERTICAL_PITCH_COORDINATES["LCB"] },
      { name: "RCB", ...VERTICAL_PITCH_COORDINATES["RCB"] },
      { name: "RB", ...VERTICAL_PITCH_COORDINATES["RB"] },
      { name: "LM", ...VERTICAL_PITCH_COORDINATES["LM"] },
      { name: "LCM", ...VERTICAL_PITCH_COORDINATES["LCM"] },
      { name: "RCM", ...VERTICAL_PITCH_COORDINATES["RCM"] },
      { name: "RM", ...VERTICAL_PITCH_COORDINATES["RM"] },
      { name: "CF_LEFT", ...VERTICAL_PITCH_COORDINATES["CF_LEFT"] },
      { name: "CF_RIGHT", ...VERTICAL_PITCH_COORDINATES["CF_RIGHT"] },
    ],
  },
  {
    id: "343",
    name: "3-4-3",
    positions: [
      { name: "GK", ...VERTICAL_PITCH_COORDINATES["GK"] },
      { name: "LCB", ...VERTICAL_PITCH_COORDINATES["LCB"] },
      { name: "CB", ...VERTICAL_PITCH_COORDINATES["CB"] },
      { name: "RCB", ...VERTICAL_PITCH_COORDINATES["RCB"] },
      { name: "LWB", ...VERTICAL_PITCH_COORDINATES["LWB"] },
      { name: "RWB", ...VERTICAL_PITCH_COORDINATES["RWB"] },
      { name: "LCM", ...VERTICAL_PITCH_COORDINATES["LCM"] },
      { name: "RCM", ...VERTICAL_PITCH_COORDINATES["RCM"] },
      { name: "LW", ...VERTICAL_PITCH_COORDINATES["LW"] },
      { name: "RW", ...VERTICAL_PITCH_COORDINATES["RW"] },
      { name: "CF_CENTRAL", ...VERTICAL_PITCH_COORDINATES["CF_CENTRAL"] },
    ],
  },
  {
    id: "352",
    name: "3-5-2",
    positions: [
      { name: "GK", ...VERTICAL_PITCH_COORDINATES["GK"] },
      { name: "LCB", ...VERTICAL_PITCH_COORDINATES["LCB"] },
      { name: "CB", ...VERTICAL_PITCH_COORDINATES["CB"] },
      { name: "RCB", ...VERTICAL_PITCH_COORDINATES["RCB"] },
      { name: "LWB", ...VERTICAL_PITCH_COORDINATES["LWB"] },
      { name: "RWB", ...VERTICAL_PITCH_COORDINATES["RWB"] },
      { name: "DM", ...VERTICAL_PITCH_COORDINATES["DM"] },
      { name: "LCM", ...VERTICAL_PITCH_COORDINATES["LCM"] },
      { name: "RCM", ...VERTICAL_PITCH_COORDINATES["RCM"] },
      { name: "CF_LEFT", ...VERTICAL_PITCH_COORDINATES["CF_LEFT"] },
      { name: "CF_RIGHT", ...VERTICAL_PITCH_COORDINATES["CF_RIGHT"] },
    ],
  },
  // New Formations
  {
    id: "41212-narrow",
    name: "4-1-2-1-2 (Narrow Diamond)",
    positions: [
      { name: "GK", ...VERTICAL_PITCH_COORDINATES["GK"] },
      { name: "LB", ...VERTICAL_PITCH_COORDINATES["LB"] },
      { name: "LCB", ...VERTICAL_PITCH_COORDINATES["LCB"] },
      { name: "RCB", ...VERTICAL_PITCH_COORDINATES["RCB"] },
      { name: "RB", ...VERTICAL_PITCH_COORDINATES["RB"] },
      { name: "DM", ...VERTICAL_PITCH_COORDINATES["DM"] },
      { name: "LCM", x: "50%", y: "38%" }, // Narrower CMs
      { name: "RCM", x: "50%", y: "62%" }, // Narrower CMs
      { name: "AM", ...VERTICAL_PITCH_COORDINATES["AM"] },
      { name: "CF_LEFT", x: "90%", y: "40%" }, // Two strikers
      { name: "CF_RIGHT", x: "90%", y: "60%" }, // Two strikers
    ],
  },
  {
    id: "532",
    name: "5-3-2",
    positions: [
      { name: "GK", ...VERTICAL_PITCH_COORDINATES["GK"] },
      { name: "LCB", ...VERTICAL_PITCH_COORDINATES["LCB"] },
      { name: "CB", ...VERTICAL_PITCH_COORDINATES["CB"] },
      { name: "RCB", ...VERTICAL_PITCH_COORDINATES["RCB"] },
      { name: "LWB", ...VERTICAL_PITCH_COORDINATES["LWB"] },
      { name: "RWB", ...VERTICAL_PITCH_COORDINATES["RWB"] },
      { name: "LCM", ...VERTICAL_PITCH_COORDINATES["LCM"] },
      { name: "CM", ...VERTICAL_PITCH_COORDINATES["CM"] },
      { name: "RCM", ...VERTICAL_PITCH_COORDINATES["RCM"] },
      { name: "CF_LEFT", ...VERTICAL_PITCH_COORDINATES["CF_LEFT"] },
      { name: "CF_RIGHT", ...VERTICAL_PITCH_COORDINATES["CF_RIGHT"] },
    ],
  },
  {
    id: "4312",
    name: "4-3-1-2",
    positions: [
      { name: "GK", ...VERTICAL_PITCH_COORDINATES["GK"] },
      { name: "LB", ...VERTICAL_PITCH_COORDINATES["LB"] },
      { name: "LCB", ...VERTICAL_PITCH_COORDINATES["LCB"] },
      { name: "RCB", ...VERTICAL_PITCH_COORDINATES["RCB"] },
      { name: "RB", ...VERTICAL_PITCH_COORDINATES["RB"] },
      { name: "LDM", ...VERTICAL_PITCH_COORDINATES["LDM"] }, // Three central midfielders, can be DM or CM
      { name: "CM", ...VERTICAL_PITCH_COORDINATES["CM"] },
      { name: "RDM", ...VERTICAL_PITCH_COORDINATES["RDM"] },
      { name: "AM", ...VERTICAL_PITCH_COORDINATES["AM"] },
      { name: "CF_LEFT", ...VERTICAL_PITCH_COORDINATES["CF_LEFT"] },
      { name: "CF_RIGHT", ...VERTICAL_PITCH_COORDINATES["CF_RIGHT"] },
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