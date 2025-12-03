export interface ShortlistItem {
  id: string; // Player ID
  name: string; // Player Name
  team: string; // Player Team
  positions: string[]; // Player Positions
}

export interface Shortlist {
  id: string;
  name: string;
  players: ShortlistItem[];
}