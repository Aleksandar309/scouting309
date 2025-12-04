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


export const playerTableColumns: ColumnDef<Player>[] = [
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
    header: ({ column }) => (
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
    enableSorting: true,
    sortingFn: positionSortFn,
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
    filterFn: (row, columnId, filterValue: number) => {
      const rating = row.original.scoutingProfile.currentAbility;
      return rating >= filterValue;
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
    filterFn: (row, columnId, filterValue: number) => {
      const rating = row.original.scoutingProfile.potentialAbility;
      return rating >= filterValue;
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
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={(e) => e.stopPropagation()} // Dodato: Zaustavljanje propagacije događaja
            >
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