"use client";

import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Player, AttributeHistoryEntry } from '@/types/player';
import { FmAttributeCategory, getAttributesByCategory } from '@/utils/fm-roles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface AttributeHistoryDialogProps {
  player: Player;
  attributeName: string;
  attributeCategory: FmAttributeCategory;
  onClose: () => void;
}

const AttributeHistoryDialog: React.FC<AttributeHistoryDialogProps> = ({
  player,
  attributeName,
  attributeCategory,
  onClose,
}) => {
  const allAttributes = getAttributesByCategory(player, attributeCategory);
  const attribute = allAttributes.find(attr => attr.name === attributeName);

  if (!attribute) {
    return (
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Attribute History</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            No history found for {attributeName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground">Close</Button>
        </div>
      </DialogContent>
    );
  }

  // Combine current rating with history for the graph
  const historyData = (attribute.history || []).map(entry => ({
    ...entry,
    date: parseISO(entry.date), // Parse date strings to Date objects
  }));

  // Add current rating as the latest point if not already in history
  const latestHistoryDate = historyData.length > 0 ? Math.max(...historyData.map(d => d.date.getTime())) : 0;
  const currentDate = new Date();

  if (attribute.rating !== undefined && (historyData.length === 0 || latestHistoryDate < currentDate.getTime())) {
    historyData.push({
      date: currentDate, // This is already a Date object
      rating: attribute.rating,
      changedBy: "Current", // Indicate it's the current value
      comment: "Current rating",
    });
  }

  // Sort data by date to ensure correct graph rendering
  historyData.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <DialogContent className="sm:max-w-[800px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">History for {attribute.name}</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Tracking changes in {attribute.name} over time.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Rating Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={historyData} // Use historyData directly with Date objects
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis
              dataKey="date" // Use the Date object directly
              scale="time" // Treat as time series
              type="number" // Recharts expects numbers for time scale
              tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM yy')} // Format timestamp
              stroke="hsl(var(--chart-axis-label))"
              tick={{ fill: 'hsl(var(--chart-axis-label))', fontSize: 10 }}
            />
            <YAxis
              domain={[0, 10]}
              tickCount={11}
              stroke="hsl(var(--chart-axis-label))"
              tick={{ fill: 'hsl(var(--chart-axis-label))', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              labelFormatter={(label) => `Date: ${format(new Date(label), 'MMM dd, yyyy')}`} // Format timestamp
              formatter={(value, name, props) => [`Rating: ${value}`, props.payload.changedBy ? `Changed by: ${props.payload.changedBy}` : '']}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary-foreground))', stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
            <ReferenceLine y={attribute.rating} stroke="red" strokeDasharray="3 3" label={{ value: `Current: ${attribute.rating}`, position: 'right', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
          </LineChart>
        </ResponsiveContainer>

        <h3 className="text-lg font-semibold mt-6 mb-2 text-foreground">Change Log</h3>
        {historyData.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {historyData.map((entry, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-accent transition-colors">
                  <div className="flex flex-col items-start">
                    <p className="font-medium text-foreground">
                      {format(entry.date, 'MMM dd, yyyy')}: Rating changed to {entry.rating}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Changed by: {entry.changedBy || "N/A"}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted rounded-b-md text-muted-foreground space-y-2">
                  {entry.comment ? (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Comment:</h4>
                      <p className="text-sm">{entry.comment}</p>
                    </div>
                  ) : (
                    <p className="text-sm italic">No specific comment for this change.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center py-4">No historical changes recorded for this attribute.</p>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="bg-muted hover:bg-accent text-muted-foreground">Close</Button>
      </div>
    </DialogContent>
  );
};

export default AttributeHistoryDialog;