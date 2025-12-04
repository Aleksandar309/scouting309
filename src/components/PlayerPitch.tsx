"use client";

import React from 'react';
import { PlayerPosition } from '@/types/player';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { PlayerFormationFitPosition } from '@/types/formation';

interface PlayerPitchProps {
  positionsData?: PlayerPosition[]; // Player's individual positions (optional)
  formationPositions?: PlayerFormationFitPosition[]; // Positions from a selected formation with player fit (optional)
  onPositionClick: (positionType: string) => void;
}

// Simplified mapping of common football positions to relative coordinates (percentage)
// Transformed for vertical pitch (defense top, attack bottom)
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "50%", y: "10%" }, // Golman na vrhu
  "CB": { x: "50%", y: "22%" },
  "LCB": { x: "30%", y: "22%" },
  "RCB": { x: "70%", y: "22%" },
  "LB": { x: "10%", y: "30%" },
  "RB": { x: "90%", y: "30%" },
  "DM": { x: "50%", y: "40%" },
  "LDM": { x: "30%", y: "40%" },
  "RDM": { x: "70%", y: "40%" },
  "LCM": { x: "30%", y: "50%" },
  "RCM": { x: "70%", y: "50%" },
  "CM": { x: "50%", y: "50%" },
  "LWB": { x: "10%", y: "55%" },
  "RWB": { x: "90%", y: "55%" },
  "AM": { x: "50%", y: "70%" },
  "LW": { x: "15%", y: "80%" },
  "RW": { x: "85%", y: "80%" },
  "CF": { x: "50%", y: "90%" }, // Generic CF
  "CF_CENTRAL": { x: "50%", y: "90%" },
  "CF_LEFT": { x: "35%", y: "90%" },
  "CF_RIGHT": { x: "65%", y: "90%" },
};

const PlayerPitch: React.FC<PlayerPitchProps> = ({ positionsData, formationPositions, onPositionClick }) => {
  const positionsToRender = formationPositions || positionsData;

  if (!positionsToRender) {
    return (
      <div className="relative w-full aspect-[3/2] max-h-[600px] mx-auto bg-background border-2 border-border rounded-lg overflow-hidden shadow-inner flex items-center justify-center text-muted-foreground">
        No position data available.
      </div>
    );
  }

  return (
    <TooltipProvider>
      {/* Main pitch container - now wider than tall, with max height and centered */}
      <div className="relative w-full aspect-[3/2] max-h-[600px] mx-auto bg-background border-2 border-border rounded-lg overflow-hidden shadow-inner">
        {/* Pitch Lines */}
        <div className="absolute inset-0 border-pitch-line border-dashed border-opacity-50">
          {/* Halfway line (horizontal) */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pitch-line bg-opacity-50 transform -translate-y-1/2"></div>
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-pitch-line border-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Top Penalty Box (defense goal area) */}
          {/* 18-yard line */}
          <div className="absolute top-[10%] left-1/2 w-[70%] h-0.5 bg-pitch-line bg-opacity-50 transform -translate-x-1/2"></div>
          {/* Left vertical line */}
          <div className="absolute top-0 left-[15%] w-0.5 h-[10%] bg-pitch-line bg-opacity-50"></div>
          {/* Right vertical line */}
          <div className="absolute top-0 right-[15%] w-0.5 h-[10%] bg-pitch-line bg-opacity-50"></div>

          {/* Bottom Penalty Box (attacking penalty area) */}
          {/* 18-yard line */}
          <div className="absolute bottom-[10%] left-1/2 w-[70%] h-0.5 bg-pitch-line bg-opacity-50 transform -translate-x-1/2"></div>
          {/* Left vertical line */}
          <div className="absolute bottom-0 left-[15%] w-0.5 h-[10%] bg-pitch-line bg-opacity-50"></div>
          {/* Right vertical line */}
          <div className="absolute bottom-0 right-[15%] w-0.5 h-[10%] bg-pitch-line bg-opacity-50"></div>
        </div>

        {positionsToRender.map((pos, index) => {
          const coords = positionCoordinates[pos.name] || { x: pos.x, y: pos.y };
          if (!coords || !coords.x || !coords.y) return null;

          let circleClasses = "";
          let displayedName = pos.name;

          if (pos.name.startsWith("CF_")) {
            displayedName = "CF";
          }

          let tooltipText = `${pos.name}`;

          if ('type' in pos && (pos.type === "natural" || pos.type === "alternative" || pos.type === "tertiary" || pos.type === "unsuited")) {
            tooltipText = `${pos.name} (Fit: ${pos.type}, Rating: ${pos.rating}/10)`;
            switch (pos.type) {
              case "natural":
                circleClasses = "bg-pitch-natural border-2 border-pitch-natural w-6 h-6 text-sm font-bold";
                break;
              case "alternative":
                circleClasses = "bg-pitch-alternative border-2 border-pitch-alternative w-5 h-5 text-xs";
                break;
              case "tertiary":
                circleClasses = "bg-pitch-tertiary border-2 border-pitch-tertiary w-4 h-4 text-xs";
                break;
              case "unsuited":
                circleClasses = "bg-pitch-unsuited border-2 border-pitch-unsuited w-4 h-4 text-xs opacity-50";
                tooltipText = `${pos.name} (Unsuited)`;
                break;
            }
          } else {
            tooltipText = `${pos.name} (${pos.rating}/10)`;
            switch (pos.type) {
              case "natural":
                circleClasses = "bg-pitch-natural border-2 border-pitch-natural w-6 h-6 text-sm font-bold";
                break;
              case "alternative":
                circleClasses = "bg-pitch-alternative border-2 border-pitch-alternative w-5 h-5 text-xs";
                break;
              case "tertiary":
                circleClasses = "bg-pitch-tertiary border-2 border-pitch-tertiary w-4 h-4 text-xs";
                break;
            }
          }

          const rating = 'rating' in pos ? pos.rating : 0;
          const opacity = Math.max(0.3, rating / 10);

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute rounded-full flex items-center justify-center text-text-on-colored-background cursor-pointer transition-all duration-200",
                    circleClasses
                  )}
                  style={{
                    left: coords.x,
                    top: coords.y,
                    transform: "translate(-50%, -50%)",
                    opacity: opacity,
                  }}
                  onClick={() => onPositionClick(pos.name)}
                >
                  {displayedName}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border-border">
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