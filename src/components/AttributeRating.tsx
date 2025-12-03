"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AttributeRatingProps {
  name: string;
  rating: number;
  className?: string;
  highlightType?: 'primary' | 'secondary' | 'tertiary' | null; // New prop
}

const getRatingColorClass = (rating: number): string => {
  if (rating >= 1 && rating <= 3) {
    return "!bg-red-500";
  } else if (rating >= 4 && rating <= 5) {
    return "!bg-orange-500";
  } else if (rating === 6) {
    return "!bg-yellow-500";
  } else if (rating === 7) {
    return "!bg-lime-500"; // Yellow-Green
  } else if (rating === 8) {
    return "!bg-green-500";
  } else if (rating === 9) {
    return "!bg-emerald-600"; // Dark Green
  } else if (rating === 10) {
    return "!bg-blue-500";
  }
  return "!bg-gray-400"; // Default color for ratings outside 1-10 or 0
};

const AttributeRating: React.FC<AttributeRatingProps> = ({ name, rating, className, highlightType }) => {
  const progressValue = Math.min(Math.max(rating * 10, 0), 100); // Ensure value is between 0 and 100
  const indicatorColorClass = getRatingColorClass(rating);

  const highlightClasses = {
    primary: "bg-blue-600 ring-1 ring-blue-400", // More subtle blue
    secondary: "bg-purple-600 ring-1 ring-purple-400", // More subtle purple
    tertiary: "bg-gray-600 ring-1 ring-gray-500", // Subtle gray
  };

  return (
    <div className={cn(
      "flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200",
      highlightType ? highlightClasses[highlightType] : "", // Apply highlight classes to the container
      className
    )}>
      <span className={cn("text-sm w-1/2", highlightType ? "text-white" : "text-gray-300")}>{name}</span>
      <div className="flex items-center w-1/2">
        <Progress 
          value={progressValue} 
          className="h-2 w-full bg-gray-500" // Background of the progress bar
          indicatorClassName={indicatorColorClass} // Dynamic color for the filled part
        />
        <span className={cn("ml-2 text-sm", highlightType ? "text-white" : "text-gray-300")}>{rating}</span>
      </div>
    </div>
  );
};

export default AttributeRating;