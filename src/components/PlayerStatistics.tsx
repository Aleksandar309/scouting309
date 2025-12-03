"use client";

import React from 'react';
import { CardContent } from "@/components/ui/card";

interface PlayerStatisticsProps {
  // Potentially pass player data here in the future
}

const PlayerStatistics: React.FC<PlayerStatisticsProps> = () => {
  return (
    <CardContent className="flex flex-col items-center justify-center h-full p-6 text-gray-300">
      <h3 className="text-xl font-semibold mb-4">Real-time Metrics (Coming Soon!)</h3>
      <p className="text-center">
        This section will display a radar chart and other real-time statistics for the player.
        Stay tuned for updates!
      </p>
      {/* Placeholder for a future radar chart or other statistics */}
      <div className="w-full h-48 bg-gray-700 rounded-md mt-6 flex items-center justify-center text-gray-500">
        [Statistics Radar Chart Placeholder]
      </div>
    </CardContent>
  );
};

export default PlayerStatistics;