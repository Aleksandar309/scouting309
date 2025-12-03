"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Plus, ChevronLeft } from 'lucide-react'; // Added ChevronLeft icon

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Player } from "@/types/player";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AddToShortlistDialog from '@/components/AddToShortlistDialog';

export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Mats Wieffer",
    team: "Feyenoord",
    positions: ["CDM", "CM"],
    positionsData: [
      { name: "CDM", type: "natural", rating: 9 },
      { name: "CM", type: "alternative", rating: 8 },
      { name: "CB", type: "tertiary", rating: 6 },
    ],
    priorityTarget: true,
    criticalPriority: true,
    nationality: "Netherlands",
    age: 26,
    value: "€25M",
    footed: "Right Footed",
    details: {
      height: "188 cm",
      weight: "78 kg",
      league: "Eredivisie",
      contractExpiry: "Jun 2027",
      wageDemands: "60-80k/week",
      agent: "SEG Football",
      notes: "Elite ball-winning midfielder. Perfect profile for Brighton's system. Strong in duels, excellent reading of the game.",
    },
    scoutingProfile: {
      overall: 9,
      potential: 9,
      brightonFit: 10,
      currentAbility: 8,
      potentialAbility: 9,
      teamFit: 9,
    },
    technical: [
      { name: "First Touch", rating: 9 },
      { name: "Passing Range", rating: 9 },
      { name: "Ball Striking", rating: 8 },
      { name: "Dribbling", rating: 7 },
      { name: "Crossing", rating: 6 },
      { name: "Aerial Ability", rating: 8 },
      { name: "Tackling", rating: 8 },
      { name: "Finishing", rating: 7 },
    ],
    tactical: [
      { name: "Positioning", rating: 9 },
      { name: "Decision Making", rating: 9 },
      { name: "Game Intelligence", rating: 9 },
      { name: "Off-Ball Movement", rating: 9 },
      { name: "Pressing", rating: 9 },
      { name: "Defensive Awareness", rating: 9 },
      { name: "Vision", rating: 9 },
    ],
    physical: [
      { name: "Pace", rating: 8 },
      { name: "Acceleration", rating: 8 },
      { name: "Strength", rating: 9 },
      { name: "Stamina", rating: 9 },
      { name: "Agility", rating: 8 },
      { name: "Recovery", rating: 9 },
    ],
    mentalPsychology: [
      { name: "Composure", rating: 9 },
      { name: "Leadership", rating: 9 },
      { name: "Work Rate", rating: 9 },
      { name: "Concentration", rating: 9 },
      { name: "Coachability", rating: 9 },
      { name: "Resilience", rating: 9 },
    ],
    setPieces: [
      { name: "Corners", rating: 7 },
      { name: "Free Kicks", rating: 8 },
      { name: "Penalties", rating: 9 },
      { name: "Long Throws", rating: 6 },
      { name: "Defending corners", rating: 7 },
    ],
    hidden: [
      { name: "Consistency", rating: 15 },
      { name: "Important Matches", rating: 16 },
      { name: "Versatility", rating: 14 },
      { name: "Dirtiness", rating: 8 },
      { name: "Injury Proneness", rating: 5 },
      { name: "Adaptability", rating: 17 },
      { name: "Ambition", rating: 18 },
      { name: "Loyalty", rating: 15 },
    ],
    keyStrengths: [
      "Exceptional reading of the game and anticipation.",
      "Wins possession in dangerous areas consistently.",
      "Distribution under pressure is elite - rarely loses the ball.",
      "Commands the midfield zone with authority.",
    ],
    areasForDevelopment: [
      "Could improve final third creativity.",
      "Occasional tendency to be over-aggressive in challenges.",
      "Long-range shooting needs work.",
    ],
    scoutingReports: [
      {
        id: "rep1",
        date: "Dec 2, 2025",
        scout: "Mia Scout",
        rating: 10,
        title: "Initial Assessment",
        keyStrengths: "Excellent vision, strong passing, good leadership.",
        areasForDevelopment: "Needs to improve aerial duels, occasional lapses in concentration."
      },
      {
        id: "rep2",
        date: "Nov 10, 2024",
        scout: "James Clark",
        rating: 9,
        title: "Feyenoord vs Ajax Match Report",
        keyStrengths: "Dominant in midfield, crucial interceptions, calm under pressure.",
        areasForDevelopment: "Sometimes holds onto the ball too long, needs to release quicker."
      },
    ],
  },
  {
    id: "2",
    name: "Mohammed Kudus",
    team: "West Ham",
    positions: ["CAM", "RW"],
    positionsData: [
      { name: "CAM", type: "natural", rating: 9 },
      { name: "RW", type: "natural", rating: 9 },
      { name: "ST", type: "alternative", rating: 8 },
    ],
    priorityTarget: false,
    criticalPriority: false,
    nationality: "Ghana",
    age: 23,
    value: "€45M",
    footed: "Left Footed",
    details: {
      height: "177 cm",
      weight: "71 kg",
      league: "Premier League",
      contractExpiry: "Jun 2028",
      wageDemands: "100-120k/week",
      agent: "N/A",
      notes: "Explosive attacker with great dribbling and shooting. Can play across the front line.",
    },
    scoutingProfile: {
      overall: 8,
      potential: 9,
      brightonFit: 8,
      currentAbility: 8,
      potentialAbility: 9,
      teamFit: 8,
    },
    technical: [
      { name: "First Touch", rating: 8 },
      { name: "Passing Range", rating: 7 },
      { name: "Ball Striking", rating: 9 },
      { name: "Dribbling", rating: 9 },
      { name: "Crossing", rating: 7 },
      { name: "Aerial Ability", rating: 6 },
      { name: "Tackling", rating: 5 },
      { name: "Finishing", rating: 8 },
    ],
    tactical: [
      { name: "Positioning", rating: 7 },
      { name: "Decision Making", rating: 8 },
      { name: "Game Intelligence", rating: 8 },
      { name: "Off-Ball Movement", rating: 9 },
      { name: "Pressing", rating: 7 },
      { name: "Defensive Awareness", rating: 6 },
      { name: "Vision", rating: 8 },
    ],
    physical: [
      { name: "Pace", rating: 9 },
      { name: "Acceleration", rating: 9 },
      { name: "Strength", rating: 7 },
      { name: "Stamina", rating: 8 },
      { name: "Agility", rating: 9 },
      { name: "Recovery", rating: 8 },
    ],
    mentalPsychology: [
      { name: "Composure", rating: 8 },
      { name: "Leadership", rating: 6 },
      { name: "Work Rate", rating: 8 },
      { name: "Concentration", rating: 7 },
      { name: "Coachability", rating: 8 },
      { name: "Resilience", rating: 8 },
    ],
    setPieces: [
      { name: "Corners", rating: 6 },
      { name: "Free Kicks", rating: 7 },
      { name: "Penalties", rating: 7 },
      { name: "Long Throws", rating: 5 },
      { name: "Defending corners", rating: 6 },
    ],
    hidden: [
      { name: "Consistency", rating: 14 },
      { name: "Important Matches", rating: 15 },
      { name: "Versatility", rating: 16 },
      { name: "Dirtiness", rating: 7 },
      { name: "Injury Proneness", rating: 6 },
      { name: "Adaptability", rating: 15 },
      { name: "Ambition", rating: 17 },
      { name: "Loyalty", rating: 12 },
    ],
    keyStrengths: [
      "Explosive dribbling and close control.",
      "Powerful long-range shooting.",
      "Versatile across attacking positions.",
      "Good off-ball movement in the final third.",
    ],
    areasForDevelopment: [
      "Consistency in defensive contributions.",
      "Decision-making in crowded areas.",
      "Aerial duels.",
      "Passing accuracy under pressure.",
    ],
    scoutingReports: [
      {
        id: "rep3",
        date: "Jul 1, 2024",
        scout: "James Clark",
        rating: 8,
        title: "Initial Assessment",
        keyStrengths: "Dribbling, shooting, versatility.",
        areasForDevelopment: "Defensive work rate."
      },
    ],
  },
  {
    id: "3",
    name: "Florian Wirtz",
    team: "Bayer Leverkusen",
    positions: ["CAM", "LW"],
    positionsData: [
      { name: "CAM", type: "natural", rating: 10 },
      { name: "LW", type: "natural", rating: 9 },
      { name: "CM", type: "alternative", rating: 8 },
    ],
    priorityTarget: true,
    criticalPriority: true,
    nationality: "Germany",
    age: 21,
    value: "€100M",
    footed: "Right Footed",
    details: {
      height: "177 cm",
      weight: "70 kg",
      league: "Bundesliga",
      contractExpiry: "Jun 2027",
      wageDemands: "150-200k/week",
      agent: "N/A",
      notes: "World-class talent, incredible vision and passing. Future Ballon d'Or contender.",
    },
    scoutingProfile: {
      overall: 10,
      potential: 10,
      brightonFit: 9,
      currentAbility: 9,
      potentialAbility: 10,
      teamFit: 9,
    },
    technical: [
      { name: "First Touch", rating: 10 },
      { name: "Passing Range", rating: 10 },
      { name: "Ball Striking", rating: 9 },
      { name: "Dribbling", rating: 9 },
      { name: "Crossing", rating: 8 },
      { name: "Aerial Ability", rating: 5 },
      { name: "Tackling", rating: 6 },
      { name: "Finishing", rating: 9 },
    ],
    tactical: [
      { name: "Positioning", rating: 9 },
      { name: "Decision Making", rating: 10 },
      { name: "Game Intelligence", rating: 10 },
      { name: "Off-Ball Movement", rating: 9 },
      { name: "Pressing", rating: 8 },
      { name: "Defensive Awareness", rating: 7 },
      { name: "Vision", rating: 10 },
    ],
    physical: [
      { name: "Pace", rating: 8 },
      { name: "Acceleration", rating: 8 },
      { name: "Strength", rating: 6 },
      { name: "Stamina", rating: 8 },
      { name: "Agility", rating: 9 },
      { name: "Recovery", rating: 8 },
    ],
    mentalPsychology: [
      { name: "Composure", rating: 9 },
      { name: "Leadership", rating: 7 },
      { name: "Work Rate", rating: 8 },
      { name: "Concentration", rating: 9 },
      { name: "Coachability", rating: 9 },
      { name: "Resilience", rating: 9 },
    ],
    setPieces: [
      { name: "Corners", rating: 8 },
      { name: "Free Kicks", rating: 9 },
      { name: "Penalties", rating: 8 },
      { name: "Long Throws", rating: 5 },
      { name: "Defending corners", rating: 6 },
    ],
    hidden: [
      { name: "Consistency", rating: 18 },
      { name: "Important Matches", rating: 19 },
      { name: "Versatility", rating: 17 },
      { name: "Dirtiness", rating: 6 },
      { name: "Injury Proneness", rating: 4 },
      { name: "Adaptability", rating: 18 },
      { name: "Ambition", rating: 20 },
      { name: "Loyalty", rating: 14 },
    ],
    keyStrengths: [
      "Exceptional vision and passing range.",
      "Elite dribbling and close control.",
      "High football IQ and decision-making.",
      "Goal threat from midfield.",
    ],
    areasForDevelopment: [
      "Physical strength and aerial ability.",
      "Defensive contributions.",
      "Can sometimes try too much on his own.",
    ],
    scoutingReports: [
      {
        id: "rep4",
        date: "Jun 15, 2024",
        scout: "Mia Scout",
        rating: 10,
        title: "Bundesliga Masterclass",
        keyStrengths: "Vision, passing, goal-scoring.",
        areasForDevelopment: "Physicality."
      },
    ],
  },
  {
    id: "4",
    name: "Levi Colwill",
    team: "Chelsea",
    positions: ["CB", "LB"],
    positionsData: [
      { name: "CB", type: "natural", rating: 9 },
      { name: "LB", type: "alternative", rating: 8 },
    ],
    priorityTarget: false,
    criticalPriority: false,
    nationality: "England",
    age: 21,
    value: "€50M",
    footed: "Left Footed",
    details: {
      height: "187 cm",
      weight: "80 kg",
      league: "Premier League",
      contractExpiry: "Jun 2029",
      wageDemands: "80-100k/week",
      agent: "N/A",
      notes: "Strong, left-footed center-back. Excellent on the ball and good aerial presence.",
    },
    scoutingProfile: {
      overall: 8,
      potential: 9,
      brightonFit: 9,
      currentAbility: 8,
      potentialAbility: 9,
      teamFit: 9,
    },
    technical: [
      { name: "First Touch", rating: 8 },
      { name: "Passing Range", rating: 8 },
      { name: "Ball Striking", rating: 7 },
      { name: "Dribbling", rating: 7 },
      { name: "Crossing", rating: 6 },
      { name: "Aerial Ability", rating: 8 },
      { name: "Tackling", rating: 9 },
      { name: "Finishing", rating: 4 },
    ],
    tactical: [
      { name: "Positioning", rating: 9 },
      { name: "Decision Making", rating: 8 },
      { name: "Game Intelligence", rating: 8 },
      { name: "Off-Ball Movement", rating: 7 },
      { name: "Pressing", rating: 8 },
      { name: "Defensive Awareness", rating: 9 },
      { name: "Vision", rating: 7 },
    ],
    physical: [
      { name: "Pace", rating: 7 },
      { name: "Acceleration", rating: 7 },
      { name: "Strength", rating: 9 },
      { name: "Stamina", rating: 8 },
      { name: "Agility", rating: 7 },
      { name: "Recovery", rating: 8 },
    ],
    mentalPsychology: [
      { name: "Composure", rating: 8 },
      { name: "Leadership", rating: 7 },
      { name: "Work Rate", rating: 8 },
      { name: "Concentration", rating: 9 },
      { name: "Coachability", rating: 8 },
      { name: "Resilience", rating: 8 },
    ],
    setPieces: [
      { name: "Corners", rating: 5 },
      { name: "Free Kicks", rating: 6 },
      { name: "Penalties", rating: 5 },
      { name: "Long Throws", rating: 7 },
      { name: "Defending corners", rating: 9 },
    ],
    hidden: [
      { name: "Consistency", rating: 15 },
      { name: "Important Matches", rating: 14 },
      { name: "Versatility", rating: 16 },
      { name: "Dirtiness", rating: 7 },
      { name: "Injury Proneness", rating: 6 },
      { name: "Adaptability", rating: 16 },
      { name: "Ambition", rating: 16 },
      { name: "Loyalty", rating: 15 },
    ],
    keyStrengths: [
      "Strong in aerial duels and ground tackles.",
      "Excellent passing from the back.",
      "Good positional sense.",
      "Comfortable playing out from defence.",
    ],
    areasForDevelopment: [
      "Pace against quick attackers.",
      "Occasional lapses in concentration.",
      "Contribution in attacking phases from LB.",
    ],
    scoutingReports: [
      {
        id: "rep5",
        date: "May 20, 2024",
        scout: "David Lee",
        rating: 8,
        title: "Defensive Solidity",
        keyStrengths: "Tackling, passing, aerials.",
        areasForDevelopment: "Pace."
      },
    ],
  },
  {
    id: "5",
    name: "Evan Ferguson",
    team: "Brighton",
    positions: ["ST"],
    positionsData: [
      { name: "ST", type: "natural", rating: 9 },
      { name: "CAM", type: "alternative", rating: 7 },
    ],
    priorityTarget: false,
    criticalPriority: false,
    nationality: "Ireland",
    age: 19,
    value: "€60M",
    footed: "Right Footed",
    details: {
      height: "188 cm",
      weight: "80 kg",
      league: "Premier League",
      contractExpiry: "Jun 2029",
      wageDemands: "70-90k/week",
      agent: "N/A",
      notes: "Prolific young striker with great finishing and hold-up play.",
    },
    scoutingProfile: {
      overall: 8,
      potential: 10,
      brightonFit: 10,
      currentAbility: 8,
      potentialAbility: 10,
      teamFit: 10,
    },
    technical: [
      { name: "First Touch", rating: 8 },
      { name: "Passing Range", rating: 7 },
      { name: "Ball Striking", rating: 9 },
      { name: "Dribbling", rating: 7 },
      { name: "Crossing", rating: 6 },
      { name: "Aerial Ability", rating: 9 },
      { name: "Tackling", rating: 5 },
      { name: "Finishing", rating: 9 },
    ],
    tactical: [
      { name: "Positioning", rating: 9 },
      { name: "Decision Making", rating: 8 },
      { name: "Game Intelligence", rating: 8 },
      { name: "Off-Ball Movement", rating: 9 },
      { name: "Pressing", rating: 7 },
      { name: "Defensive Awareness", rating: 6 },
      { name: "Vision", rating: 7 },
    ],
    physical: [
      { name: "Pace", rating: 7 },
      { name: "Acceleration", rating: 7 },
      { name: "Strength", rating: 9 },
      { name: "Stamina", rating: 8 },
      { name: "Agility", rating: 7 },
      { name: "Recovery", rating: 8 },
    ],
    mentalPsychology: [
      { name: "Composure", rating: 8 },
      { name: "Leadership", rating: 6 },
      { name: "Work Rate", rating: 8 },
      { name: "Concentration", rating: 8 },
      { name: "Coachability", rating: 9 },
      { name: "Resilience", rating: 9 },
    ],
    setPieces: [
      { name: "Corners", rating: 5 },
      { name: "Free Kicks", rating: 6 },
      { name: "Penalties", rating: 8 },
      { name: "Long Throws", rating: 6 },
      { name: "Defending corners", rating: 7 },
    ],
    hidden: [
      { name: "Consistency", rating: 16 },
      { name: "Important Matches", rating: 17 },
      { name: "Versatility", rating: 14 },
      { name: "Dirtiness", rating: 6 },
      { name: "Injury Proneness", rating: 5 },
      { name: "Adaptability", rating: 17 },
      { name: "Ambition", rating: 19 },
      { name: "Loyalty", rating: 16 },
    ],
    keyStrengths: [
      "Exceptional finishing ability.",
      "Strong hold-up play and aerial presence.",
      "Good off-ball movement in the box.",
      "High potential for growth.",
    ],
    areasForDevelopment: [
      "Pace and acceleration.",
      "Link-up play outside the box.",
      "Defensive contributions.",
    ],
    scoutingReports: [
      {
        id: "rep6",
        date: "Apr 10, 2024",
        scout: "James Clark",
        rating: 9,
        title: "Future Star",
        keyStrengths: "Finishing, strength, potential.",
        areasForDevelopment: "Pace."
      },
    ],
  },
];

