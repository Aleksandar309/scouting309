"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from 'lucide-react'; // Icon for jobs

interface ScoutPreferredJobsProps {
  preferredJobs: string[];
}

const ScoutPreferredJobs: React.FC<ScoutPreferredJobsProps> = ({ preferredJobs }) => {
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
            {preferredJobs.map((job, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                • {job}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No preferred jobs listed.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoutPreferredJobs;