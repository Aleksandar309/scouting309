export const VERTICAL_PITCH_COORDINATES: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "10%", y: "50%" }, // Goalkeeper at the left side
  
  // Defenders (back line)
  "CB": { x: "22%", y: "50%" }, // Central Defender
  "LCB": { x: "22%", y: "30%" }, // Left Centre Back
  "RCB": { x: "22%", y: "70%" }, // Right Centre Back
  "LB": { x: "30%", y: "10%" }, // Left Back
  "RB": { x: "30%", y: "90%" }, // Right Back

  // Defensive Midfielders
  "DM": { x: "40%", y: "50%" }, // Defensive Midfielder
  "LDM": { x: "40%", y: "30%" }, // Left Defensive Midfielder
  "RDM": { x: "40%", y: "70%" }, // Right Defensive Midfielder

  // Central Midfielders
  "CM": { x: "50%", y: "50%" }, // Central Midfielder
  "LCM": { x: "50%", y: "30%" }, // Left Central Midfielder
  "RCM": { x: "50%", y: "70%" }, // Right Central Midfielder

  // Wing Backs (more advanced than fullbacks)
  "LWB": { x: "45%", y: "10%" }, // Left Wing Back
  "RWB": { x: "45%", y: "90%" }, // Right Wing Back

  // Attacking Midfielders
  "AM": { x: "70%", y: "50%" }, // Attacking Midfielder

  // Wingers / Wide Forwards
  "LW": { x: "80%", y: "15%" }, // Left Wing
  "RW": { x: "80%", y: "85%" }, // Right Wing

  // Centre Forwards
  "CF": { x: "90%", y: "50%" }, // Generic Centre Forward
  "CF_CENTRAL": { x: "90%", y: "50%" }, // Central Centre Forward
  "CF_LEFT": { x: "90%", y: "35%" }, // Left Centre Forward
  "CF_RIGHT": { x: "90%", y: "65%" }, // Right Centre Forward

  // Additional positions for 4-4-2 (LM/RM)
  "LM": { x: "50%", y: "10%" }, // Left Midfielder
  "RM": { x: "50%", y: "90%" }, // Right Midfielder
};