"use client";

import React from 'react';
import { PlayerPosition } from '@/types/player';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface PlayerPitchProps {
  positionsData: PlayerPosition[];
}

// Simplified mapping of common football positions to relative coordinates (percentage)
// Adjusted for a vertical pitch orientation
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "50%", y: "90%" }, // Goalkeeper (bottom)
  "CB": { x: "50%", y: "78%" }, // Center Back
  "LCB": { x: "30%", y: "78%" }, // Left Center Back
  "RCB": { x: "70%", y: "78%" }, // Right Center Back
  "LB": { x: "10%", y: "70%" }, // Left Back
  "RB": { x: "90%", y: "70%" }, // Right Back
  "CDM": { x: "50%", y: "60%" }, // Defensive Midfielder
  "LCM": { x: "30%", y: "50%" }, // Left Central Midfielder
  "RCM": { x: "70%", y: "50%" }, // Right Central Midfielder
  "CM": { x: "50%", y: "50%" }, // Central Midfielder (general)
  "LM": { x: "10%", y: "40%" }, // Left Midfielder
  "RM": { x: "90%", y: "40%" }, // Right Midfielder
  "CAM": { x: "50%", y: "30%" }, // Attacking Midfielder
  "LW": { x: "15%", y: "20%" }, // Left Winger
  "RW": { x: "85%", y: "20%" }, // Right Winger
  "ST": { x: "50%", y: "10%" }, // Striker (top)
  "LS": { x: "35%", y: "10%" }, // Left Striker
  "RS": { x: "65%", y: "10%" }, // Right Striker
};

const PlayerPitch: React.FC<PlayerPitchProps> = ({ positionsData }) => {
  return (
    <TooltipProvider>
      {/* Main pitch container - now responsive with aspect ratio */}
      <div className="relative w-full aspect-[2/3] bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden shadow-inner">
        {/* Pitch Lines (simplified) */}
        <div className="absolute inset-0 border-gray-600 border-dashed border-opacity-50">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600 bg-opacity-50 transform -translate-y-1/2"></div>
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-gray-600 border-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          {/* Penalty boxes (simplified) - adjusted width/height and removed individual rounded corners */}
          <div className="absolute top-0 left-1/2 w-[70%] h-[20%] border-b-2 border-l-2 border-r-2 border-gray-600 border-opacity-50 transform -translate-x-1/2 rounded-t-lg"></div>
          <div className="absolute bottom-0 left-1/2 w-[70%] h-[20%] border-t-2 border-l-2 border-r-2 border-gray-600 border-opacity-50 transform -translate-x-1/2 rounded-b-lg"></div>
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