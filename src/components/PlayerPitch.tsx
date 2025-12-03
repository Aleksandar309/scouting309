"use client";

import React from 'react';
import { PlayerPosition } from '@/types/player';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface PlayerPitchProps {
  positionsData: PlayerPosition[];
  onPositionClick: (positionType: string) => void; // New prop
}

// Simplified mapping of common football positions to relative coordinates (percentage)
// Adjusted for a horizontal pitch orientation (rotated 90 degrees clockwise from vertical)
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  // Original (vertical) -> Transformed (horizontal)
  // GK: { x: "50%", y: "90%" } -> { x: "10%", y: "50%" }
  "GK": { x: "10%", y: "50%" },
  // CB: { x: "50%", y: "78%" } -> { x: "22%", y: "50%" }
  "CB": { x: "22%", y: "50%" },
  // LCB: { x: "30%", y: "78%" } -> { x: "22%", y: "30%" }
  "LCB": { x: "22%", y: "30%" },
  // RCB: { x: "70%", y: "78%" } -> { x: "22%", y: "70%" }
  "RCB": { x: "22%", y: "70%" },
  // LB: { x: "10%", y: "70%" } -> { x: "30%", y: "10%" }
  "LB": { x: "30%", y: "10%" },
  // RB: { x: "90%", y: "70%" } -> { x: "30%", y: "90%" }
  "RB": { x: "30%", y: "90%" },
  // CDM: { x: "50%", y: "60%" } -> { x: "40%", y: "50%" }
  "CDM": { x: "40%", y: "50%" },
  // LCM: { x: "30%", y: "50%" } -> { x: "50%", y: "30%" }
  "LCM": { x: "50%", y: "30%" },
  // RCM: { x: "70%", y: "50%" } -> { x: "50%", y: "70%" }
  "RCM": { x: "50%", y: "70%" },
  // CM: { x: "50%", y: "50%" } -> { x: "50%", y: "50%" }
  "CM": { x: "50%", y: "50%" },
  // LM: { x: "10%", y: "40%" } -> { x: "60%", y: "10%" }
  "LM": { x: "60%", y: "10%" },
  // RM: { x: "90%", y: "40%" } -> { x: "60%", y: "90%" }
  "RM": { x: "60%", y: "90%" },
  // CAM: { x: "50%", y: "30%" } -> { x: "70%", y: "50%" }
  "CAM": { x: "70%", y: "50%" },
  // LW: { x: "15%", y: "20%" } -> { x: "80%", y: "15%" }
  "LW": { x: "80%", y: "15%" },
  // RW: { x: "85%", y: "20%" } -> { x: "80%", y: "85%" }
  "RW": { x: "80%", y: "85%" },
  // ST: { x: "50%", y: "10%" } -> { x: "90%", y: "50%" }
  "ST": { x: "90%", y: "50%" },
  // LS: { x: "35%", y: "10%" } -> { x: "90%", y: "35%" }
  "LS": { x: "90%", y: "35%" },
  // RS: { x: "65%", y: "10%" } -> { x: "90%", y: "65%" }
  "RS": { x: "90%", y: "65%" },
};

const PlayerPitch: React.FC<PlayerPitchProps> = ({ positionsData, onPositionClick }) => {
  return (
    <TooltipProvider>
      {/* Main pitch container - now horizontal, with max height and centered */}
      <div className="relative w-full aspect-[3/2] max-h-[300px] mx-auto bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden shadow-inner">
        {/* Pitch Lines (simplified) */}
        <div className="absolute inset-0 border-gray-600 border-dashed border-opacity-50">
          {/* Halfway line (now vertical) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600 bg-opacity-50 transform -translate-x-1/2"></div>
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-gray-600 border-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          {/* Penalty boxes (now on left/right sides) */}
          {/* Left Penalty Box */}
          <div className="absolute left-0 top-1/2 h-[70%] w-[20%] border-r-2 border-t-2 border-b-2 border-gray-600 border-opacity-50 transform -translate-y-1/2 rounded-l-lg"></div>
          {/* Right Penalty Box */}
          <div className="absolute right-0 top-1/2 h-[70%] w-[20%] border-l-2 border-t-2 border-b-2 border-gray-600 border-opacity-50 transform -translate-y-1/2 rounded-r-lg"></div>
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
                  onClick={() => onPositionClick(pos.name)} // Added onClick
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