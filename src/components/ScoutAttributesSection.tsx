"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoutAttributeDisplay from './ScoutAttributeDisplay';
import { Scout } from '@/types/scout';
import { SCOUT_ATTRIBUTE_CATEGORIES, ScoutAttributeCategory } from '@/types/scout-attributes';
import { Brain, Target } from 'lucide-react'; // Icons for categories
import ScoutPreferredJobs from './ScoutPreferredJobs';
import { ScoutRole, getHighlightTypeForScoutAttribute } from '@/utils/scout-roles'; // Import ScoutRole and helper

interface ScoutAttributesSectionProps {
  scout: Scout;
  selectedScoutRole: ScoutRole | null; // New prop
  onRoleSelect: (role: ScoutRole | null) => void; // New prop
}

const ScoutAttributesSection: React.FC<ScoutAttributesSectionProps> = ({ scout, selectedScoutRole, onRoleSelect }) => {
  const renderAttributes = (category: ScoutAttributeCategory, title: string, icon: React.ElementType) => {
    const attributes = SCOUT_ATTRIBUTE_CATEGORIES[category];
    const scoutAttributeData = scout[`${category}Attributes` as keyof Scout];

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
            const key = attrName.replace(/\s/g, '').charAt(0).toLowerCase() + attrName.replace(/\s/g, '').slice(1);
            const rating = (scoutAttributeData as any)[key];
            const highlightType = getHighlightTypeForScoutAttribute(attrName, category, selectedScoutRole); // Determine highlight

            return (
              <ScoutAttributeDisplay
                key={attrName}
                name={attrName}
                rating={rating !== undefined ? rating : 0}
                highlightType={highlightType}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ScoutPreferredJobs
        preferredJobs={scout.preferredJobs}
        onRoleSelect={onRoleSelect}
        selectedRole={selectedScoutRole}
      />
      {renderAttributes("scouting", "Scouting Attributes", Target)}
      {renderAttributes("mental", "Mental Attributes", Brain)}
    </div>
  );
};

export default ScoutAttributesSection;