export interface ShadowTeamPlayer {
  id: string; // Player ID
  name: string; // Player Name
  avatarUrl?: string;
  age: number;
  currentAbility: number; // CA
  potentialAbility: number; // PA
  position: string; // The specific pitch position (e.g., "ST", "LCM")
}

export interface ShadowTeam {
  id: string;
  name: string;
  formationId: string; // ID of the selected formation (e.g., "433")
  playersByPosition: {
    [pitchPositionName: string]: ShadowTeamPlayer[]; // Key is pitch position name, value is array of players
  };
}