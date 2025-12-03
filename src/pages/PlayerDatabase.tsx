"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Plus, ChevronLeft, Table2, LayoutGrid } from 'lucide-react';

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import PlayerCard from '@/components/PlayerCard';
import { ThemeToggle } from "@/components/ThemeToggle";
import AddPlayerForm from '@/components/AddPlayerForm'; // New import
import { ALL_ATTRIBUTE_NAMES } from '@/utils/player-attributes'; // New import

interface PlayerDatabaseProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

// Helper function to find an attribute's rating across all categories
const getAttributeRating = (player: Player, attributeName: string): number => {
  const categories = [
    player.technical,
    player.tactical,
    player.physical,
    player.mentalPsychology,
    player.setPieces,
    player.hidden,
  ];

  for (const category of categories) {
    const attribute = category.find(attr => attr.name === attributeName);
    if (attribute) {
      return attribute.rating;
    }
  }
  return 0; // Default to 0 if not found
};

// List of all unique attributes to create columns for
const attributeColumns: ColumnDef<Player>[] = ALL_ATTRIBUTE_NAMES.map(attrName => ({
  accessorFn: (row) => getAttributeRating(row, attrName),
  id: attrName.replace(/\s/g, ''), // Create a unique ID for the column
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="text-white hover:bg-gray-700"
    >
      {attrName}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const rating = getAttributeRating(row.original, attrName);
    return <span className="text-gray-200">{rating}</span>;
  },
  enableSorting: true,
}));


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
  ...attributeColumns, // Add all dynamically generated attribute columns here
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const player = row.original;
      const [isShortlistDialogOpen, setIsShortlistDialogOpen] = React.useState(false);
      return (
        <Dialog open={isShortlistDialogOpen} onOpenChange={setIsShortlistDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <AddToShortlistDialog player={player} onClose={() => setIsShortlistDialogOpen(false)} />
        </Dialog>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

const PlayerDatabase: React.FC<PlayerDatabaseProps> = ({ players, setPlayers }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>(() => {
    // Load from localStorage or default to 'table'
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('playerDatabaseViewMode') as 'table' | 'card') || 'table';
    }
    return 'table';
  });
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = React.useState(false); // State for add player dialog

  React.useEffect(() => {
    // Save to localStorage whenever viewMode changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerDatabaseViewMode', viewMode);
    }
  }, [viewMode]);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setIsAddPlayerDialogOpen(false);
  };

  const table = useReactTable({
    data: players, // Use the state variable from props
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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Player Database</h1>
          <div className="flex items-center space-x-4">
            {/* Add Player Button */}
            <Dialog open={isAddPlayerDialogOpen} onOpenChange={setIsAddPlayerDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add New Player
                </Button>
              </DialogTrigger>
              <AddPlayerForm onAddPlayer={handleAddPlayer} onClose={() => setIsAddPlayerDialogOpen(false)} />
            </Dialog>

            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value: 'table' | 'card') => {
                if (value) setViewMode(value);
              }}
              className="bg-gray-800 rounded-md p-1 border border-gray-700"
            >
              <ToggleGroupItem value="table" aria-label="Toggle table view" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white text-gray-300 hover:bg-gray-700">
                <Table2 className="h-4 w-4 mr-2" /> Table View
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="Toggle card view" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white text-gray-300 hover:bg-gray-700">
                <LayoutGrid className="h-4 w-4 mr-2" /> Card View
              </ToggleGroupItem>
            </ToggleGroup>
            <ThemeToggle />
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="rounded-md border border-gray-700 bg-gray-800 overflow-x-auto">
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player) => ( // Use the state variable from props
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDatabase;