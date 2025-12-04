"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { getQualitativeRating } from '@/types/scout-attributes';

interface ScoutAttributeDisplayProps {
  name: string;
  rating: number; // 1-20 scale
}

const ScoutAttributeDisplay: React.FC<ScoutAttributeDisplayProps> = ({ name, rating }) => {
  const { label, colorClass } = getQualitativeRating(rating);
  const progressValue = (rating / 20) * 100; // Scale 1-20 to 0-100 for Progress component

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-muted-foreground w-1/2">{name}</span>
      <div className="flex items-center w-1/2 space-x-2">
        <Progress value={progressValue} className="h-2 flex-1 bg-muted" indicatorClassName={colorClass} />
        <Badge className={cn("min-w-[80px] justify-center", colorClass)}>{label}</Badge>
      </div>
    </div>
  );
};

export default ScoutAttributeDisplay;