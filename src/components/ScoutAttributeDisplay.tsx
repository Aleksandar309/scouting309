"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { getQualitativeRating } from '@/types/scout-attributes';

interface ScoutAttributeDisplayProps {
  name: string;
  rating: number; // 1-20 scale
  highlightType?: 'primary' | 'secondary' | 'tertiary' | null; // New prop for highlighting
}

const ScoutAttributeDisplay: React.FC<ScoutAttributeDisplayProps> = ({ name, rating, highlightType }) => {
  const { colorClass } = getQualitativeRating(rating);
  const progressValue = (rating / 20) * 100; // Scale 1-20 to 0-100 for Progress component

  // More discreet highlight classes: subtle left border and bold text
  const highlightClasses = {
    primary: "border-l-4 border-blue-500 pl-2", // Blue border for primary
    secondary: "border-l-4 border-purple-500 pl-2", // Purple border for secondary
    tertiary: "border-l-4 border-muted-foreground pl-2", // Muted border for tertiary
  };

  // Skraćivanje naziva atributa za prikaz
  const displayedName = name === "Judging Player Ability"
    ? "Judging Play. Ability"
    : name === "Judging Player Potential"
      ? "Judging Play. Potential"
      : name;

  return (
    <div
      className={cn(
        "flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200",
        highlightType ? highlightClasses[highlightType] : ""
      )}
    >
      <span className={cn("text-sm w-1/2", highlightType ? "font-semibold text-foreground" : "text-muted-foreground")}>{displayedName}</span>
      <div className="flex items-center w-1/2 space-x-2">
        <Progress value={progressValue} className="h-2 flex-1 bg-muted" indicatorClassName={colorClass} />
      </div>
    </div>
  );
};

export default ScoutAttributeDisplay;