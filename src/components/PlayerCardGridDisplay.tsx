"use client";

import React from 'react';
import { Player } from '@/types/player';
import PlayerCard from './PlayerCard';

interface PlayerCardGridDisplayProps {
  players: Player[];
}

const PlayerCardGridDisplay: React.FC<PlayerCardGridDisplayProps> = ({ players }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
};

export default PlayerCardGridDisplay;