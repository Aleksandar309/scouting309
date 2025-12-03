"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Plus } from 'lucide-react';

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

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Mats Wieffer",
    team: "Feyenoord",
    positions: ["CDM", "CM"],
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
    },
    technical: [], tactical: [], physical: [], mentalPsychology: [], keyStrengths: [], areasForDevelopment: [], scoutingReports: [],
  },
  {
    id: "2",
    name: "Mohammed Kudus",
    team: "West Ham",
    positions: ["CAM", "RW"],
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
    },
    technical: [], tactical: [], physical: [], mentalPsychology: [], keyStrengths: [], areasForDevelopment: [], scoutingReports: [],
  },
  {
    id: "3",
    name: "Florian Wirtz",
    team: "Bayer Leverkusen",
    positions: ["CAM", "LW"],
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
    },
    technical: [], tactical: [], physical: [], mentalPsychology: [], keyStrengths: [], areasForDevelopment: [], scoutingReports: [],
  },
  {
    id: "4",
    name: "Levi Colwill",
    team: "Chelsea",
    positions: ["CB", "LB"],
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
    },
    technical: [], tactical: [], physical: [], mentalPsychology: [], keyStrengths: [], areasForDevelopment: [], scoutingReports: [],
  },
  {
    id: "5",
    name: "Evan Ferguson",
    team: "Brighton",
    positions: ["ST"],
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
    },
    technical: [], tactical: [], physical: [], mentalPsychology: [], keyStrengths: [], areasForDevelopment: [], scoutingReports: [],
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

  const table = useReactTable({
    data: mockPlayers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
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