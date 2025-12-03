export interface PlayerAttribute {
  name: string;
  rating: number;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  positions: string[];
  priorityTarget: boolean;
  criticalPriority: boolean;
  nationality: string;
  age: number;
  value: string;
  footed: string;
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
  };
  technical: PlayerAttribute[];
  tactical: PlayerAttribute[];
  physical: PlayerAttribute[];
  mentalPsychology: PlayerAttribute[];
  keyStrengths: string[];
  areasForDevelopment: string[];
  scoutingReports: {
    id: string;
    date: string;
    scout: string;
    rating: number;
    title: string;
  }[];
}