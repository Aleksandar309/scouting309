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
// Transformed for horizontal pitch (defense left, attack right)
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "10%", y: "50%" }, // Golman na levoj strani
  "CB": { x: "22%", y: "50%" },
  "LCB": { x: "22%", y: "30%" },
  "RCB": { x: "22%", y: "70%" },
  "LB": { x: "30%", y: "10%" },
  "RB": { x: "30%", y: "90%" },
  "DM": { x: "40%", y: "50%" },
  "LDM": { x: "40%", y: "30%" },
  "RDM": { x: "40%", y: "70%" },
  "LCM": { x: "50%", y: "30%" },
  "RCM": { x: "50%", y: "70%" },
  "CM": { x: "50%", y: "50%" },
  "LWB": { x: "45%", y: "10%" },
  "RWB": { x: "45%", y: "90%" },
  "AM": { x: "70%", y: "50%" },
  "LW": { x: "80%", y: "15%" },
  "RW": { x: "80%", y: "85%" },
  "CF": { x: "90%", y: "50%" }, // Generic CF
  "CF_CENTRAL": { x: "90%", y: "50%" },
  "CF_LEFT": { x: "90%", y: "35%" },
  "CF_RIGHT": { x: "90%", y: "65%" },
};

const PlayerPitch: React.FC<PlayerPitchProps> = ({ positionsData, formationPositions, onPositionClick }) => {
  const positionsToRender = formationPositions || positionsData;

  if (!positionsToRender) {
    return (
      <div className="relative w-full aspect-[3/2] max-w-[800px] mx-auto bg-background border-2 border-border rounded-lg overflow-hidden shadow-inner flex items-center justify-center text-muted-foreground">
        No position data available.
      </div>
    );
  }

  return (
    <TooltipProvider>
      {/* Main pitch container - now wider than tall, with max width and centered */}
      <div className="relative w-full aspect-[3/2] max-w-[800px] mx-auto bg-background border-2 border-border rounded-lg overflow-hidden shadow-inner">
        {/* Pitch Lines */}
        <div className="absolute inset-0">
          {/* Outer border (already on parent div) */}

          {/* Halfway line (vertical) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 h-full bg-pitch-line"></div>
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-solid border-pitch-line rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Left Penalty Box (Defense) */}
          <div className="absolute left-0 top-1/2 h-[70%] w-[20%] transform -translate-y-1/2">
            {/* 18-yard line */}
            <div className="absolute right-0 top-0 h-full w-0.5 bg-pitch-line"></div>
            {/* Top horizontal line */}
            <div className="absolute top-0 left-0 h-0.5 w-full bg-pitch-line"></div>
            {/* Bottom horizontal line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-pitch-line"></div>
            {/* Penalty spot */}
            <div className="absolute left-[30%] top-1/2 w-1.5 h-1.5 bg-pitch-line rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Penalty arc (semi-circle) */}
            <div className="absolute left-[30%] top-1/2 h-24 w-12 border-2 border-solid border-pitch-line rounded-r-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* 6-yard box (Goal Area) */}
            <div className="absolute left-0 top-1/2 h-[30%] w-[10%] transform -translate-y-1/2">
              <div className="absolute right-0 top-0 h-full w-0.5 bg-pitch-line"></div>
              <div className="absolute top-0 left-0 h-0.5 w-full bg-pitch-line"></div>
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-pitch-line"></div>
            </div>
          </div>

          {/* Right Penalty Box (Attack) */}
          <div className="absolute right-0 top-1/2 h-[70%] w-[20%] transform -translate-y-1/2">
            {/* 18-yard line */}
            <div className="absolute left-0 top-0 h-full w-0.5 bg-pitch-line"></div>
            {/* Top horizontal line */}
            <div className="absolute top-0 left-0 h-0.5 w-full bg-pitch-line"></div>
            {/* Bottom horizontal line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-pitch-line"></div>
            {/* Penalty spot */}
            <div className="absolute right-[30%] top-1/2 w-1.5 h-1.5 bg-pitch-line rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            {/* Penalty arc (semi-circle) */}
            <div className="absolute right-[30%] top-1/2 h-24 w-12 border-2 border-solid border-pitch-line rounded-l-full transform translate-x-1/2 -translate-y-1/2"></div>

            {/* 6-yard box (Goal Area) */}
            <div className="absolute right-0 top-1/2 h-[30%] w-[10%] transform -translate-y-1/2">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-pitch-line"></div>
              <div className="absolute top-0 left-0 h-0.5 w-full bg-pitch-line"></div>
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-pitch-line"></div>
            </div>
          </div>
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