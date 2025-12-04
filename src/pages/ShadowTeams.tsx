"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types/player";
import { ShadowTeam } from "@/types/shadow-team";

interface ShadowTeamsProps {
  players: Player[];
  shadowTeams: ShadowTeam[];
  setShadowTeams: React.Dispatch<React.SetStateAction<ShadowTeam[]>>;
}

const ShadowTeams: React.FC<ShadowTeamsProps> = ({ players, shadowTeams, setShadowTeams }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-7xl w-full mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <Card className="bg-card border-border text-card-foreground text-center p-8 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-4">Shadow Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-muted-foreground mb-6">
              Here you can create and manage your dream teams on a pitch!
            </p>
            <p className="text-muted-foreground">
              (Coming soon: Interactive pitch, player selection, and team management.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShadowTeams;