import { Player, PlayerPosition } from '@/types/player';
import { Formation, FormationPosition, PlayerFormationFitPosition } from '@/types/formation';

// Reusing the coordinates from PlayerPitch for consistency
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "10%", y: "50%" }, "CB": { x: "22%", y: "50%" }, "LCB": { x: "22%", y: "30%" }, "RCB": { x: "22%", y: "70%" },
  "LB": { x: "30%", y: "10%" }, "RB": { x: "30%", y: "90%" }, "CDM": { x: "40%", y: "50%" }, "LCM": { x: "50%", y: "30%" },
  "RCM": { x: "50%", y: "70%" }, "CM": { x: "50%", y: "50%" }, "LM": { x: "60%", y: "10%" }, "RM": { x: "60%", y: "90%" },
  "CAM": { x: "70%", y: "50%" }, "LW": { x: "80%", y: "15%" }, "RW": { x: "80%", y: "85%" }, "ST": { x: "90%", y: "50%" },
  "LS": { x: "90%", y: "35%" }, "RS": { x: "90%", y: "65%" },
  // LWB (for 3-4-3, 3-5-2):
  "LWB": { x: "45%", y: "10%" },
  // RWB (for 3-4-3, 3-5-2):
  "RWB": { x: "45%", y: "90%" },
  // LDM (for 4-2-3-1):
  "LDM": { x: "40%", y: "30%" },
  // RDM (for 4-2-3-1):
  "RDM": { x: "40%", y: "70%" },
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
      { name: "CDM", ...positionCoordinates["CDM"] },
      { name: "LCM", ...positionCoordinates["LCM"] },
      { name: "RCM", ...positionCoordinates["RCM"] },
      { name: "LW", ...positionCoordinates["LW"] },
      { name: "RW", ...positionCoordinates["RW"] },
      { name: "ST", ...positionCoordinates["ST"] },
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
      { name: "LDM", ...positionCoordinates["LDM"] }, // Custom for 4-2-3-1
      { name: "RDM", ...positionCoordinates["RDM"] }, // Custom for 4-2-3-1
      { name: "CAM", ...positionCoordinates["CAM"] },
      { name: "LW", ...positionCoordinates["LW"] },
      { name: "RW", ...positionCoordinates["RW"] },
      { name: "ST", ...positionCoordinates["ST"] },
    ],
  },
  {
    id: "442",
    name: "4-4-2",
    positions: [
      { name: "GK", ...positionCoordinates["GK"] },
      { name: "LB", ...positionCoordinates["LB"] },
      { name: "LCB", ...positionCoordinates["LCB"] },
      { name: "RCB", ...positionCoordinates["RCB"] },
      { name: "RB", ...positionCoordinates["RB"] },
      { name: "LM", ...positionCoordinates["LM"] },
      { name: "LCM", x: "50%", y: "30%" }, // Using LCM/RCM for central midfield
      { name: "RCM", x: "50%", y: "70%" },
      { name: "RM", ...positionCoordinates["RM"] },
      { name: "LS", ...positionCoordinates["LS"] },
      { name: "RS", ...positionCoordinates["RS"] },
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
      { name: "LWB", ...positionCoordinates["LWB"] }, // Custom for 3-4-3
      { name: "RWB", ...positionCoordinates["RWB"] }, // Custom for 3-4-3
      { name: "LCM", x: "55%", y: "30%" },
      { name: "RCM", x: "55%", y: "70%" },
      { name: "LW", ...positionCoordinates["LW"] },
      { name: "RW", ...positionCoordinates["RW"] },
      { name: "ST", ...positionCoordinates["ST"] },
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
      { name: "CDM", ...positionCoordinates["CDM"] },
      { name: "LCM", x: "60%", y: "30%" },
      { name: "RCM", x: "60%", y: "70%" },
      { name: "LS", ...positionCoordinates["LS"] },
      { name: "RS", ...positionCoordinates["RS"] },
    ],
  },
];

export const calculateFormationFit = (player: Player, formation: Formation): PlayerFormationFitPosition[] => {
  const playerFitPositions: PlayerFormationFitPosition[] = [];

  formation.positions.forEach(formPos => {
    let bestFit: PlayerPosition | undefined;
    let fitType: "natural" | "alternative" | "tertiary" | "unsuited" = "unsuited";
    let fitRating = 0;

    // Check for natural fit
    bestFit = player.positionsData.find(p => p.name === formPos.name && p.type === "natural");
    if (bestFit) {
      fitType = "natural";
      fitRating = bestFit.rating;
    } else {
      // Check for alternative fit
      bestFit = player.positionsData.find(p => p.name === formPos.name && p.type === "alternative");
      if (bestFit) {
        fitType = "alternative";
        fitRating = bestFit.rating;
      } else {
        // Check for tertiary fit
        bestFit = player.positionsData.find(p => p.name === formPos.name && p.type === "tertiary");
        if (bestFit) {
          fitType = "tertiary";
          fitRating = bestFit.rating;
        }
      }
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

// New function to calculate overall formation fit for a player
export const calculateFormationOverallFit = (player: Player, formation: Formation): number => {
  const playerFitPositions = calculateFormationFit(player, formation);
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