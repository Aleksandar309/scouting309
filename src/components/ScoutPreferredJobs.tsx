"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from 'lucide-react'; // Icon for jobs
import { ScoutRole, SCOUT_ROLES } from '@/utils/scout-roles';
import { cn } from '@/lib/utils';

interface ScoutPreferredJobsProps {
  preferredJobs: string[];
  onRoleSelect: (role: ScoutRole | null) => void;
  selectedRole: ScoutRole | null;
}

const ScoutPreferredJobs: React.FC<ScoutPreferredJobsProps> = ({ preferredJobs, onRoleSelect, selectedRole }) => {
  const handleRoleClick = (jobName: string) => {
    const role = SCOUT_ROLES.find(r => r.name === jobName);
    if (role) {
      onRoleSelect(selectedRole?.id === role.id ? null : role); // Toggle selection
    }
  };

  return (
    <Card className="bg-card border-border text-card-foreground">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Briefcase className="mr-2 h-5 w-5" /> Preferred Jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {preferredJobs.length > 0 ? (
          <div className="flex flex-col space-y-1">
            {preferredJobs.map((job, index) => {
              const isSelected = selectedRole?.name === job;
              return (
                <p
                  key={index}
                  className={cn(
                    "text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200",
                    isSelected ? "font-bold text-primary" : ""
                  )}
                  onClick={() => handleRoleClick(job)}
                >
                  • {job}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No preferred jobs listed.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoutPreferredJobs;