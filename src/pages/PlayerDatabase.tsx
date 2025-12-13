"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Plus, ChevronLeft, Table2, LayoutGrid, Filter, Search } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import AddPlayerForm from '@/components/AddPlayerForm';
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
import { POSITION_ORDER } from '@/utils/position-order';
import PlayerTableDisplay from '@/components/PlayerTableDisplay';
import PlayerCardGridDisplay from '@/components/PlayerCardGridDisplay';
import { playerTableColumns } from '@/utils/player-table-columns';
import { Input } from '@/components/ui/input';
import { ALL_FOOTBALL_POSITIONS } from '@/utils/positions';
import { Label } from "@/components/ui/label";
import { REGION_MAP, ALL_REGIONS } from '@/utils/regions'; // Import regions utility

interface PlayerDatabaseProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

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

  const [openNameFilter, setOpenNameFilter] = React.useState(false);
  const [openTeamFilter, setOpenTeamFilter] = React.useState(false);
  const [openNationalityFilter, setOpenNationalityFilter] = React.useState(false);
  const [openPositionFilter, setOpenPositionFilter] = React.useState(false);
  const [openRegionFilter, setOpenRegionFilter] = React.useState(false); // New state for region filter
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null); // State to hold selected region

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerDatabaseViewMode', viewMode);
    }
  }, [viewMode]);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setIsAddPlayerDialogOpen(false);
  };

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

  // Filter players based on selected region before passing to table/card display
  const filteredPlayersByRegion = React.useMemo(() => {
    if (!selectedRegion) {
      return players;
    }
    return players.filter(player => REGION_MAP[player.nationality] === selectedRegion);
  }, [players, selectedRegion]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pt-16"> {/* Added pt-16 */}
      <div className="max-w-7xl mx-auto">
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
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full mb-6">
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent transition-colors duration-200">
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <Filter className="mr-2 h-5 w-5" /> Filter Players
              </h2>
            </AccordionTrigger>
            <AccordionContent className="p-4 border border-t-0 border-border rounded-b-lg bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Popover open={openNameFilter} onOpenChange={setOpenNameFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openNameFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {(columnFilters.find(f => f.id === 'name')?.value as string) ?? "Filter by name..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search player name..."
                        value={(columnFilters.find(f => f.id === 'name')?.value as string) ?? ""}
                        onValueChange={(value) => {
                          setColumnFilters(prev => {
                            const newFilters = prev.filter(f => f.id !== 'name');
                            if (value) newFilters.push({ id: 'name', value });
                            return newFilters;
                          });
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No player found.</CommandEmpty>
                        <CommandGroup>
                          {players
                            .filter(player =>
                              player.name.toLowerCase().startsWith(
                                (columnFilters.find(f => f.id === 'name')?.value as string || "").toLowerCase()
                              )
                            )
                            .map((player) => (
                              <CommandItem
                                key={player.id}
                                value={player.name}
                                onSelect={(currentValue) => {
                                  setColumnFilters(prev => {
                                    const newFilters = prev.filter(f => f.id !== 'name');
                                    newFilters.push({ id: 'name', value: currentValue });
                                    return newFilters;
                                  });
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

                <Popover open={openTeamFilter} onOpenChange={setOpenTeamFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openTeamFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {(columnFilters.find(f => f.id === 'team')?.value as string) ?? "Filter by team..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search team..."
                        value={(columnFilters.find(f => f.id === 'team')?.value as string) ?? ""}
                        onValueChange={(value) => {
                          setColumnFilters(prev => {
                            const newFilters = prev.filter(f => f.id !== 'team');
                            if (value) newFilters.push({ id: 'team', value });
                            return newFilters;
                          });
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup>
                          {uniqueTeams
                            .filter(team =>
                              team.toLowerCase().startsWith(
                                (columnFilters.find(f => f.id === 'team')?.value as string || "").toLowerCase()
                              )
                            )
                            .map((team) => (
                              <CommandItem
                                key={team}
                                value={team}
                                onSelect={(currentValue) => {
                                  setColumnFilters(prev => {
                                    const newFilters = prev.filter(f => f.id !== 'team');
                                    newFilters.push({ id: 'team', value: currentValue });
                                    return newFilters;
                                  });
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

                <Popover open={openNationalityFilter} onOpenChange={setOpenNationalityFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openNationalityFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {(columnFilters.find(f => f.id === 'nationality')?.value as string) ?? "Filter by nationality..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search nationality..."
                        value={(columnFilters.find(f => f.id === 'nationality')?.value as string) ?? ""}
                        onValueChange={(value) => {
                          setColumnFilters(prev => {
                            const newFilters = prev.filter(f => f.id !== 'nationality');
                            if (value) newFilters.push({ id: 'nationality', value });
                            return newFilters;
                          });
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No nationality found.</CommandEmpty>
                        <CommandGroup>
                          {uniqueNationalities
                            .filter(nationality =>
                              nationality.toLowerCase().startsWith(
                                (columnFilters.find(f => f.id === 'nationality')?.value as string || "").toLowerCase()
                              )
                            )
                            .map((nationality) => (
                              <CommandItem
                                key={nationality}
                                value={nationality}
                                onSelect={(currentValue) => {
                                  setColumnFilters(prev => {
                                    const newFilters = prev.filter(f => f.id !== 'nationality');
                                    newFilters.push({ id: 'nationality', value: currentValue });
                                    return newFilters;
                                  });
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

                {/* New Region Filter */}
                <Popover open={openRegionFilter} onOpenChange={setOpenRegionFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openRegionFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {selectedRegion ?? "Filter by region..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput placeholder="Search region..." />
                      <CommandList>
                        <CommandEmpty>No region found.</CommandEmpty>
                        <CommandGroup>
                          {ALL_REGIONS.map((region) => (
                            <CommandItem
                              key={region}
                              value={region}
                              onSelect={(currentValue) => {
                                setSelectedRegion(currentValue === selectedRegion ? null : currentValue);
                                setOpenRegionFilter(false);
                              }}
                              className="cursor-pointer hover:bg-accent"
                            >
                              {region}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Popover open={openPositionFilter} onOpenChange={setOpenPositionFilter}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPositionFilter}
                      className="w-full justify-between bg-input border-border text-foreground hover:bg-accent"
                    >
                      {(columnFilters.find(f => f.id === 'positions')?.value as string) ?? "Filter by position (e.g., CDM)..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search position..."
                        value={(columnFilters.find(f => f.id === 'positions')?.value as string) ?? ""}
                        onValueChange={(value) => {
                          setColumnFilters(prev => {
                            const newFilters = prev.filter(f => f.id !== 'positions');
                            if (value) newFilters.push({ id: 'positions', value });
                            return newFilters;
                          });
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No position found.</CommandEmpty>
                        <CommandGroup>
                          {ALL_FOOTBALL_POSITIONS
                            .filter(position =>
                              position.toLowerCase().startsWith(
                                (columnFilters.find(f => f.id === 'positions')?.value as string || "").toLowerCase()
                              )
                            )
                            .sort((a, b) => {
                              const indexA = POSITION_ORDER.indexOf(a);
                              const indexB = POSITION_ORDER.indexOf(b);
                              if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                              if (indexA === -1) return 1;
                              if (indexB === -1) return -1;
                              return indexA - indexB;
                            })
                            .map((position) => (
                              <CommandItem
                                key={position}
                                value={position}
                                onSelect={(currentValue) => {
                                  setColumnFilters(prev => {
                                    const newFilters = prev.filter(f => f.id !== 'positions');
                                    newFilters.push({ id: 'positions', value: currentValue });
                                    return newFilters;
                                  });
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

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="minCurrentAbility" className="text-muted-foreground">Min Current Ability</Label>
                  <Input
                    id="minCurrentAbility"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Min CA (1-10)"
                    value={(columnFilters.find(f => f.id === 'currentAbilityRating')?.value as number) ?? ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setColumnFilters(prev => {
                        const newFilters = prev.filter(f => f.id !== 'currentAbilityRating');
                        if (!isNaN(value) && value >= 1 && value <= 10) {
                          newFilters.push({ id: 'currentAbilityRating', value });
                        }
                        return newFilters;
                      });
                    }}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="minPotentialAbility" className="text-muted-foreground">Min Potential Ability</Label>
                  <Input
                    id="minPotentialAbility"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Min PA (1-10)"
                    value={(columnFilters.find(f => f.id === 'potentialAbilityRating')?.value as number) ?? ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setColumnFilters(prev => {
                        const newFilters = prev.filter(f => f.id !== 'potentialAbilityRating');
                        if (!isNaN(value) && value >= 1 && value <= 10) {
                          newFilters.push({ id: 'potentialAbilityRating', value });
                        }
                        return newFilters;
                      });
                    }}
                    className="bg-input border-border text-foreground"
                  />
                </div>

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
          <PlayerTableDisplay
            data={filteredPlayersByRegion} // Pass region-filtered players
            columns={playerTableColumns}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        ) : (
          <PlayerCardGridDisplay players={filteredPlayersByRegion} />
        )}
      </div>
    </div>
  );
};

export default PlayerDatabase;