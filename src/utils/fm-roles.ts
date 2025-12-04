import { Player, PlayerAttribute } from '@/types/player';

export type FmAttributeCategory = "technical" | "tactical" | "physical" | "mentalPsychology" | "setPieces" | "hidden";

export interface FmRoleAttribute {
  name: string; // e.g., "Passing Range", "Composure"
  category: FmAttributeCategory;
  weight: number; // e.g., 3 for primary, 2 for secondary, 1 for tertiary
}

export interface FmRole {
  name: string;
  description: string;
  positionType: string; // e.g., "DM", "CM", "CF"
  attributes: FmRoleAttribute[];
}

export const FM_ROLES: FmRole[] = [
  // DM Roles
  {
    name: "Defensive Midfielder",
    description: "A deep-lying midfielder focused on breaking up play and distributing simply.",
    positionType: "DM",
    attributes: [
      { name: "Defensive Awareness", category: "tactical", weight: 3 },
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Strength", category: "physical", weight: 2 },
    ],
  },
  {
    name: "Deep-Lying Playmaker",
    description: "Controls the tempo of the game from deep, dictating play with a wide range of passes.",
    positionType: "DM",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Composure", category: "mentalPsychology", weight: 3 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Defensive Awareness", category: "tactical", weight: 1 },
    ],
  },
  // CM Roles
  {
    name: "Box-to-Box Midfielder",
    description: "Covers a lot of ground, contributing to both attack and defence.",
    positionType: "CM",
    attributes: [
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Finishing", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Advanced Playmaker",
    description: "Operates in the space between midfield and attack, creating chances.",
    positionType: "CM",
    attributes: [
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
    ],
  },
  // CF Roles
  {
    name: "Complete Forward",
    description: "Combines the attributes of a Target Man, Poacher, and Deep-Lying Forward.",
    positionType: "CF",
    attributes: [
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Strength", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Passing Range", category: "technical", weight: 1 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
    ],
  },
  {
    name: "Poacher",
    description: "Stays on the shoulder of the last defender, looking for quick finishes.",
    positionType: "CF",
    attributes: [
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
    ],
  },
  // RW/LW Roles (Winger)
  {
    name: "Winger",
    description: "Stays wide, runs at defenders, and delivers crosses or cuts inside.",
    positionType: "RW", // Applicable to LW as well
    attributes: [
      { name: "Dribbling", category: "technical", weight: 3 },
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Crossing", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Work Rate", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Inside Forward",
    description: "Cuts inside from the wing to shoot or create chances.",
    positionType: "RW", // Applicable to LW as well
    attributes: [
      { name: "Dribbling", category: "technical", weight: 3 },
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
    ],
  },
  // CB Roles
  {
    name: "Central Defender",
    description: "A no-nonsense defender focused on winning the ball and clearing danger.",
    positionType: "CB",
    attributes: [
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Defensive Awareness", category: "tactical", weight: 3 },
      { name: "Strength", category: "physical", weight: 3 },
      { name: "Heading", category: "technical", weight: 2 },
      { name: "Positioning", category: "tactical", weight: 2 },
      { name: "Composure", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Ball-Playing Defender",
    description: "A central defender who also initiates attacks with accurate passes.",
    positionType: "CB",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Composure", category: "mentalPsychology", weight: 3 },
      { name: "Defensive Awareness", category: "tactical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Vision", category: "tactical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 1 },
    ],
  },
  // AM Roles
  {
    name: "Attacking Midfielder",
    description: "Plays behind the striker, linking midfield and attack, scoring and assisting.",
    positionType: "AM",
    attributes: [
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "Finishing", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
    ],
  },
  {
    name: "Shadow Striker",
    description: "An attacking midfielder who pushes forward to act as a second striker.",
    positionType: "AM",
    attributes: [
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
    ],
  },
  // LB/RB Roles (Full-Back)
  {
    name: "Full-Back",
    description: "Provides defensive cover and supports attacks down the flanks.",
    positionType: "LB", // Applicable to RB as well
    attributes: [
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Defensive Awareness", category: "tactical", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Crossing", category: "technical", weight: 1 },
      { name: "Work Rate", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Wing-Back",
    description: "More attacking than a Full-Back, providing width and crosses.",
    positionType: "LB", // Applicable to RB as well
    attributes: [
      { name: "Crossing", category: "technical", weight: 3 },
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
    ],
  },
  // GK Roles
  {
    name: "Goalkeeper",
    description: "Traditional goalkeeper, focused on shot-stopping and basic distribution.",
    positionType: "GK",
    attributes: [
      { name: "Shot Stopping", category: "technical", weight: 3 },
      { name: "Reflexes", category: "physical", weight: 3 },
      { name: "Handling", category: "technical", weight: 3 },
      { name: "Command of Area", category: "tactical", weight: 2 },
      { name: "Communication", category: "mentalPsychology", weight: 2 },
    ],
  },
  {
    name: "Sweeper Keeper (Support)",
    description: "Acts as an extra defender, sweeping up through balls and distributing quickly.",
    positionType: "GK",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "Shot Stopping", category: "technical", weight: 2 },
    ],
  },

  // NEW ROLES START HERE

  // 2. Centralni bekovi (CB)
  {
    name: "Advanced Centre-Back",
    description: "A centre-back who steps into the defensive midfield zone in possession, acting as a libero/stopper in build-up.",
    positionType: "CB",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 1 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Marking", category: "tactical", weight: 2 },
      { name: "Concentration", category: "mentalPsychology", weight: 1 },
      { name: "Stamina", category: "physical", weight: 1 },
      { name: "Work Rate", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Overlapping Centre-Back",
    description: "A centre-back who pushes high and wide like a 'pseudo wing-back' in possession.",
    positionType: "CB",
    attributes: [
      { name: "Acceleration", category: "physical", weight: 3 },
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "Crossing", category: "technical", weight: 1 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Marking", category: "tactical", weight: 2 },
      { name: "Aggression", category: "mentalPsychology", weight: 1 },
      { name: "Bravery", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Stopping Wide CB",
    description: "Plays as a classic Wide CB, with an emphasis on aggressively stepping forward to intercept attacks.",
    positionType: "CB",
    attributes: [
      { name: "Aggression", category: "mentalPsychology", weight: 3 },
      { name: "Bravery", category: "mentalPsychology", weight: 3 },
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
    ],
  },
  {
    name: "Covering Wide CB",
    description: "Plays as a classic Wide CB, maintaining a deeper position to cover space behind the defensive line.",
    positionType: "CB",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Concentration", category: "mentalPsychology", weight: 2 },
    ],
  },

  // 3. Bekovi i wing-bekovi (LB/RB) - Using 'LB' as generic
  {
    name: "Holding Full-Back",
    description: "A full-back who stays deeper when the rest of the team presses, protecting against counter-attacks on their flank.",
    positionType: "LB",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Marking", category: "tactical", weight: 3 },
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Concentration", category: "mentalPsychology", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
      { name: "Acceleration", category: "physical", weight: 1 },
      { name: "Pace", category: "physical", weight: 1 },
    ],
  },
  {
    name: "Inside Full-Back",
    description: "A full-back who moves infield in possession, forming a back three with centre-backs or an additional defensive midfielder.",
    positionType: "LB",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Stamina", category: "physical", weight: 1 },
      { name: "Work Rate", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Pressing Full-Back",
    description: "A full-back who aggressively presses opposing wingers/full-backs in a high pressing system.",
    positionType: "LB",
    attributes: [
      { name: "Aggression", category: "mentalPsychology", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 1 },
      { name: "Marking", category: "tactical", weight: 1 },
      { name: "Positioning", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Holding Wing-Back",
    description: "A wing-back who stays deeper in defense instead of pushing high, providing better 'rest defence' on the flank.",
    positionType: "LB",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Marking", category: "tactical", weight: 3 },
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Concentration", category: "mentalPsychology", weight: 2 },
      { name: "Stamina", category: "physical", weight: 2 },
    ],
  },
  {
    name: "Inside Wing-Back",
    description: "A wing-back who moves centrally in possession (like an inverted full-back), and can cover the half-space in defense.",
    positionType: "LB",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Technique", category: "technical", weight: 3 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Vision", category: "tactical", weight: 2 },
      { name: "Stamina", category: "physical", weight: 1 },
      { name: "Work Rate", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Playmaking Wing-Back",
    description: "A wing-back who acts as a primary creator from the flank, focusing more on passing than running and crossing.",
    positionType: "LB",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Technique", category: "technical", weight: 3 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Vision", category: "tactical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "Flair", category: "mentalPsychology", weight: 1 },
      { name: "Crossing", category: "technical", weight: 1 },
      { name: "Stamina", category: "physical", weight: 1 },
    ],
  },
  {
    name: "Advanced Wing-Back",
    description: "An extremely offensive wing-back, practically a wide midfielder/winger with minimal defensive duties.",
    positionType: "LB",
    attributes: [
      { name: "Acceleration", category: "physical", weight: 3 },
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "Crossing", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 1 },
      { name: "Anticipation", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Pressing Wing-Back",
    description: "A wing-back specialized in high pressing on the flank.",
    positionType: "LB",
    attributes: [
      { name: "Aggression", category: "mentalPsychology", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 1 },
      { name: "Positioning", category: "tactical", weight: 1 },
    ],
  },

  // 4. Defanzivni vezni (DM)
  {
    name: "Dropping DM",
    description: "A defensive midfielder who drops into the defensive line under pressure, a variant of a half-back triggered by pressing.",
    positionType: "DM",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Decision Making", category: "tactical", weight: 2 },
      { name: "Marking", category: "tactical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Bravery", category: "mentalPsychology", weight: 1 },
      { name: "Passing Range", category: "technical", weight: 1 },
      { name: "Composure", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Screening DM",
    description: "A classic 'screening 6' who blocks passing lanes and intercepts passes through the middle.",
    positionType: "DM",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Concentration", category: "mentalPsychology", weight: 2 },
      { name: "Teamwork", category: "mentalPsychology", weight: 2 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
      { name: "Tackling", category: "technical", weight: 1 },
      { name: "Marking", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Wide Covering DM",
    description: "A defensive midfielder who shifts wide to cover aggressive full-backs/wing-backs.",
    positionType: "DM",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 1 },
      { name: "Marking", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Pressing DM",
    description: "A defensive midfielder who steps forward to press opposing central/attacking midfielders.",
    positionType: "DM",
    attributes: [
      { name: "Aggression", category: "mentalPsychology", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Positioning", category: "tactical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 1 },
      { name: "Anticipation", category: "tactical", weight: 1 },
    ],
  },

  // 5. Centralni vezni (CM)
  {
    name: "Box-to-Box Playmaker",
    description: "A hybrid of a Box-to-Box midfielder and a playmaker, covering ground and creating from deep/half-space.",
    positionType: "CM",
    attributes: [
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Natural Fitness", category: "physical", weight: 2 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 1 },
      { name: "Vision", category: "tactical", weight: 1 },
      { name: "Composure", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Channel Midfielder",
    description: "A central midfielder who attacks the channels between full-back and centre-back, performing under/overlaps with wingers.",
    positionType: "CM",
    attributes: [
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Technique", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Midfield Playmaker",
    description: "A central creator positioned slightly higher/wider than a Deep-Lying Playmaker, linking defensive and attacking midfield.",
    positionType: "CM",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Technique", category: "technical", weight: 3 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Vision", category: "tactical", weight: 2 },
      { name: "Flair", category: "mentalPsychology", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 1 },
      { name: "Composure", category: "mentalPsychology", weight: 1 },
      { name: "Balance", category: "physical", weight: 1 },
    ],
  },
  {
    name: "Pressing CM",
    description: "A central midfielder focused on pressing in the middle, with a more 'ball-winner' mentality.",
    positionType: "CM",
    attributes: [
      { name: "Aggression", category: "mentalPsychology", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Positioning", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Screening CM",
    description: "A central midfielder who protects the central zone in front of the defense.",
    positionType: "CM",
    attributes: [
      { name: "Positioning", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Marking", category: "tactical", weight: 2 },
      { name: "Concentration", category: "mentalPsychology", weight: 1 },
      { name: "Teamwork", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Wide Covering CM",
    description: "A central midfielder who shifts laterally to close down the half-space and the channel behind the winger.",
    positionType: "CM",
    attributes: [
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Positioning", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
    ],
  },

  // 6. Wide / “wide central” vezni (RW/LW) - Using 'RW' as generic
  {
    name: "Tracking Wide Midfielder",
    description: "A wide midfielder who deeply tracks the opponent's full-back/winger.",
    positionType: "RW",
    attributes: [
      { name: "Marking", category: "tactical", weight: 3 },
      { name: "Tackling", category: "technical", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 2 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Teamwork", category: "mentalPsychology", weight: 2 },
      { name: "Positioning", category: "tactical", weight: 1 },
      { name: "Anticipation", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Wide Central Midfielder",
    description: "A central midfielder who plays wide in the half-space, acting as an axis between the central midfielder and winger.",
    positionType: "RW",
    attributes: [
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 1 },
      { name: "Vision", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Wide Outlet Midfielder",
    description: "A wide midfielder who stays high as a counter-outlet, with less defensive responsibility.",
    positionType: "RW",
    attributes: [
      { name: "Acceleration", category: "physical", weight: 3 },
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Technique", category: "technical", weight: 1 },
      { name: "Finishing", category: "technical", weight: 1 },
    ],
  },

  // 7. Attacking midfield (’10’ zona) (AM)
  {
    name: "Tracking AM",
    description: "An attacking midfielder who drops deeper in defense, almost acting as a third central midfielder.",
    positionType: "AM",
    attributes: [
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Teamwork", category: "mentalPsychology", weight: 2 },
      { name: "Positioning", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Central Outlet AM",
    description: "A 'number 10' who stays high and doesn't drop back much, primarily a counter-attacking option through the middle.",
    positionType: "AM",
    attributes: [
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 3 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Composure", category: "mentalPsychology", weight: 1 },
      { name: "Decision Making", category: "tactical", weight: 1 },
      { name: "Finishing", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Splitting Outlet AM",
    description: "An attacking midfielder who moves wide/into the half-space during transitions.",
    positionType: "AM",
    attributes: [
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Technique", category: "technical", weight: 1 },
      { name: "Crossing", category: "technical", weight: 1 },
      { name: "Finishing", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Free Role",
    description: "A completely free creator, roaming across the pitch to create numerical superiorities and disrupt opponent's structure.",
    positionType: "AM",
    attributes: [
      { name: "Flair", category: "mentalPsychology", weight: 3 },
      { name: "Vision", category: "tactical", weight: 3 },
      { name: "Technique", category: "technical", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
      { name: "Stamina", category: "physical", weight: 1 },
      { name: "Work Rate", category: "mentalPsychology", weight: 1 },
    ],
  },

  // 8. Winger / wide forward zona (RW/LW) - Using 'RW' as generic
  {
    name: "Half-Space Winger",
    description: "A winger who moves into the half-space but starts wider, focusing more on combination play than a 'pure inside' role.",
    positionType: "RW",
    attributes: [
      { name: "Dribbling", category: "technical", weight: 3 },
      { name: "Technique", category: "technical", weight: 3 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
      { name: "Passing Range", category: "technical", weight: 1 },
      { name: "Vision", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Inside Winger",
    description: "Similar to a Half-Space Winger, but even more central, behaving more like an inside forward from an attacking midfield stratum.",
    positionType: "RW",
    attributes: [
      { name: "Dribbling", category: "technical", weight: 3 },
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Flair", category: "mentalPsychology", weight: 1 },
      { name: "Composure", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Inverting Outlet Winger",
    description: "An outlet winger who stays high and moves towards the center on the counter-attack.",
    positionType: "RW",
    attributes: [
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Finishing", category: "technical", weight: 1 },
      { name: "Technique", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Tracking Winger",
    description: "A winger who deeply tracks the opponent's full-back, often used in 4-4-2/4-5-1 blocks.",
    positionType: "RW",
    attributes: [
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Teamwork", category: "mentalPsychology", weight: 2 },
      { name: "Marking", category: "tactical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 2 },
      { name: "Acceleration", category: "physical", weight: 1 },
      { name: "Pace", category: "physical", weight: 1 },
    ],
  },
  {
    name: "Wide Outlet Winger",
    description: "A wide counter-outlet winger who stays completely wide and high, with almost no defensive work.",
    positionType: "RW",
    attributes: [
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 3 },
      { name: "Dribbling", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "Crossing", category: "technical", weight: 1 },
      { name: "Finishing", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Wide Playmaker",
    description: "A creator from the flank: draws the ball inside to create space for the full-back.",
    positionType: "RW",
    attributes: [
      { name: "Passing Range", category: "technical", weight: 3 },
      { name: "Technique", category: "technical", weight: 3 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Vision", category: "tactical", weight: 2 },
      { name: "Flair", category: "mentalPsychology", weight: 2 },
      { name: "Decision Making", category: "tactical", weight: 1 },
      { name: "Off-Ball Movement", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Wide Forward",
    description: "A wide attacker who moves into the penalty area – a hybrid winger/striker.",
    positionType: "RW",
    attributes: [
      { name: "Finishing", category: "technical", weight: 3 },
      { name: "Composure", category: "mentalPsychology", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Technique", category: "technical", weight: 1 },
    ],
  },

  // 9. Napadači (CF)
  {
    name: "Half-Space Forward",
    description: "A forward who attacks the half-space from a wider position, closer to a wide forward than a classic number nine.",
    positionType: "CF",
    attributes: [
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Acceleration", category: "physical", weight: 2 },
      { name: "Pace", category: "physical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Technique", category: "technical", weight: 1 },
      { name: "Finishing", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Channel Forward",
    description: "A striker specialized in running into the channels between full-back and centre-back, great for asymmetrical attacks.",
    positionType: "CF",
    attributes: [
      { name: "Acceleration", category: "physical", weight: 3 },
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Stamina", category: "physical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Technique", category: "technical", weight: 1 },
      { name: "Crossing", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Second Striker",
    description: "A 'number 10.5' behind the main striker – linking play and scoring goals from deep.",
    positionType: "CF",
    attributes: [
      { name: "Off-Ball Movement", category: "tactical", weight: 3 },
      { name: "Anticipation", category: "tactical", weight: 3 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Technique", category: "technical", weight: 2 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Finishing", category: "technical", weight: 1 },
      { name: "Composure", category: "mentalPsychology", weight: 1 },
    ],
  },
  {
    name: "Central Outlet Centre Forward",
    description: "A centre-forward who stays high and central in defense – a primary 'out ball' for counter-attacks.",
    positionType: "CF",
    attributes: [
      { name: "Strength", category: "physical", weight: 3 },
      { name: "Balance", category: "physical", weight: 3 },
      { name: "First Touch", category: "technical", weight: 2 },
      { name: "Composure", category: "mentalPsychology", weight: 2 },
      { name: "Passing Range", category: "technical", weight: 2 },
      { name: "Off-Ball Movement", category: "tactical", weight: 1 },
      { name: "Anticipation", category: "tactical", weight: 1 },
    ],
  },
  {
    name: "Splitting Outlet Centre Forward",
    description: "An outlet centre-forward who moves wide in defense/on the counter to stretch the opponent's backline.",
    positionType: "CF",
    attributes: [
      { name: "Acceleration", category: "physical", weight: 3 },
      { name: "Pace", category: "physical", weight: 3 },
      { name: "Off-Ball Movement", category: "tactical", weight: 2 },
      { name: "Anticipation", category: "tactical", weight: 2 },
      { name: "Dribbling", category: "technical", weight: 1 },
      { name: "Crossing", category: "technical", weight: 1 },
      { name: "Finishing", category: "technical", weight: 1 },
    ],
  },
  {
    name: "Tracking Centre Forward",
    description: "A centre-forward who drops deep in defense, almost acting as an additional midfielder defensively.",
    positionType: "CF",
    attributes: [
      { name: "Work Rate", category: "mentalPsychology", weight: 3 },
      { name: "Stamina", category: "physical", weight: 3 },
      { name: "Teamwork", category: "mentalPsychology", weight: 2 },
      { name: "Positioning", category: "tactical", weight: 2 },
      { name: "Tackling", category: "technical", weight: 1 },
      { name: "Anticipation", category: "tactical", weight: 1 },
      { name: "Off-Ball Movement", category: "tactical", weight: 1 },
    ],
  },
];

// Helper function to get attributes by category
export const getAttributesByCategory = (player: Player, category: FmAttributeCategory): PlayerAttribute[] => {
  switch (category) {
    case "technical": return player.technical;
    case "tactical": return player.tactical;
    case "physical": return player.physical;
    case "mentalPsychology": return player.mentalPsychology;
    case "setPieces": return player.setPieces;
    case "hidden": return player.hidden;
    default: return [];
  }
};

// Mapping of specific pitch positions to general FmRole position types
const positionTypeMapping: { [key: string]: string } = {
  "LCB": "CB", "RCB": "CB", "CB": "CB",
  "LDM": "DM", "RDM": "DM", "CDM": "DM", // Map CDM to DM
  "LCM": "CM", "RCM": "CM", "CM": "CM",
  "LW": "RW", "RW": "RW",
  "LB": "LB", "RB": "LB",
  "LWB": "LB", "RWB": "LB",
  "CAM": "AM", "AM": "AM", // Map AM to AM
  "GK": "GK",
  "CF_CENTRAL": "CF", "CF_LEFT": "CF", "CF_RIGHT": "CF",
  "CF": "CF",
};

// Function to calculate role compatibility
export const calculateRoleCompatibility = (player: Player, role: FmRole): number => {
  let totalScore = 0;
  let maxPossibleScore = 0;

  role.attributes.forEach(requiredAttr => {
    const playerCategoryAttrs = getAttributesByCategory(player, requiredAttr.category);
    const playerAttr = playerCategoryAttrs.find(attr => attr.name === requiredAttr.name);

    const playerRating = playerAttr ? playerAttr.rating : 0; // Assume 0 if attribute not found

    // Score for this attribute: player's rating * attribute weight
    totalScore += playerRating * requiredAttr.weight;
    // Max possible score for this attribute: max rating (10) * attribute weight
    maxPossibleScore += 10 * requiredAttr.weight;
  });

  if (maxPossibleScore === 0) return 0; // Avoid division by zero

  return Math.round((totalScore / maxPossibleScore) * 100);
};

// Function to get roles for a specific position type, now using the mapping
export const getRolesForPosition = (pitchPositionType: string): FmRole[] => {
  const generalPositionType = positionTypeMapping[pitchPositionType] || pitchPositionType;
  return FM_ROLES.filter(role => role.positionType === generalPositionType);
};