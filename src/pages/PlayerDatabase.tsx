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
  getFilteredRowModel,
  ColumnFiltersState,
  SortingFn, // Import SortingFn
} from '@tanstack/react-table';
import { ArrowUpDown, Plus, ChevronLeft, Table2, LayoutGrid, Filter, Search } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { POSITION_ORDER } from '@/utils/position-order'; // Import POSITION_ORDER

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

// Custom sorting function for positions
const positionSortFn: SortingFn<Player> = (rowA, rowB, columnId) => {
  const positionsA: string[] = rowA.getValue(columnId);
  const positionsB: string[] = rowB.getValue(columnId);

  const getEarliestPositionIndex = (playerPositions: string[]) => {
    let minIndex = Infinity;
    for (const pos of playerPositions) {
      const index = POSITION_ORDER.indexOf(pos);
      if (index !== -1 && index < minIndex) {
        minIndex = index;
      }
    }
    return minIndex;
  };

  const indexA = getEarliestPositionIndex(positionsA);
  const indexB = getEarliestPositionIndex(positionsB);

  if (indexA === indexB) {
    // Fallback to alphabetical if primary position is the same or not found
    return positionsA[0]?.localeCompare(positionsB[0] || '') || 0;
  }
  // Handle positions not in POSITION_ORDER by placing them at the end
  if (indexA === Infinity) return 1;
  if (indexB === Infinity) return -1;
  
  return indexA - indexB;
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
        <TableHead className="sticky-column-header">
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
      <TableCell className="sticky-column-cell">
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
    filterFn: (row, columnId, filterValue) => {
      const team: string = row.getValue(columnId);
      return team.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "positions",
    header: ({ column }) => ( // Make header sortable
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent"
      >
        Positions
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.positions.map((pos) => (
          <Badge key={pos} variant="secondary" className="bg-muted text-muted-foreground">
            {pos}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: true, // Enable sorting
    sortingFn: positionSortFn, // Use custom sorting function
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
    filterFn: (row, columnId, filterValue) => {
      const nationality: string = row.getValue(columnId);
      return nationality.toLowerCase().includes(filterValue.toLowerCase());
    },
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('playerDatabaseViewMode') as 'table' | 'card') || 'table';
    }
    return 'table';
  });
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = React.useState(false);

  // States for Popover open/close
  const [openNameFilter, setOpenNameFilter] = React.useState(false);
  const [openTeamFilter, setOpenTeamFilter] = React.useState(false);
  const [openNationalityFilter, setOpenNationalityFilter] = React.useState(false);
  const [openPositionFilter, setOpenPositionFilter] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerDatabaseViewMode', viewMode);
    }
  }, [viewMode]);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setIsAddPlayerDialogOpen(false);
  };

  const table = useReactTable({
    data: players,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Get unique values for autocomplete filters
  const uniqueTeams = React.useMemo(() => {
    const teams = new Set<string>();
    players.forEach(player => teams.add(player.team));
    return Array.from(teams).sort();
  }, [players]);

  const uniqueNationalities = React.useMemo(() => {
    const nationalities = new Set<string>();
    players.forEach(player => nationalities.add(player.nationality));
    return Array.from(nationalities).sort();
  }, [players]);

  const uniquePositions = React.useMemo(() => {
    const positions = new Set<string>();
    players.forEach(player => player.positions.forEach(pos => positions.add(pos)));
    // Sort unique positions based on POSITION_ORDER
    return Array.from(positions).sort((a, b) => {
      const indexA = POSITION_ORDER.indexOf(a);
      const indexB = POSITION_ORDER.indexOf(b);
      // Handle positions not in POSITION_ORDER by placing them at the end
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [players]);

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

        {/* Filter Section - now collapsible */}
        <Accordion type="single" collapsible className="w-full mb-6">
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent transition-colors duration-200">
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <Filter className="mr-2 h-5 w-5" /> Filter Players
              </h2>
            </AccordionTrigger>
            <AccordionContent className="p-4 border border-t-0 border-border rounded-b-lg bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name Filter with Autocomplete */}
                <Popover open={openNameFilter} onOpenChange={setOpenNameFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openNameFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {table.getColumn("name")?.getFilterValue()
                        ? (table.getColumn("name")?.getFilterValue() as string)
                        : "Filter by name..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search player name..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onValueChange={(value) => {
                          table.getColumn("name")?.setFilterValue(value);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No player found.</CommandEmpty>
                        <CommandGroup>
                          {players
                            .filter(player =>
                              player.name.toLowerCase().startsWith(
                                (table.getColumn("name")?.getFilterValue() as string || "").toLowerCase()
                              )
                            )
                            .map((player) => (
                              <CommandItem
                                key={player.id}
                                value={player.name}
                                onSelect={(currentValue) => {
                                  table.getColumn("name")?.setFilterValue(currentValue);
                                  setOpenNameFilter(false);
                                }}
                                className="cursor-pointer hover:bg-accent"
                              >
                                {player.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Team Filter with Autocomplete */}
                <Popover open={openTeamFilter} onOpenChange={setOpenTeamFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openTeamFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {table.getColumn("team")?.getFilterValue()
                        ? (table.getColumn("team")?.getFilterValue() as string)
                        : "Filter by team..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search team..."
                        value={(table.getColumn("team")?.getFilterValue() as string) ?? ""}
                        onValueChange={(value) => {
                          table.getColumn("team")?.setFilterValue(value);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup>
                          {uniqueTeams
                            .filter(team =>
                              team.toLowerCase().startsWith(
                                (table.getColumn("team")?.getFilterValue() as string || "").toLowerCase()
                              )
                            )
                            .map((team) => (
                              <CommandItem
                                key={team}
                                value={team}
                                onSelect={(currentValue) => {
                                  table.getColumn("team")?.setFilterValue(currentValue);
                                  setOpenTeamFilter(false);
                                }}
                                className="cursor-pointer hover:bg-accent"
                              >
                                {team}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Nationality Filter with Autocomplete */}
                <Popover open={openNationalityFilter} onOpenChange={setOpenNationalityFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openNationalityFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {table.getColumn("nationality")?.getFilterValue()
                        ? (table.getColumn("nationality")?.getFilterValue() as string)
                        : "Filter by nationality..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search nationality..."
                        value={(table.getColumn("nationality")?.getFilterValue() as string) ?? ""}
                        onValueChange={(value) => {
                          table.getColumn("nationality")?.setFilterValue(value);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No nationality found.</CommandEmpty>
                        <CommandGroup>
                          {uniqueNationalities
                            .filter(nationality =>
                              nationality.toLowerCase().startsWith(
                                (table.getColumn("nationality")?.getFilterValue() as string || "").toLowerCase()
                              )
                            )
                            .map((nationality) => (
                              <CommandItem
                                key={nationality}
                                value={nationality}
                                onSelect={(currentValue) => {
                                  table.getColumn("nationality")?.setFilterValue(currentValue);
                                  setOpenNationalityFilter(false);
                                }}
                                className="cursor-pointer hover:bg-accent"
                              >
                                {nationality}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Position Filter with Autocomplete */}
                <Popover open={openPositionFilter} onOpenChange={setOpenPositionFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPositionFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {table.getColumn("positions")?.getFilterValue()
                        ? (table.getColumn("positions")?.getFilterValue() as string)
                        : "Filter by position (e.g., CDM)..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search position..."
                        value={(table.getColumn("positions")?.getFilterValue() as string) ?? ""}
                        onValueChange={(value) => {
                          table.getColumn("positions")?.setFilterValue(value);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No position found.</CommandEmpty>
                        <CommandGroup>
                          {uniquePositions
                            .filter(position =>
                              position.toLowerCase().startsWith(
                                (table.getColumn("positions")?.getFilterValue() as string || "").toLowerCase()
                              )
                            )
                            .map((position) => (
                              <CommandItem
                                key={position}
                                value={position}
                                onSelect={(currentValue) => {
                                  table.getColumn("positions")?.setFilterValue(currentValue);
                                  setOpenPositionFilter(false);
                                }}
                                className="cursor-pointer hover:bg-accent"
                              >
                                {position}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Global filter for general search */}
                <Input
                  placeholder="Global search..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="bg-input border-border text-foreground lg:col-span-3"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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