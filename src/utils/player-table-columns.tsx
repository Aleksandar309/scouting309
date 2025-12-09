"use client";

import React from 'react';
import {
  ColumnDef,
  flexRender,
  SortingFn,
} from '@tanstack/react-table';
import { ArrowUpDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Player } from "@/types/player";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AddToShortlistDialog from '@/components/AddToShortlistDialog';
import { ALL_ATTRIBUTE_NAMES } from '@/utils/player-attributes';
import { POSITION_ORDER } from '@/utils/position-order';
import { TableCell, TableHead } from '@/components/ui/table'; // Import TableCell and TableHead
import { cn } from '@/lib/utils'; // Import cn for utility classes

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
    if (Array.isArray(category)) {
      const attribute = category.find(attr => attr.name === attributeName);
      if (attribute) {
        return attribute.rating;
      }
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
      className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
    >
      {attrName}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const rating = getAttributeRating(row.original, attrName);
    return <span className="text-foreground whitespace-nowrap">{rating}</span>; // Added whitespace-nowrap
  },
  enableSorting: true,
  minSize: 100, // Set a minimum size for attribute columns
  maxSize: 200, // Set a maximum size for attribute columns
}));


export const playerTableColumns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link to={`/player/${row.original.id}`} className="text-primary hover:underline flex whitespace-nowrap"> {/* Added whitespace-nowrap */}
        {row.getValue("name")}
      </Link>
    ),
    minSize: 180, // Increased minSize
    maxSize: 300,
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
      >
        Team
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap"> {/* Added whitespace-nowrap */}
        {row.getValue("team")}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const team: string = row.getValue(columnId);
      return team.toLowerCase().includes(filterValue.toLowerCase());
    },
    minSize: 150, // Increased minSize
    maxSize: 250,
  },
  {
    accessorKey: "positions",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
      >
        Positions
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.positions.slice(0, 2).map((pos) => ( // Limit to first 2 positions
          <Badge key={pos} variant="secondary" className="bg-muted text-muted-foreground whitespace-nowrap"> {/* Added whitespace-nowrap */}
            {pos}
          </Badge>
        ))}
        {row.original.positions.length > 2 && (
          <Badge variant="secondary" className="bg-muted text-muted-foreground whitespace-nowrap">
            +{row.original.positions.length - 2}
          </Badge>
        )}
      </div>
    ),
    enableSorting: true,
    sortingFn: positionSortFn,
    filterFn: (row, columnId, filterValue) => {
      const positions: string[] = row.getValue(columnId);
      return positions.some(pos => pos.toLowerCase().includes(filterValue.toLowerCase()));
    },
    minSize: 150,
    maxSize: 300,
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
      >
        Nationality
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap"> {/* Added whitespace-nowrap */}
        {row.getValue("nationality")}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const nationality: string = row.getValue(columnId);
      return nationality.toLowerCase().includes(filterValue.toLowerCase());
    },
    minSize: 120,
    maxSize: 200,
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
      >
        Age
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap"> {/* Added whitespace-nowrap */}
        {row.getValue("age")}
      </div>
    ),
    minSize: 80,
    maxSize: 120,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
      >
        Value
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap"> {/* Added whitespace-nowrap */}
        {row.getValue("value")}
      </div>
    ),
    minSize: 100,
    maxSize: 180,
  },
  {
    accessorKey: "scoutingProfile.currentAbility",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
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
        <div className="flex items-center w-full whitespace-nowrap"> {/* Added whitespace-nowrap */}
          <Progress value={progressValue} className="h-2 bg-muted" indicatorClassName="bg-primary" />
          <span className="ml-2 text-sm text-foreground">{rating}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: number) => {
      const rating = row.original.scoutingProfile.currentAbility;
      return rating >= filterValue;
    },
    minSize: 150,
    maxSize: 250,
  },
  {
    accessorKey: "scoutingProfile.potentialAbility",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent whitespace-nowrap" // Added whitespace-nowrap
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
        <div className="flex items-center w-full whitespace-nowrap"> {/* Added whitespace-nowrap */}
          <Progress value={progressValue} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
          <span className="ml-2 text-sm text-foreground">{rating}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: number) => {
      const rating = row.original.scoutingProfile.potentialAbility;
      return rating >= filterValue;
    },
    minSize: 150,
    maxSize: 250,
  },
  {
    accessorKey: "priorityTarget",
    header: "Priority",
    cell: ({ row }) => (
      row.getValue("priorityTarget") ? <Badge className="bg-yellow-600 text-white whitespace-nowrap">Yes</Badge> : <Badge variant="secondary" className="bg-muted text-muted-foreground whitespace-nowrap">No</Badge> // Added whitespace-nowrap
    ),
    enableSorting: true,
    minSize: 100,
    maxSize: 150,
  },
  ...attributeColumns,
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const player = row.original;
      const [isShortlistDialogOpen, setIsShortlistDialogOpen] = React.useState(false);
      return (
        <Dialog open={isShortlistDialogOpen} onOpenChange={setIsShortlistDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon" // Changed size to 'icon' for a smaller button
              className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap h-7 w-7" // Added custom height and width
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-3 w-3" /> {/* Reduced icon size */}
            </Button>
          </DialogTrigger>
          <AddToShortlistDialog allPlayers={[]} initialPlayerId={player.id} onClose={() => setIsShortlistDialogOpen(false)} />
        </Dialog>
      );
    },
    enableSorting: false,
    enableHiding: false,
    minSize: 60, // Reduced minSize for the actions column
    maxSize: 80, // Reduced maxSize for the actions column
  },
];