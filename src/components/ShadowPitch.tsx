"use client";

import React, { useState, useEffect, useRef, createRef } from 'react'; // Import createRef
import { Formation, FormationPosition } from '@/types/formation';
import { ShadowTeamPlayer } from '@/types/shadow-team';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Draggable from 'react-draggable'; // Import Draggable

interface ShadowPitchProps {
  formation: Formation | null;
  playersByPosition: { [key: string]: ShadowTeamPlayer[] };
  onPositionClick: (positionName: string) => void;
  onPlayerRemove: (positionName: string, playerId: string) => void;
  onPlayerDragStop: (positionName: string, playerId: string, x: number, y: number) => void; // New prop for drag stop
  pitchColor: 'green' | 'theme';
}

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

const ShadowPitch: React.FC<ShadowPitchProps> = ({
  formation,
  playersByPosition,
  onPositionClick,
  onPlayerRemove,
  onPlayerDragStop, // Destructure new prop
  pitchColor,
}) => {
  const pitchBackgroundClass = pitchColor === 'green' ? 'bg-green-700' : 'bg-background';
  const pitchLineColorClass = pitchColor === 'green' ? 'border-white' : 'border-pitch-line';
  const textColorClass = pitchColor === 'green' ? 'text-white' : 'text-foreground';

  const pitchRef = useRef<HTMLDivElement>(null);
  const [pitchDimensions, setPitchDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Map to store refs for each draggable player
  const playerNodeRefs = useRef(new Map<string, React.RefObject<HTMLDivElement>>());

  useEffect(() => {
    const updateDimensions = () => {
      if (pitchRef.current) {
        setPitchDimensions({
          width: pitchRef.current.offsetWidth,
          height: pitchRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Effect to manage player refs in the map
  useEffect(() => {
    const allPlayerIdsInFormation: string[] = [];
    if (formation) {
      formation.positions.forEach(formPos => {
        const playersInPosition = playersByPosition[formPos.name] || [];
        playersInPosition.forEach(player => allPlayerIdsInFormation.push(player.id));
      });
    }

    // Remove refs for players no longer in the formation
    playerNodeRefs.current.forEach((_ref, id) => {
      if (!allPlayerIdsInFormation.includes(id)) {
        playerNodeRefs.current.delete(id);
      }
    });

    // Add refs for new players in the formation
    allPlayerIdsInFormation.forEach(id => {
      if (!playerNodeRefs.current.has(id)) {
        playerNodeRefs.current.set(id, createRef<HTMLDivElement>());
      }
    });
  }, [formation, playersByPosition]); // Depend on formation and playersByPosition to re-manage refs

  if (!formation) {
    return (
      <div className={cn(
        "relative w-full aspect-[3/2] max-w-[800px] mx-auto border-2 rounded-lg overflow-hidden shadow-inner flex items-center justify-center",
        pitchBackgroundClass,
        pitchLineColorClass
      )}>
        <p className={cn("text-xl", textColorClass)}>Please select a formation to start building your team.</p>
      </div>
    );
  }

  const getPixelCoordinate = (percent: string, totalDimension: number) => {
    return (parseFloat(percent) / 100) * totalDimension;
  };

  const getPlayerOffset = (playerIndex: number, totalPlayers: number) => {
    if (totalPlayers === 1) return { x: 0, y: 0 };
    const spread = 20;
    const offsetPerPlayer = spread / (totalPlayers - 1);
    const startOffset = -spread / 2;
    return {
      x: startOffset + playerIndex * offsetPerPlayer,
      y: startOffset + playerIndex * offsetPerPlayer,
    };
  };

  const pitchElements: JSX.Element[] = [];
  const playerDotSize = 40;

  formation.positions.forEach((formPos: FormationPosition) => {
    const playersInPosition = playersByPosition[formPos.name] || [];
    const hasPlayers = playersInPosition.length > 0;

    const initialCenterX = getPixelCoordinate(formPos.x, pitchDimensions.width);
    const initialCenterY = getPixelCoordinate(formPos.y, pitchDimensions.height);

    if (!hasPlayers) {
      pitchElements.push(
        <div
          key={`add-${formPos.name}`}
          className="absolute flex flex-col items-center justify-center"
          style={{
            left: formPos.x,
            top: formPos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <button
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200",
              pitchColor === 'green' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            )}
            onClick={() => onPositionClick(formPos.name)}
          >
            <PlusCircle className="h-6 w-6" />
          </button>
        </div>
      );
    } else {
      playersInPosition.forEach((player, playerIndex) => {
        const nodeRef = playerNodeRefs.current.get(player.id); // Get ref from map
        if (!nodeRef) return; // Should not happen if useEffect is correct

        const playerDotColor = player.dotColor || (pitchColor === 'green' ? 'bg-blue-500' : 'bg-primary');

        let defaultX = player.customX;
        let defaultY = player.customY;

        if (defaultX === undefined || defaultY === undefined) {
          defaultX = initialCenterX - (playerDotSize / 2);
          defaultY = initialCenterY - (playerDotSize / 2);
        }

        const offset = getPlayerOffset(playerIndex, playersInPosition.length);
        const finalX = (defaultX || 0) + offset.x;
        const finalY = (defaultY || 0) + offset.y;

        pitchElements.push(
          <Draggable
            key={player.id}
            nodeRef={nodeRef} // Use the ref from the map
            position={{ x: finalX, y: finalY }}
            onStop={(e, data) => onPlayerDragStop(formPos.name, player.id, data.x, data.y)}
            bounds="parent"
          >
            <div
              ref={nodeRef} // Assign the ref to the draggable div
              className={cn(
                "absolute rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200",
                playerDotColor
              )}
              style={{
                width: `${playerDotSize}px`,
                height: `${playerDotSize}px`,
                zIndex: 10 + playerIndex,
              }}
            >
              {/* Player content (Avatar, remove button) */}
              <Avatar className="h-8 w-8">
                <AvatarImage src={player.avatarUrl} alt={player.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{player.name.charAt(0)}</AvatarFallback> {/* Corrected AvatarFallback color */}
              </Avatar>
              <button
                className="absolute -top-1 -right-1 bg-destructive rounded-full h-4 w-4 flex items-center justify-center text-white text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayerRemove(formPos.name, player.id);
                }}
              >
                <MinusCircle className="h-3 w-3" />
              </button>
            </div>
          </Draggable>
        );
      });
    }
  });

  return (
    <TooltipProvider>
      <div
        ref={pitchRef}
        className={cn(
          "relative w-full aspect-[3/2] max-w-[800px] mx-auto border-2 rounded-lg overflow-hidden shadow-inner",
          pitchBackgroundClass,
          pitchLineColorClass
        )}
      >
        {/* Pitch Lines */}
        <div className="absolute inset-0">
          {/* Halfway line (vertical) */}
          <div className={cn("absolute top-0 bottom-0 left-1/2 w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
          {/* Center circle */}
          <div className={cn("absolute top-1/2 left-1/2 w-20 h-20 border-2 border-solid rounded-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass)}></div>

          {/* Left Penalty Box (Defense) */}
          <div className="absolute left-0 top-1/2 h-[70%] w-[20%] transform -translate-y-1/2">
            {/* 18-yard line */}
            <div className={cn("absolute right-0 top-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Top horizontal line */}
            <div className={cn("absolute top-0 left-0 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Bottom horizontal line */}
            <div className={cn("absolute bottom-0 left-0 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Penalty spot */}
            <div className={cn("absolute left-[30%] top-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Penalty arc (semi-circle) */}
            <div className={cn("absolute left-[30%] top-1/2 h-24 w-12 border-2 border-solid rounded-r-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass)}></div>

            {/* 6-yard box (Goal Area) */}
            <div className="absolute left-0 top-1/2 h-[30%] w-[10%] transform -translate-y-1/2">
              <div className={cn("absolute right-0 top-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
              <div className={cn("absolute top-0 left-0 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
              <div className={cn("absolute bottom-0 left-0 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            </div>
          </div>

          {/* Right Penalty Box (Attack) */}
          <div className="absolute right-0 top-1/2 h-[70%] w-[20%] transform -translate-y-1/2">
            {/* 18-yard line */}
            <div className={cn("absolute left-0 top-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Top horizontal line */}
            <div className={cn("absolute top-0 left-0 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Bottom horizontal line */}
            <div className={cn("absolute bottom-0 left-0 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Penalty spot */}
            <div className={cn("absolute right-[30%] top-1/2 w-1.5 h-1.5 rounded-full transform translate-x-1/2 -translate-y-1/2", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Penalty arc (semi-circle) */}
            <div className={cn("absolute right-[30%] top-1/2 h-24 w-12 border-2 border-solid rounded-l-full transform translate-x-1/2 -translate-y-1/2", pitchLineColorClass)}></div>

            {/* 6-yard box (Goal Area) */}
            <div className="absolute right-0 top-1/2 h-[30%] w-[10%] transform -translate-y-1/2">
              <div className={cn("absolute left-0 top-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
              <div className={cn("absolute top-0 left-0 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
              <div className={cn("absolute bottom-0 left-0 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            </div>
          </div>
        </div>
        {pitchElements}
      </div>
    </TooltipProvider>
  );
};

export default ShadowPitch;