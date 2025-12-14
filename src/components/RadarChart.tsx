"use client";

import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Player } from '@/types/player';
import { FmRole, getAttributesByCategory } from '@/utils/fm-roles';

interface RadarChartProps {
  player: Player;
  selectedRole: FmRole | null;
}

const RadarChart: React.FC<RadarChartProps> = ({ player, selectedRole }) => {
  let data: { attribute: string; value: number; fullMark: number; weight?: number }[] = [];
  let axisLabelColors: { [key: string]: string } = {};

  if (!selectedRole) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a role to view its attribute radar.
      </div>
    );
  }

  data = selectedRole.attributes.map(roleAttr => {
    const playerCategoryAttrs = getAttributesByCategory(player, roleAttr.category);
    const playerAttr = playerCategoryAttrs.find(attr => attr.name === roleAttr.name);
    const rating = playerAttr ? playerAttr.rating : 0;

    let color = 'hsl(var(--chart-axis-label))';
    if (roleAttr.weight === 3) color = 'hsl(var(--role-primary))';
    else if (roleAttr.weight === 2) color = 'hsl(var(--role-secondary))';
    else if (roleAttr.weight === 1) color = 'hsl(var(--role-tertiary))';
    axisLabelColors[roleAttr.name] = color;

    return {
      attribute: roleAttr.name,
      value: rating,
      fullMark: 10,
      weight: roleAttr.weight,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="hsl(var(--chart-grid))" />
        <PolarAngleAxis
          dataKey="attribute"
          stroke="hsl(var(--chart-axis-label))"
          tick={({ payload, x, y, cx, cy }) => {
            const textAnchor = x > cx ? 'start' : 'end';
            const fill = axisLabelColors[payload.value] || 'hsl(var(--chart-axis-label))';
            return (
              <text x={x} y={y} textAnchor={textAnchor} fill={fill} fontSize={10}>
                {payload.value}
              </text>
            );
          }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="hsl(var(--chart-grid))" tick={{ fill: 'hsl(var(--chart-axis-label))', fontSize: 10 }} />
        <Radar name="Player Rating" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;