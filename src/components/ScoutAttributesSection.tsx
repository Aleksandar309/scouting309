"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoutAttributeDisplay from './ScoutAttributeDisplay';
import { Scout } from '@/types/scout';
import { SCOUT_ATTRIBUTE_CATEGORIES } from '@/types/scout-attributes';
import { User, Brain, Target } from 'lucide-react'; // Icons for categories
import ScoutPreferredJobs from './ScoutPreferredJobs'; // Import the new component

interface ScoutAttributesSectionProps {
  scout: Scout;
}

const ScoutAttributesSection: React.FC<ScoutAttributesSectionProps> = ({ scout }) => {
  const renderAttributes = (category: keyof typeof SCOUT_ATTRIBUTE_CATEGORIES, title: string, icon: React.ElementType) => {
    const attributes = SCOUT_ATTRIBUTE_CATEGORIES[category];
    const scoutAttributeData = scout[`${category}Attributes` as keyof Scout]; // Access attributes dynamically

    if (!scoutAttributeData) return null;

    return (
      <Card className="bg-card border-border text-card-foreground">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            {React.createElement(icon, { className: "mr-2 h-5 w-5" })} {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {attributes.map((attrName) => {
            const key = attrName.replace(/\s/g, '').charAt(0).toLowerCase() + attrName.replace(/\s/g, '').slice(1); // Convert to camelCase
            const rating = (scoutAttributeData as any)[key]; // Access rating by camelCase key
            return (
              <ScoutAttributeDisplay key={attrName} name={attrName} rating={rating !== undefined ? rating : 0} />
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ScoutPreferredJobs preferredJobs={scout.preferredJobs} /> {/* Preferred Jobs first */}
      {renderAttributes("scouting", "Scouting Attributes", Target)} {/* Scouting Attributes second */}
      {renderAttributes("mental", "Mental Attributes", Brain)} {/* Mental Attributes third */}
    </div>
  );
};

export default ScoutAttributesSection;