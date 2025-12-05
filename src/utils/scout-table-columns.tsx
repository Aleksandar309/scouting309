"use client";

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Mail, Phone, User, CalendarDays, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Scout } from "@/types/scout";
import { TableHead } from '@/components/ui/table';

export const scoutTableColumns: ColumnDef<Scout>[] = [
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
      <Link to={`/scouts/${row.original.id}`} className="flex items-center text-primary hover:underline">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent"
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "activePlayers",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent"
      >
        Active Players
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <User className="mr-2 h-4 w-4 text-muted-foreground" /> {row.getValue("activePlayers")}
      </div>
    ),
  },
  {
    accessorKey: "lastReportDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:bg-accent"
      >
        Last Report
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" /> {row.getValue("lastReportDate")}
      </div>
    ),
  },
];