const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-white hover:bg-gray-700"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link to={`/player/${row.original.id}`} className="text-blue-400 hover:underline">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:bg-gray-700"
      >
        Team
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "positions",
    header: "Positions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.positions.map((pos) => (
          <Badge key={pos} variant="secondary" className="bg-gray-700 text-gray-200">
            {pos}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:bg-gray-700"
      >
        Nationality
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:bg-gray-700"
      >
        Age
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:bg-gray-700"
      >
        Value
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "scoutingProfile.overall",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:bg-gray-700"
      >
        Overall
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    id: "overallRating",
    cell: ({ row }) => {
      const rating = row.original.scoutingProfile.overall;
      const progressValue = Math.min(Math.max(rating * 10, 0), 100);
      return (
        <div className="flex items-center w-full">
          <Progress value={progressValue} className="h-2 w-full bg-gray-700" indicatorClassName="bg-blue-500" />
          <span className="ml-2 text-sm text-gray-200">{rating}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "scoutingProfile.potential",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:bg-gray-700"
      >
        Potential
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    id: "potentialRating",
    cell: ({ row }) => {
      const rating = row.original.scoutingProfile.potential;
      const progressValue = Math.min(Math.max(rating * 10, 0), 100);
      return (
        <div className="flex items-center w-full">
          <Progress value={progressValue} className="h-2 w-full bg-gray-700" indicatorClassName="bg-green-500" />
          <span className="ml-2 text-sm text-gray-200">{rating}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priorityTarget",
    header: "Priority",
    cell: ({ row }) => (
      row.getValue("priorityTarget") ? <Badge className="bg-yellow-600 text-white">Yes</Badge> : <Badge variant="secondary" className="bg-gray-700 text-gray-200">No</Badge>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const player = row.original;
      const [isDialogOpen, setIsDialogOpen] = React.useState(false);
      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <AddToShortlistDialog player={player} onClose={() => setIsDialogOpen(false)} />
        </Dialog>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

const PlayerDatabase: React.FC = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const table = useReactTable({
    data: mockPlayers,
    columns,
    getCoreRowModel: getCoreRowodel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Player Database</h1>

        <div className="rounded-md border border-gray-700 bg-gray-800">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-gray-700">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-gray-300">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-gray-700 hover:bg-gray-700"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-gray-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PlayerDatabase;