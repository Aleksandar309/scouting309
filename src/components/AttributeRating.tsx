"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Import Input component
import { FmAttributeCategory } from '@/utils/fm-roles'; // Import FmAttributeCategory
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { playerAttributeDescriptions } from '@/utils/player-attribute-descriptions'; // Import player attribute descriptions

interface AttributeRatingProps {
  name: string;
  rating: number;
  className?: string;
  highlightType?: 'primary' | 'secondary' | 'tertiary' | null;
  isEditable?: boolean; // New prop
  onRatingChange?: (newRating: number) => void; // New prop
  onViewHistory?: (attributeName: string, category: FmAttributeCategory) => void; // New prop for viewing history
  attributeCategory?: FmAttributeCategory; // New prop to pass category for history
}

const getRatingColorClass = (rating: number): string => {
  if (rating === 1) {
    return "!bg-red-800"; // Tamno crvena
  } else if (rating === 2) {
    return "!bg-red-600"; // Crvena
  } else if (rating === 3) {
    return "!bg-red-400"; // Svetlo crvena, vuče na narandžastu
  } else if (rating === 4) {
    return "!bg-orange-500"; // Narandžasta
  } else if (rating === 5) {
    return "!bg-amber-400"; // Žuta/Amber
  } else if (rating === 6) {
    return "!bg-yellow-300"; // Malo žutija nijansa koja vuče na zelenu
  } else if (rating === 7) {
    return "!bg-lime-500"; // Yellow-Green
  } else if (rating === 8) {
    return "!bg-green-500";
  } else if (rating === 9) {
    return "!bg-emerald-600"; // Dark Green
  } else if (rating === 10) {
    return "!bg-emerald-800"; // Tamnija zelena za ocenu 10
  }
  return "!bg-muted-foreground"; // Default color for ratings outside 1-10 or 0
};

const AttributeRating: React.FC<AttributeRatingProps> = ({
  name,
  rating,
  className,
  highlightType,
  isEditable = false,
  onRatingChange,
  onViewHistory,
  attributeCategory,
}) => {
  const progressValue = Math.min(Math.max(rating * 10, 0), 100);
  const indicatorColorClass = getRatingColorClass(rating);

  const highlightClasses = {
    primary: "bg-role-primary ring-1 ring-primary", // Use semantic color
    secondary: "bg-role-secondary ring-1 ring-purple-400", // Use semantic color
    tertiary: "bg-role-tertiary ring-1 ring-muted-foreground", // Use semantic color
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

  const handleClick = () => {
    if (!isEditable && onViewHistory && attributeCategory) {
      onViewHistory(name, attributeCategory);
    }
  };

  const description = playerAttributeDescriptions[name] || "No description available.";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200",
              highlightType ? highlightClasses[highlightType] : "",
              !isEditable && onViewHistory && attributeCategory ? "cursor-pointer hover:bg-accent/50" : "", // Make clickable if history view is enabled
              className
            )}
            onClick={handleClick}
          >
            <span className={cn("text-sm w-1/2", highlightType ? "text-text-on-colored-background" : "text-muted-foreground")}>{name}</span> {/* Use semantic text color */}
            <div className="flex items-center w-1/2">
              {isEditable ? (
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={rating === 0 ? "" : rating} // Display empty string if rating is 0 (e.g., during invalid input)
                  onChange={handleInputChange}
                  className="w-full h-6 bg-input border-border text-foreground text-sm text-center"
                />
              ) : (
                <>
                  <Progress
                    value={progressValue}
                    className="h-2 w-full bg-muted"
                    indicatorClassName={indicatorColorClass}
                  />
                  <span className={cn("ml-2 text-sm", highlightType ? "text-text-on-colored-background" : "text-muted-foreground")}>{rating}</span> {/* Use semantic text color */}
                </>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-popover border-border text-popover-foreground max-w-xs">
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AttributeRating;