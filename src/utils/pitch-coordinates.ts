export const VERTICAL_PITCH_COORDINATES: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "50%", y: "90%" }, // Goalkeeper at the bottom

  // Defenders (back line)
  "CB": { x: "50%", y: "78%" }, // Central Defender
  "LCB": { x: "30%", y: "78%" }, // Left Centre Back
  "RCB": { x: "70%", y: "78%" }, // Right Centre Back
  "LB": { x: "10%", y: "70%" }, // Left Back
  "RB": { x: "90%", y: "70%" }, // Right Back

  // Defensive Midfielders
  "DM": { x: "50%", y: "60%" }, // Defensive Midfielder
  "LDM": { x: "30%", y: "60%" }, // Left Defensive Midfielder
  "RDM": { x: "70%", y: "60%" }, // Right Defensive Midfielder

  // Central Midfielders
  "CM": { x: "50%", y: "50%" }, // Central Midfielder
  "LCM": { x: "30%", y: "50%" }, // Left Central Midfielder
  "RCM": { x: "70%", y: "50%" }, // Right Central Midfielder

  // Wing Backs (more advanced than fullbacks)
  "LWB": { x: "10%", y: "55%" }, // Left Wing Back
  "RWB": { x: "90%", y: "55%" }, // Right Wing Back

  // Attacking Midfielders
  "AM": { x: "50%", y: "30%" }, // Attacking Midfielder

  // Wingers / Wide Forwards
  "LW": { x: "15%", y: "20%" }, // Left Wing
  "RW": { x: "85%", y: "20%" }, // Right Wing

  // Centre Forwards
  "CF": { x: "50%", y: "10%" }, // Generic Centre Forward
  "CF_CENTRAL": { x: "50%", y: "10%" }, // Central Centre Forward
  "CF_LEFT": { x: "35%", y: "10%" }, // Left Centre Forward
  "CF_RIGHT": { x: "65%", y: "10%" }, // Right Centre Forward

  // Additional positions for 4-4-2 (LM/RM)
  "LM": { x: "10%", y: "50%" }, // Left Midfielder
  "RM": { x: "90%", y: "50%" }, // Right Midfielder
};