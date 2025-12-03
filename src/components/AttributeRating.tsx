import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AttributeRatingProps {
  name: string;
  rating: number;
  className?: string;
}

const AttributeRating: React.FC<AttributeRatingProps> = ({ name, rating, className }) => {
  const progressValue = Math.min(Math.max(rating * 10, 0), 100); // Ensure value is between 0 and 100

  return (
    <div className={cn("flex items-center justify-between py-1", className)}>
      <span className="text-sm text-gray-300 w-1/2">{name}</span>
      <div className="flex items-center w-1/2">
        <Progress value={progressValue} className="h-2 w-full bg-gray-700" indicatorClassName="bg-blue-500" />
        <span className="ml-2 text-sm text-gray-300">{rating}</span>
      </div>
    </div>
  );
};

export default AttributeRating;