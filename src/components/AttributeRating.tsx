import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AttributeRatingProps {
  name: string;
  rating: number;
  className?: string;
  highlightType?: 'primary' | 'secondary' | 'tertiary' | null; // New prop
}

const AttributeRating: React.FC<AttributeRatingProps> = ({ name, rating, className, highlightType }) => {
  const progressValue = Math.min(Math.max(rating * 10, 0), 100); // Ensure value is between 0 and 100

  const highlightClasses = {
    primary: "bg-blue-800 ring-2 ring-blue-500", // Strong highlight for primary
    secondary: "bg-purple-800 ring-1 ring-purple-500", // Medium highlight for secondary
    tertiary: "bg-gray-600 ring-1 ring-gray-400", // Subtle highlight for tertiary
  };

  return (
    <div className={cn(
      "flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200",
      highlightType ? highlightClasses[highlightType] : "", // Apply highlight classes
      className
    )}>
      <span className={cn("text-sm w-1/2", highlightType ? "text-white" : "text-gray-300")}>{name}</span>
      <div className="flex items-center w-1/2">
        {/* Postavljamo pozadinu trake na svetliju sivu (bg-gray-500) i boju ispune na belu (bg-white) za jasan kontrast */}
        <Progress 
          value={progressValue} 
          className="h-2 w-full bg-gray-500" // Pozadina trake je sada svetlija siva
          indicatorClassName="bg-white" // Boja ispune ostaje bela
        />
        <span className={cn("ml-2 text-sm", highlightType ? "text-white" : "text-gray-300")}>{rating}</span>
      </div>
    </div>
  );
};

export default AttributeRating;