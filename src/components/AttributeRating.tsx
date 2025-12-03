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

  const getIndicatorColor = (rating: number) => {
    if (rating <= 2) {
      return "bg-red-500";
    } else if (rating <= 4) {
      return "bg-orange-500";
    } else if (rating <= 6) {
      return "bg-yellow-500";
    } else if (rating <= 8) {
      return "bg-green-500";
    } else {
      return "bg-emerald-600"; // Darker green for higher ratings
    }
  };

  return (
    <div className={cn("flex items-center justify-between py-1", className)}>
      <span className="text-sm text-gray-300 w-1/2">{name}</span>
      <div className="flex items-center w-1/2">
        {/* Removed bg-gray-700 from className to allow indicatorClassName to take full effect */}
        <Progress value={progressValue} className="h-2 w-full" indicatorClassName={getIndicatorColor(rating)} />
        <span className="ml-2 text-sm text-gray-300">{rating}</span>
      </div>
    </div>
  );
};

export default AttributeRating;