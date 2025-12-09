"use client";

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getCanResizeColumn, // Added import
  getIsResizing, // Added import
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from '@/types/player';
import { cn } from '@/lib/utils'; // Added import for cn

interface PlayerTableDisplayProps {
  data: Player[];
  columns: ColumnDef<Player>[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

const PlayerTableDisplay: React.FC<PlayerTableDisplayProps> = ({
  data,
  columns,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  globalFilter,
  setGlobalFilter,
}) => {
  const navigate = useNavigate();

  const table = useReactTable({
    data,
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
    enableColumnResizing: true, // Enabled column resizing
    columnResizeMode: "onChange", // Set resize mode
  });

  return (
    <div className="rounded-md border border-border bg-card overflow-x-auto">
      <Table style={{ width: table.getTotalSize() }}> {/* Set table width based on total column size */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-border">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }} // Set header width
                    className={cn(
                      "text-foreground relative", // Added relative for resizer positioning
                      header.column.id === 'name' && "sticky-column-header" // Apply sticky class for name column
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-action-none opacity-0 hover:opacity-100",
                          header.column.getIsResizing() ? "bg-primary opacity-100" : ""
                        )}
                      />
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
                className="border-border hover:bg-table-row-hover cursor-pointer"
                onClick={() => navigate(`/player/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }} // Set cell width
                    className={cn(
                      "text-foreground",
                      cell.column.id === 'name' && "sticky-column-cell" // Apply sticky class for name cell
                    )}
                  >
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
  );
};

export default PlayerTableDisplay;