"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { getQualitativeRating } from '@/types/scout-attributes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { scoutAttributeDescriptions } from '@/utils/scout-attribute-descriptions'; // Import descriptions
import { Input } from '@/components/ui/input'; // Import Input for editable mode

interface ScoutAttributeDisplayProps {
  name: string;
  rating: number; // 1-20 scale
  highlightType?: 'primary' | 'secondary' | 'tertiary' | null; // New prop for highlighting
  isEditable?: boolean; // New prop for edit mode
  onRatingChange?: (newRating: number) => void; // Callback for rating change
}

const getRatingColorClass = (rating: number): string => {
  if (rating <= 5) {
    return "!bg-destructive";
  } else if (rating <= 10) {
    return "!bg-yellow-600";
  } else if (rating <= 15) {
    return "!bg-green-600";
  } else { // 16-20
    return "!bg-blue-600";
  }
};

const ScoutAttributeDisplay: React.FC<ScoutAttributeDisplayProps> = ({ name, rating, highlightType, isEditable = false, onRatingChange }) => {
  const { colorClass } = getQualitativeRating(rating);
  const progressValue = (rating / 20) * 100; // Scale 1-20 to 0-100 for Progress component

  // More discreet highlight classes: subtle left border and bold text
  const highlightClasses = {
    primary: "border-l-4 border-primary pl-2", // Blue border for primary
    secondary: "border-l-4 border-purple-500 pl-2", // Purple border for secondary
    tertiary: "border-l-4 border-muted-foreground pl-2", // Muted border for tertiary
  };

  // Skraćivanje naziva atributa za prikaz
  const displayedName = (() => {
    switch (name) {
      case "Judging Player Ability": return "J. Play. Ability";
      case "Judging Player Potential": return "J. Play. Potential";
      case "Judging Staff Ability": return "J. Staff Ability";
      case "Judging Staff Potential": return "J. Staff Potential";
      case "People Management": return "People Mgmt.";
      case "Tactical Knowledge": return "Tact. Knowledge";
      case "Professionalism": return "Profess.";
      default: return name;
    }
  })();

  const description = scoutAttributeDescriptions[name] || "No description available.";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = parseInt(e.target.value, 10);
    if (!isNaN(newRating) && newRating >= 1 && newRating <= 20 && onRatingChange) {
      onRatingChange(newRating);
    } else if (e.target.value === "" && onRatingChange) {
      onRatingChange(0); // Or some other indicator for invalid/empty
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200",
              highlightType ? highlightClasses[highlightType] : ""
            )}
          >
            <span className={cn("text-sm w-1/2", highlightType ? "font-semibold text-foreground" : "text-muted-foreground")}>{displayedName}</span>
            <div className="flex items-center w-1/2 space-x-2">
              {isEditable ? (
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={rating === 0 ? "" : rating}
                  onChange={handleInputChange}
                  className="w-full h-6 bg-input border-border text-foreground text-sm text-center"
                />
              ) : (
                <>
                  <Progress value={progressValue} className="h-2 flex-1 bg-muted" indicatorClassName={colorClass} />
                  <span className={cn("ml-2 text-sm", highlightType ? "text-text-on-colored-background" : "text-muted-foreground")}>{rating}</span>
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

export default ScoutAttributeDisplay;