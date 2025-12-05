"use client";

import { Assignment } from '@/types/scout';
import { Task } from '@/types/task'; // Import Task type
import { Badge } from '@/components/ui/badge';
import { isPast } from 'date-fns';
import React from 'react';

type PriorityType = Assignment["priority"] | Task["priority"];
type StatusType = Assignment["status"] | Task["status"];

export const getPriorityBadgeClass = (priority: PriorityType) => {
  switch (priority) {
    case "P1": return "bg-red-600 text-white";
    case "P2": return "bg-yellow-600 text-white";
    case "P3": return "bg-blue-600 text-white";
    default: return "bg-gray-500 text-white";
  }
};

export const getStatusBadgeClass = (status: StatusType) => {
  switch (status) {
    case "Pending": return "bg-gray-500 text-white";
    case "In Progress": return "bg-blue-500 text-white";
    case "Completed": return "bg-green-600 text-white";
    case "Overdue": return "bg-destructive text-destructive-foreground";
    default: return "bg-gray-500 text-white";
  }
};

export const getDueDateStatus = (dueDate: string, status: StatusType) => {
  if (status === "Completed") {
    return null;
  }

  const date = new Date(dueDate);
  if (isPast(date)) {
    return <Badge variant="destructive" className="bg-destructive text-destructive-foreground ml-2">Overdue</Badge>;
  }
  return null;
};