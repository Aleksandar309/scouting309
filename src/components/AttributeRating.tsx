"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Import Input component

interface AttributeRatingProps {
  name: string;
  rating: number;
  className?: string;
  highlightType?: 'primary' | 'secondary' | 'tertiary' | null;
  isEditable?: boolean; // New prop
  onRatingChange?: (newRating: number) => void; // New prop
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

const AttributeRating: React.FC<AttributeRatingProps> = ({ name, rating, className, highlightType, isEditable = false, onRatingChange }) => {
  const progressValue = Math.min(Math.max(rating * 10, 0), 100);
  const indicatorColorClass = getRatingColorClass(rating);

  const highlightClasses = {
    primary: "bg-blue-600 ring-1 ring-blue-400",
    secondary: "bg-purple-600 ring-1 ring-purple-400",
    tertiary: "bg-gray-600 ring-1 ring-gray-500",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = parseInt(e.target.value, 10);
    // Only call onRatingChange if it's a valid number between 1 and 10
    if (!isNaN(newRating) && newRating >= 1 && newRating <= 10 && onRatingChange) {
      onRatingChange(newRating);
    } else if (e.target.value === "" && onRatingChange) {
      // Allow clearing the input temporarily without setting a rating
      onRatingChange(0); // Or some other indicator for invalid/empty
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200",
      highlightType ? highlightClasses[highlightType] : "",
      className
    )}>
      <span className={cn("text-sm w-1/2", highlightType ? "text-white" : "text-gray-300")}>{name}</span>
      <div className="flex items-center w-1/2">
        {isEditable ? (
          <Input
            type="number"
            min="1"
            max="10"
            value={rating === 0 ? "" : rating} // Display empty string if rating is 0 (e.g., during invalid input)
            onChange={handleInputChange}
            className="w-full h-6 bg-gray-700 border-gray-600 text-white text-sm text-center"
          />
        ) : (
          <>
            <Progress 
              value={progressValue} 
              className="h-2 w-full bg-gray-500"
              indicatorClassName={indicatorColorClass}
            />
            <span className={cn("ml-2 text-sm", highlightType ? "text-white" : "text-gray-300")}>{rating}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default AttributeRating;