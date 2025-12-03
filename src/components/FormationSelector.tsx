"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Formation } from '@/types/formation';
import { Star, StarHalf } from 'lucide-react'; // Import star icons

// Extend Formation type to include overallFit for display
interface FormationWithFit extends Formation {
  overallFit: number;
}

interface FormationSelectorProps {
  formations: FormationWithFit[];
  selectedFormationId: string | null;
  onSelectFormation: (formationId: string) => void;
  getStarRating: (overallFit: number) => number; // Pass the star rating function
}

const FormationSelector: React.FC<FormationSelectorProps> = ({
  formations,
  selectedFormationId,
  onSelectFormation,
  getStarRating,
}) => {
  const renderStars = (fitPercentage: number) => {
    const starRating = getStarRating(fitPercentage);
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    // Fill remaining with empty stars for visual consistency up to 3 stars
    for (let i = stars.length; i < 3; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-500" />);
    }
    return <div className="flex items-center ml-2">{stars}</div>;
  };

  return (
    <Select value={selectedFormationId || ""} onValueChange={onSelectFormation}>
      <SelectTrigger className="w-[220px] bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
        <SelectValue placeholder="Select Formation" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700 text-white">
        {formations.map((formation) => (
          <SelectItem key={formation.id} value={formation.id} className="flex items-center">
            <div className="flex items-center justify-between w-full">
              <span>{formation.name}</span>
              {renderStars(formation.overallFit)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FormationSelector;