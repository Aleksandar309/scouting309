export interface PlayerAttribute {
  name: string;
  rating: number;
}

export interface PlayerPosition {
  name: string; // e.g., "CDM", "CM", "RW", "ST", "CB", "LB", "RB", "GK"
  type: "natural" | "alternative" | "tertiary";
  rating: number; // 0-10
}

export interface Player {
  id: string;
  name: string;
  team: string;
  positions: string[]; // Keep this for general display
  positionsData: PlayerPosition[]; // New field for detailed position data
  priorityTarget: boolean;
  criticalPriority: boolean;
  nationality: string;
  age: number;
  value: string;
  footed: string;
  avatarUrl?: string; // NEW: Optional field for player avatar image URL
  details: {
    height: string;
    weight: string;
    league: string;
    contractExpiry: string;
    wageDemands: string;
    agent: string;
    notes: string;
  };
  scoutingProfile: {
    overall: number;
    potential: number;
    brightonFit: number;
    currentAbility: number; // NEW
    potentialAbility: number; // NEW
    teamFit: number; // NEW
  };
  technical: PlayerAttribute[];
  tactical: PlayerAttribute[];
  physical: PlayerAttribute[];
  mentalPsychology: PlayerAttribute[];
  setPieces: PlayerAttribute[]; // NEW: Set Pieces attributes
  hidden: PlayerAttribute[]; // NEW: Hidden attributes
  keyStrengths: string[];
  areasForDevelopment: string[];
  scoutingReports: {
    id: string;
    date: string;
    scout: string;
    rating: number;
    title: string;
    keyStrengths?: string; // Added
    areasForDevelopment?: string; // Added
  }[];
}