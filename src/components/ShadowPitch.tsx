"use client";

import React, { useState, useEffect, useRef, createRef } from 'react';
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

// Transformed for vertical pitch (defense bottom, attack top)
const positionCoordinates: { [key: string]: { x: string; y: string } } = {
  "GK": { x: "50%", y: "90%" }, // Golman na dnu
  "CB": { x: "50%", y: "78%" },
  "LCB": { x: "30%", y: "78%" },
  "RCB": { x: "70%", y: "78%" },
  "LB": { x: "10%", y: "70%" },
  "RB": { x: "90%", y: "70%" },
  "DM": { x: "50%", y: "60%" },
  "LDM": { x: "30%", y: "60%" },
  "RDM": { x: "70%", y: "60%" },
  "LCM": { x: "30%", y: "50%" },
  "RCM": { x: "70%", y: "50%" },
  "CM": { x: "50%", y: "50%" },
  "LWB": { x: "10%", y: "55%" },
  "RWB": { x: "90%", y: "55%" },
  "AM": { x: "50%", y: "30%" },
  "LW": { x: "15%", y: "20%" },
  "RW": { x: "85%", y: "20%" },
  "CF": { x: "50%", y: "10%" }, // Generic CF
  "CF_CENTRAL": { x: "50%", y: "10%" },
  "CF_LEFT": { x: "35%", y: "10%" },
  "CF_RIGHT": { x: "65%", y: "10%" },
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

  useEffect(() => {
    const allPlayerIdsInFormation: string[] = [];
    if (formation) {
      formation.positions.forEach(formPos => {
        const playersInPosition = playersByPosition[formPos.name] || [];
        playersInPosition.forEach(player => allPlayerIdsInFormation.push(player.id));
      });
    }

    playerNodeRefs.current.forEach((_ref, id) => {
      if (!allPlayerIdsInFormation.includes(id)) {
        playerNodeRefs.current.delete(id);
      }
    });

    allPlayerIdsInFormation.forEach(id => {
      if (!playerNodeRefs.current.has(id)) {
        playerNodeRefs.current.set(id, createRef<HTMLDivElement>());
      }
    });
  }, [formation, playersByPosition]);

  if (!formation) {
    return (
      <div className={cn(
        "relative w-full aspect-[2/3] max-w-[520px] mx-auto border-2 rounded-lg overflow-hidden shadow-inner flex items-center justify-center",
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

  // Adjusted spread for smaller player dots
  const getPlayerOffset = (playerIndex: number, totalPlayers: number) => {
    if (totalPlayers === 1) return { x: 0, y: 0 };
    const spread = 20; // Reduced spread for smaller dots
    const offsetPerPlayer = spread / (totalPlayers - 1);
    const startOffset = -spread / 2;
    return {
      x: startOffset + playerIndex * offsetPerPlayer,
      y: startOffset + playerIndex * offsetPerPlayer,
    };
  };

  const pitchElements: JSX.Element[] = [];
  const playerDotSize = 24; // Reduced player dot size (from 40 to 24)

  formation.positions.forEach((formPos: FormationPosition) => {
    const playersInPosition = playersByPosition[formPos.name] || [];
    const hasPlayers = playersInPosition.length > 0;

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
              "w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-200", // Reduced button size (from w-10 h-10 to w-8 h-8)
              pitchColor === 'green' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            )}
            onClick={() => onPositionClick(formPos.name)}
          >
            <PlusCircle className="h-5 w-5" /> {/* Reduced icon size (from h-6 w-6 to h-5 w-5) */}
          </button>
        </div>
      );
    } else {
      const initialCenterX = getPixelCoordinate(formPos.x, pitchDimensions.width);
      const initialCenterY = getPixelCoordinate(formPos.y, pitchDimensions.height);

      playersInPosition.forEach((player, playerIndex) => {
        const nodeRef = playerNodeRefs.current.get(player.id);
        if (!nodeRef) return;

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
            nodeRef={nodeRef}
            position={{ x: finalX, y: finalY }}
            onStop={(e, data) => onPlayerDragStop(formPos.name, player.id, data.x, data.y)}
            bounds="parent"
          >
            <div
              ref={nodeRef}
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
              <Avatar className="h-6 w-6"> {/* Reduced avatar size (from h-8 w-8 to h-6 w-6) */}
                <AvatarImage src={player.avatarUrl} alt={player.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <button
                className="absolute -top-1 -right-1 bg-destructive rounded-full h-3 w-3 flex items-center justify-center text-white text-xs" // Reduced remove button size
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayerRemove(formPos.name, player.id);
                }}
              >
                <MinusCircle className="h-2 w-2" /> {/* Reduced remove icon size */}
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
          "relative w-full aspect-[2/3] max-w-[520px] mx-auto border-2 rounded-lg overflow-hidden shadow-inner",
          pitchBackgroundClass,
          pitchLineColorClass
        )}
      >
        {/* Pitch Lines */}
        <div className="absolute inset-0">
          {/* Halfway line (horizontal) */}
          <div className={cn("absolute left-0 right-0 top-1/2 h-0.5 w-full", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
          {/* Center circle */}
          <div className={cn("absolute top-1/2 left-1/2 w-20 h-20 border-2 border-solid rounded-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass)}></div>

          {/* Bottom Penalty Box (Defense) */}
          <div className="absolute bottom-0 left-1/2 w-[70%] h-[20%] transform -translate-x-1/2">
            {/* 18-yard line */}
            <div className={cn("absolute top-0 left-0 w-full h-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Left vertical line */}
            <div className={cn("absolute top-0 left-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Right vertical line */}
            <div className={cn("absolute top-0 right-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Penalty spot */}
            <div className={cn("absolute top-[30%] left-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Penalty arc (semi-circle) */}
            <div className={cn("absolute top-[30%] left-1/2 h-12 w-24 border-2 border-solid rounded-t-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass)}></div>

            {/* 6-yard box (Goal Area) */}
            <div className="absolute bottom-0 left-1/2 w-[30%] h-[10%] transform -translate-x-1/2">
              <div className={cn("absolute top-0 left-0 w-full h-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
              <div className={cn("absolute top-0 left-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
              <div className={cn("absolute top-0 right-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            </div>
          </div>

          {/* Top Penalty Box (Attack) */}
          <div className="absolute top-0 left-1/2 w-[70%] h-[20%] transform -translate-x-1/2">
            {/* 18-yard line */}
            <div className={cn("absolute bottom-0 left-0 w-full h-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Left vertical line */}
            <div className={cn("absolute top-0 left-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Right vertical line */}
            <div className={cn("absolute top-0 right-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Penalty spot */}
            <div className={cn("absolute bottom-[30%] left-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            {/* Penalty arc (semi-circle) */}
            <div className={cn("absolute bottom-[30%] left-1/2 h-12 w-24 border-2 border-solid rounded-b-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass)}></div>

            {/* 6-yard box (Goal Area) */}
            <div className="absolute top-0 left-1/2 w-[30%] h-[10%] transform -translate-x-1/2">
              <div className={cn("absolute bottom-0 left-0 w-full h-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
              <div className={cn("absolute top-0 left-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
              <div className={cn("absolute top-0 right-0 h-full w-0.5", pitchLineColorClass, pitchColor === 'green' ? 'bg-white' : 'bg-pitch-line')}></div>
            </div>
          </div>
        </div>
        {pitchElements}
      </div>
    </TooltipProvider>
  );
};

export default ShadowPitch;