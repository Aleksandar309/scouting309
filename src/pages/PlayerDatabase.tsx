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
  getFilteredRowModel, // Import this
  ColumnFiltersState, // Import this
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
import AddPlayerForm from '@/components/AddPlayerForm';
import { ALL_ATTRIBUTE_NAMES } from '@/utils/player-attributes';
import { Input } from '@/components/ui/input'; // Import Input for filters

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
      className="text-foreground hover:bg-accent"
    >
      {attrName}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const rating = getAttributeRating(row.original, attrName);
    return <span className="text-foreground">{rating}</span>;
  },
  enableSorting: true,
}));


const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <TableHead className="sticky-column-header"> {/* Updated sticky classes */}
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-foreground hover:bg-accent"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
      );
    },
    cell: ({ row }) => (
      <TableCell className="sticky-column-cell"> {/* Updated sticky classes */}
        <Link to={`/player/${row.original.id}`} className="text-blue-400 hover:underline">
          {row.getValue("name")}
        </Link>
      </TableCell>
    ),
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent"
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
          <Badge key={pos} variant="secondary" className="bg-muted text-muted-foreground">
            {pos}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      const positions: string[] = row.getValue(columnId);
      return positions.some(pos => pos.toLowerCase().includes(filterValue.toLowerCase()));
    },
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent"
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
        className="text-foreground hover:bg-accent"
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
        className="text-foreground hover:bg-accent"
      >
        Value
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "scoutingProfile.currentAbility",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent"
      >
        Current Ability
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    id: "currentAbilityRating",
    cell: ({ row }) => {
      const rating = row.original.scoutingProfile.currentAbility;
      const progressValue = Math.min(Math.max(rating * 10, 0), 100);
      return (
        <div className="flex items-center w-full">
          <Progress value={progressValue} className="h-2 w-full bg-muted" indicatorClassName="bg-blue-500" />
          <span className="ml-2 text-sm text-foreground">{rating}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "scoutingProfile.potentialAbility",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent"
      >
        Potential Ability
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    id: "potentialAbilityRating",
    cell: ({ row }) => {
      const rating = row.original.scoutingProfile.potentialAbility;
      const progressValue = Math.min(Math.max(rating * 10, 0), 100);
      return (
        <div className="flex items-center w-full">
          <Progress value={progressValue} className="h-2 w-full bg-muted" indicatorClassName="bg-green-500" />
          <span className="ml-2 text-sm text-foreground">{rating}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priorityTarget",
    header: "Priority",
    cell: ({ row }) => (
      row.getValue("priorityTarget") ? <Badge className="bg-yellow-600 text-white">Yes</Badge> : <Badge variant="secondary" className="bg-muted text-muted-foreground">No</Badge>
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
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]); // New state for column filters
  const [globalFilter, setGlobalFilter] = React.useState(''); // New state for global filter
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
    onColumnFiltersChange: setColumnFilters, // Add this
    onGlobalFilterChange: setGlobalFilter,   // Add this
    getFilteredRowModel: getFilteredRowModel(), // Add this
    state: {
      sorting,
      columnFilters, // Add this
      globalFilter,  // Add this
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
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
              className="bg-muted rounded-md p-1 border border-border"
            >
              <ToggleGroupItem value="table" aria-label="Toggle table view" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-muted-foreground hover:bg-accent">
                <Table2 className="h-4 w-4 mr-2" /> Table View
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="Toggle card view" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-muted-foreground hover:bg-accent">
                <LayoutGrid className="h-4 w-4 mr-2" /> Card View
              </ToggleGroupItem>
            </ToggleGroup>
            <ThemeToggle />
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 p-4 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Filter Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Filter by name..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="bg-input border-border text-foreground"
            />
            <Input
              placeholder="Filter by team..."
              value={(table.getColumn("team")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("team")?.setFilterValue(event.target.value)
              }
              className="bg-input border-border text-foreground"
            />
            <Input
              placeholder="Filter by nationality..."
              value={(table.getColumn("nationality")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("nationality")?.setFilterValue(event.target.value)
              }
              className="bg-input border-border text-foreground"
            />
            <Input
              placeholder="Filter by position (e.g., CDM)..."
              value={(table.getColumn("positions")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("positions")?.setFilterValue(event.target.value)
              }
              className="bg-input border-border text-foreground"
            />
            {/* Global filter for general search */}
            <Input
              placeholder="Global search..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="bg-input border-border text-foreground lg:col-span-3"
            />
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="rounded-md border border-border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-border">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-foreground">
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
                      className="border-border hover:bg-accent"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-foreground">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDatabase;