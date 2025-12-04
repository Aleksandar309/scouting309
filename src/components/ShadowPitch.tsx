"use client";

import React from 'react';
import { Formation, FormationPosition } from '@/types/formation';
import { ShadowTeamPlayer } from '@/types/shadow-team';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ShadowPitchProps {
  formation: Formation | null;
  playersByPosition: { [key: string]: ShadowTeamPlayer[] };
  onPositionClick: (positionName: string) => void;
  onPlayerRemove: (positionName: string, playerId: string) => void;
  pitchColor: 'green' | 'theme';
}

const ShadowPitch: React.FC<ShadowPitchProps> = ({
  formation,
  playersByPosition,
  onPositionClick,
  onPlayerRemove,
  pitchColor,
}) => {
  const pitchBackgroundClass = pitchColor === 'green' ? 'bg-green-700' : 'bg-background';
  const pitchLineColorClass = pitchColor === 'green' ? 'border-white' : 'border-pitch-line';
  const textColorClass = pitchColor === 'green' ? 'text-white' : 'text-foreground';

  if (!formation) {
    return (
      <div className={cn(
        "relative w-full aspect-[3/2] max-h-[500px] mx-auto border-2 rounded-lg overflow-hidden shadow-inner flex items-center justify-center",
        pitchBackgroundClass,
        pitchLineColorClass
      )}>
        <p className={cn("text-xl", textColorClass)}>Please select a formation to start building your team.</p>
      </div>
    );
  }

  // Helper to get offset for multiple players in a single position
  const getPlayerOffset = (playerIndex: number, totalPlayers: number) => {
    if (totalPlayers === 1) return { x: 0, y: 0 };
    const spread = 20; // Max spread in pixels
    const offsetPerPlayer = spread / (totalPlayers - 1);
    const startOffset = -spread / 2;
    return {
      x: startOffset + playerIndex * offsetPerPlayer,
      y: startOffset + playerIndex * offsetPerPlayer,
    };
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "relative w-full aspect-[3/2] max-h-[500px] mx-auto border-2 rounded-lg overflow-hidden shadow-inner",
        pitchBackgroundClass,
        pitchLineColorClass
      )}>
        {/* Pitch Lines */}
        <div className={cn("absolute inset-0 border-dashed border-opacity-50", pitchLineColorClass)}>
          {/* Halfway line (vertical) */}
          <div className={cn("absolute left-1/2 top-0 bottom-0 w-0.5 bg-opacity-50 transform -translate-x-1/2", pitchLineColorClass)}></div>
          {/* Center circle */}
          <div className={cn("absolute top-1/2 left-1/2 w-20 h-20 border-2 rounded-full transform -translate-x-1/2 -translate-y-1/2", pitchLineColorClass)}></div>
          {/* Penalty boxes */}
          <div className={cn("absolute left-0 top-1/2 h-[70%] w-[20%] border-r-2 border-t-2 border-b-2 transform -translate-y-1/2 rounded-l-lg", pitchLineColorClass)}></div>
          <div className={cn("absolute right-0 top-1/2 h-[70%] w-[20%] border-l-2 border-t-2 border-b-2 transform -translate-y-1/2 rounded-r-lg", pitchLineColorClass)}></div>
        </div>

        {formation.positions.map((formPos: FormationPosition) => {
          const playersInPosition = playersByPosition[formPos.name] || [];
          const hasPlayers = playersInPosition.length > 0;

          return (
            <div
              key={formPos.name}
              className="absolute flex flex-col items-center justify-center"
              style={{
                left: formPos.x,
                top: formPos.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Position Label */}
              <span className={cn(
                "text-xs font-bold mb-1 px-1 rounded",
                pitchColor === 'green' ? 'bg-black bg-opacity-50 text-white' : 'bg-muted text-muted-foreground'
              )}>
                {formPos.name}
              </span>

              {/* Player Slots / Add Player Button */}
              <div className="relative flex flex-col items-center justify-center">
                {hasPlayers ? (
                  playersInPosition.map((player, playerIndex) => {
                    const offset = getPlayerOffset(playerIndex, playersInPosition.length);
                    const playerDotColor = player.dotColor || (pitchColor === 'green' ? 'bg-blue-500' : 'bg-primary');
                    const playerTextColor = pitchColor === 'green' ? 'text-white' : 'text-primary-foreground';

                    return (
                      <Tooltip key={player.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "absolute rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 p-1",
                              playerDotColor
                            )}
                            style={{
                              width: '40px',
                              height: '40px',
                              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                              zIndex: 10 + playerIndex,
                            }}
                            onClick={() => onPositionClick(formPos.name)} // Click player dot to edit/add
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={player.avatarUrl} alt={player.name} />
                              <AvatarFallback className="bg-gray-600 text-white text-xs">{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <button
                              className="absolute -top-1 -right-1 bg-destructive rounded-full h-4 w-4 flex items-center justify-center text-white text-xs"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering onPositionClick
                                onPlayerRemove(formPos.name, player.id);
                              }}
                            >
                              <MinusCircle className="h-3 w-3" />
                            </button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border-border">
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-sm">Age: {player.age}</p>
                          <p className="text-sm">CA: {player.currentAbility} | PA: {player.potentialAbility}</p>
                          {player.note && <p className="text-xs italic mt-1">Note: {player.note}</p>}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })
                ) : (
                  <button
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200",
                      pitchColor === 'green' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    onClick={() => onPositionClick(formPos.name)}
                  >
                    <PlusCircle className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default ShadowPitch;