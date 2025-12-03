export interface FormationPosition {
  name: string; // e.g., "ST", "CAM", "CDM"
  x: string; // percentage for pitch placement
  y: string; // percentage for pitch placement
}

export interface Formation {
  id: string;
  name: string; // e.g., "4-3-3", "4-2-3-1"
  positions: FormationPosition[];
}

export interface PlayerFormationFitPosition {
  name: string; // Formation position name (e.g., "ST", "CDM")
  rating: number; // Player's rating for this specific position (0-10)
  type: "natural" | "alternative" | "tertiary" | "unsuited"; // How well player fits this position
  x: string;
  y: string;
}