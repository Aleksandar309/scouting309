"use client";

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, ChevronLeft, CalendarDays, Briefcase, ArrowUpDown, Table2, LayoutGrid, Plus } from 'lucide-react';
import { Scout, Assignment } from '@/types/scout';
import { mockScouts } from '@/data/mockScouts';
import { Player } from '@/types/player';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import PlayerCard from '@/components/PlayerCard';
import { ALL_ATTRIBUTE_NAMES } from '@/utils/player-attributes';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AddToShortlistDialog from '@/components/AddToShortlistDialog';
import { format, isPast } from 'date-fns';

interface ScoutProfileProps {
  players: Player[]; // Receive all players as prop
  assignments: Assignment[]; // Receive all assignments as prop
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


const ScoutProfile: React.FC<ScoutProfileProps> = ({ players, assignments }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scout = mockScouts.find(s => s.id === id);

  const [viewMode, setViewMode] = React.useState<'table' | 'card'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('scoutProfileViewMode') as 'table' | 'card') || 'table';
    }
    return 'table';
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scoutProfileViewMode', viewMode);
    }
  }, [viewMode]);

  if (!scout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="text-center bg-card p-8 rounded-lg shadow-lg border border-border">
          <h1 className="text-3xl font-bold mb-4 text-destructive">Scout Not Found</h1>
          <p className="text-xl text-muted-foreground mb-6">The scout you are looking for does not exist.</p>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 p-0 h-auto"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Filter players reported by this scout
  const scoutedPlayers = players.filter(player =>
    player.scoutingReports.some(report => report.scout === scout.name)
  );

  // Filter assignments for this scout
  const scoutAssignments = assignments.filter(assignment => assignment.assignedTo === scout.id);

  const table = useReactTable({
    data: scoutedPlayers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const getPriorityBadgeClass = (priority: Assignment["priority"]) => {
    switch (priority) {
      case "P1": return "bg-red-600 text-white";
      case "P2": return "bg-yellow-600 text-white";
      case "P3": return "bg-blue-600 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusBadgeClass = (status: Assignment["status"]) => {
    switch (status) {
      case "Pending": return "bg-gray-500 text-white";
      case "In Progress": return "bg-blue-500 text-white";
      case "Completed": return "bg-green-600 text-white";
      case "Overdue": return "bg-destructive text-destructive-foreground";
      default: return "bg-gray-500 text-white";
    }
  };

  const getDueDateStatus = (dueDate: string, status: Assignment["status"]) => {
    if (status === "Completed") return null;
    const date = new Date(dueDate);
    if (isPast(date) && status !== "Completed") {
      return <Badge variant="destructive" className="bg-destructive text-destructive-foreground ml-2">Overdue</Badge>;
    }
    return null;
  };

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

        <Card className="bg-card border-border text-card-foreground shadow-lg mb-8">
          <CardHeader className="flex flex-row items-center space-x-6 pb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={scout.avatarUrl} alt={scout.name} />
              <AvatarFallback className="bg-blue-600 text-white text-4xl">{scout.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">{scout.name}</CardTitle>
              <p className="text-muted-foreground text-lg">{scout.role}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-base">
                <Mail className="mr-3 h-5 w-5 text-muted-foreground" /> {scout.email}
              </div>
              <div className="flex items-center text-base">
                <Phone className="mr-3 h-5 w-5 text-muted-foreground" /> {scout.phone}
              </div>
              <div className="flex items-center text-base">
                <User className="mr-3 h-5 w-5 text-muted-foreground" /> Active Players: {scout.activePlayers}
              </div>
              <div className="flex items-center text-base">
                <CalendarDays className="mr-3 h-5 w-5 text-muted-foreground" /> Last Report: {scout.lastReportDate}
              </div>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">Scouting Focus</h3>
              <p className="text-sm">
                {scout.role === "Head Scout" && "Oversees all scouting operations, focusing on strategic targets and team fit across all regions."}
                {scout.role === "European Scout" && "Specializes in identifying talent across major European leagues, with an emphasis on technical ability and tactical intelligence."}
                {scout.role === "Youth Scout" && "Focuses on emerging talents in youth academies and lower leagues, looking for high potential and coachability."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scout Assignments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Assignments for {scout.name} ({scoutAssignments.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scoutAssignments.length === 0 ? (
              <Card className="bg-card border-border text-card-foreground text-center p-8 lg:col-span-2">
                <CardTitle className="text-xl mb-4">No Assignments Yet!</CardTitle>
                <CardContent>
                  <p className="text-muted-foreground">
                    {scout.name} currently has no active assignments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              scoutAssignments.map((assignment) => (
                <Card key={assignment.id} className="bg-card border-border text-card-foreground shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">{assignment.title}</CardTitle>
                      <Badge className={getPriorityBadgeClass(assignment.priority)}>{assignment.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground text-sm">
                    <p>{assignment.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" /> Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                        {getDueDateStatus(assignment.dueDate, assignment.status)}
                      </span>
                      <Badge className={getStatusBadgeClass(assignment.status)}>{assignment.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Scouted Players Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Players Scouted by {scout.name} ({scoutedPlayers.length})</h2>
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

        {scoutedPlayers.length === 0 ? (
          <Card className="bg-card border-border text-card-foreground text-center p-8">
            <CardTitle className="text-xl mb-4">No Players Scouted Yet!</CardTitle>
            <CardContent>
              <p className="text-muted-foreground">
                {scout.name} has not filed any reports for players yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          viewMode === 'table' ? (
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
              {scoutedPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ScoutProfile;