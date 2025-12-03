"use client";

import React from 'react';
import { PlayerPosition } from '@/types/player';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface PlayerPitchProps {
  positionsData: PlayerPosition[];
}

// Simplified mapping of common football positions to relative coordinates (percentage)
// This is a generic pitch, not specific to any formation.
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "50%", y: "95%" }, // Goalkeeper
  "CB": { x: "50%", y: "80%" }, // Center Back
  "LCB": { x: "35%", y: "80%" }, // Left Center Back
  "RCB": { x: "65%", y: "80%" }, // Right Center Back
  "LB": { x: "15%", y: "75%" }, // Left Back
  "RB": { x: "85%", y: "75%" }, // Right Back
  "CDM": { x: "50%", y: "65%" }, // Defensive Midfielder
  "LCM": { x: "35%", y: "50%" }, // Left Central Midfielder
  "RCM": { x: "65%", y: "50%" }, // Right Central Midfielder
  "CM": { x: "50%", y: "50%" }, // Central Midfielder (general)
  "LM": { x: "15%", y: "45%" }, // Left Midfielder
  "RM": { x: "85%", y: "45%" }, // Right Midfielder
  "CAM": { x: "50%", y: "35%" }, // Attacking Midfielder
  "LW": { x: "15%", y: "25%" }, // Left Winger
  "RW": { x: "85%", y: "25%" }, // Right Winger
  "ST": { x: "50%", y: "15%" }, // Striker
  "LS": { x: "35%", y: "15%" }, // Left Striker
  "RS": { x: "65%", y: "15%" }, // Right Striker
};

const PlayerPitch: React.FC<PlayerPitchProps> = ({ positionsData }) => {
  return (
    <TooltipProvider>
      <div className="relative w-full h-64 bg-green-700 border-2 border-white rounded-lg overflow-hidden shadow-inner">
        {/* Pitch Lines (simplified) */}
        <div className="absolute inset-0 border-white border-dashed border-opacity-50">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white bg-opacity-50 transform -translate-y-1/2"></div>
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white border-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          {/* Penalty boxes (simplified) */}
          <div className="absolute top-0 left-1/2 w-2/3 h-1/4 border-b-2 border-l-2 border-r-2 border-white border-opacity-50 transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-2/3 h-1/4 border-t-2 border-l-2 border-r-2 border-white border-opacity-50 transform -translate-x-1/2"></div>
        </div>

        {positionsData.map((pos, index) => {
          const coords = positionCoordinates[pos.name];
          if (!coords) return null;

          let circleClasses = "";
          let tooltipText = `${pos.name} (${pos.rating}/10)`;

          switch (pos.type) {
            case "natural":
              circleClasses = "bg-blue-500 border-2 border-blue-300 w-6 h-6 text-sm font-bold";
              tooltipText = `Natural: ${pos.name} (${pos.rating}/10)`;
              break;
            case "alternative":
              circleClasses = "bg-yellow-500 border-2 border-yellow-300 w-5 h-5 text-xs";
              tooltipText = `Alternative: ${pos.name} (${pos.rating}/10)`;
              break;
            case "tertiary":
              circleClasses = "bg-gray-500 border-2 border-gray-300 w-4 h-4 text-xs";
              tooltipText = `Tertiary: ${pos.name} (${pos.rating}/10)`;
              break;
          }

          // Adjust opacity based on rating (0-10)
          const opacity = Math.max(0.3, pos.rating / 10); // Min opacity 0.3 for visibility

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200",
                    circleClasses
                  )}
                  style={{
                    left: coords.x,
                    top: coords.y,
                    transform: "translate(-50%, -50%)",
                    opacity: opacity,
                  }}
                >
                  {pos.name}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-700 text-white border-gray-600">
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default PlayerPitch;