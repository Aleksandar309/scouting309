import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { PlayerAttribute } from '@/types/player';

interface RadarChartProps {
  playerAttributes: PlayerAttribute[];
}

const RadarChart: React.FC<RadarChartProps> = ({ playerAttributes }) => {
  // Map player attributes to the format expected by Recharts
  const data = playerAttributes.map(attr => ({
    attribute: attr.name,
    value: attr.rating,
    fullMark: 10, // Max rating for the scale
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#4b5563" /> {/* Darker grid lines */}
        <PolarAngleAxis dataKey="attribute" stroke="#d1d5db" tick={{ fill: '#d1d5db', fontSize: 10 }} /> {/* Light gray labels */}
        <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#4b5563" tick={{ fill: '#d1d5db', fontSize: 10 }} /> {/* Light gray labels */}
        <Radar name="Player Rating" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} /> {/* Blue color */}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;