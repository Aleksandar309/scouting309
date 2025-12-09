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
import { Scout } from '@/types/scout';
import { cn } from '@/lib/utils';

interface ScoutListDisplayProps {
  data: Scout[];
  columns: ColumnDef<Scout>[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

const ScoutListDisplay: React.FC<ScoutListDisplayProps> = ({
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
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    defaultColumn: {
      minSize: 50, // Default minimum size for all columns
    },
  });

  // Calculate sticky column offsets dynamically
  const stickyColumnOffsets = React.useMemo(() => {
    const offsets: { [key: string]: number } = {};
    let currentOffset = 0;
    // Iterate through all visible headers to calculate cumulative offset
    for (const header of table.getFlatHeaders()) {
      if (header.column.id === 'name' || header.column.id === 'role') { // Freeze 'name' and 'role' for scouts
        offsets[header.column.id] = currentOffset;
        currentOffset += header.getSize();
      }
    }
    return offsets;
  }, [table.getFlatHeaders(), table.getState().columnSizingInfo]); // Recalculate if column sizes change

  return (
    <div className="rounded-md border border-border bg-card overflow-x-auto">
      <Table style={{ width: table.getTotalSize() }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-border">
              {headerGroup.headers.map((header) => {
                const isNameColumn = header.column.id === 'name';
                const isRoleColumn = header.column.id === 'role';
                const isSticky = isNameColumn || isRoleColumn;
                const leftOffset = stickyColumnOffsets[header.column.id];

                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                      position: isSticky ? 'sticky' : undefined,
                      left: isSticky ? leftOffset : undefined,
                      zIndex: isSticky ? (isNameColumn ? 10 : 9) : undefined, // Name: 10, Role: 9
                      backgroundColor: isSticky ? 'hsl(var(--background))' : undefined, // Ensure background for sticky headers
                    }}
                    className={cn(
                      "text-foreground relative",
                      // Removed sticky-column-header class as styles are applied inline
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
                onClick={() => navigate(`/scouts/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => {
                  const isNameColumn = cell.column.id === 'name';
                  const isRoleColumn = cell.column.id === 'role';
                  const isSticky = isNameColumn || isRoleColumn;
                  const leftOffset = stickyColumnOffsets[cell.column.id];

                  return (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        position: isSticky ? 'sticky' : undefined,
                        left: isSticky ? leftOffset : undefined,
                        zIndex: isSticky ? (isNameColumn ? 5 : 4) : undefined, // Name: 5, Role: 4
                        backgroundColor: isSticky ? 'hsl(var(--card))' : undefined, // Ensure background for sticky cells
                      }}
                      className={cn(
                        "text-foreground",
                        // Removed sticky-column-cell class as styles are applied inline
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
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

export default ScoutListDisplay;