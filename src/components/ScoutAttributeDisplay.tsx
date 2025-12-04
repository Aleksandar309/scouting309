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

  const highlightClasses = {
    primary: "bg-role-primary ring-1 ring-blue-400", // Use semantic color
    secondary: "bg-role-secondary ring-1 ring-purple-400", // Use semantic color
    tertiary: "bg-role-tertiary ring-1 ring-muted-foreground", // Use semantic color
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200",
        highlightType ? highlightClasses[highlightType] : ""
      )}
    >
      <span className={cn("text-sm w-1/2", highlightType ? "text-text-on-colored-background" : "text-muted-foreground")}>{name}</span>
      <div className="flex items-center w-1/2 space-x-2">
        <Progress value={progressValue} className="h-2 flex-1 bg-muted" indicatorClassName={colorClass} />
      </div>
    </div>
  );
};

export default ScoutAttributeDisplay;