"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Player } from "@/types/player";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const currentAbilityProgress = Math.min(Math.max(player.scoutingProfile.currentAbility * 10, 0), 100);
  const potentialAbilityProgress = Math.min(Math.max(player.scoutingProfile.potentialAbility * 10, 0), 100);

  return (
    <Card className="bg-card border-border text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={player.avatarUrl} alt={player.name} />
          <AvatarFallback className="bg-blue-600 text-white text-lg">{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl font-semibold truncate">
            <Link to={`/player/${player.id}`} className="hover:underline text-blue-400">
              {player.name}
            </Link>
          </CardTitle>
          <p className="text-muted-foreground">{player.team}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <div className="mb-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {player.positions.map((pos) => (
              <Badge key={pos} variant="secondary" className="bg-muted text-muted-foreground">
                {pos}
              </Badge>
            ))}
            {player.priorityTarget && <Badge className="bg-yellow-600 text-white">Priority</Badge>}
            {player.criticalPriority && <Badge className="bg-red-600 text-white">Critical</Badge>}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Nationality:</span> {player.nationality}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Age:</span> {player.age}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Value:</span> {player.value}
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Current Ability: {player.scoutingProfile.currentAbility}</div>
            <Progress value={currentAbilityProgress} className="h-2 bg-muted" indicatorClassName="bg-blue-500" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Potential Ability: {player.scoutingProfile.potentialAbility}</div>
            <Progress value={potentialAbilityProgress} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;