export interface ShadowTeamPlayer {
  id: string; // Player ID
  name: string; // Player Name
  avatarUrl?: string;
  age: number;
  currentAbility: number; // CA
  potentialAbility: number; // PA
  position: string; // The specific pitch position (e.g., "ST", "LCM")
  dotColor?: string; // Custom color for the player's dot on the pitch
  note?: string; // A note specific to this player in this shadow team
}

export interface ShadowTeam {
  id: string;
  name: string;
  formationId: string; // ID of the selected formation (e.g., "433")
  playersByPosition: {
    [pitchPositionName: string]: ShadowTeamPlayer[]; // Key is pitch position name, value is array of players
  };
  sharingSettings?: 'private' | 'public' | 'team'; // Placeholder for sharing settings
  calendarIntegration?: boolean; // Placeholder for calendar integration
}