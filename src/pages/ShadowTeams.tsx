"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, PlusCircle, Settings, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types/player";
import { ShadowTeam, ShadowTeamPlayer } from "@/types/shadow-team";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CreateShadowTeamDialog from '@/components/CreateShadowTeamDialog';
import ShadowPitch from '@/components/ShadowPitch';
import { FM_FORMATIONS, Formation } from '@/utils/formations';
import { toast } from 'sonner';

interface ShadowTeamsProps {
  players: Player[];
  shadowTeams: ShadowTeam[];
  setShadowTeams: React.Dispatch<React.SetStateAction<ShadowTeam[]>>;
}

const ShadowTeams: React.FC<ShadowTeamsProps> = ({ players, shadowTeams, setShadowTeams }) => {
  const navigate = useNavigate();
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [pitchColor, setPitchColor] = useState<'green' | 'theme'>('green'); // State for pitch color

  const currentTeam = selectedTeamId ? shadowTeams.find(team => team.id === selectedTeamId) : null;

  useEffect(() => {
    if (currentTeam) {
      const formation = FM_FORMATIONS.find(f => f.id === currentTeam.formationId);
      setSelectedFormation(formation || null);
    } else {
      setSelectedFormation(null);
    }
  }, [currentTeam]);

  const handleCreateTeam = (newTeamData: Omit<ShadowTeam, 'id' | 'playersByPosition'>) => {
    const newTeam: ShadowTeam = {
      id: `st-${Date.now()}`,
      ...newTeamData,
      playersByPosition: {}, // Initialize with empty players
    };
    setShadowTeams(prev => [...prev, newTeam]);
    setSelectedTeamId(newTeam.id); // Automatically select the new team
  };

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleSelectFormation = (formationId: string) => {
    const formation = FM_FORMATIONS.find(f => f.id === formationId);
    if (currentTeam && formation) {
      setShadowTeams(prev => prev.map(team =>
        team.id === currentTeam.id
          ? { ...team, formationId: formation.id, playersByPosition: {} } // Clear players if formation changes
          : team
      ));
      setSelectedFormation(formation);
      toast.info(`Formation changed to ${formation.name}. Players reset.`);
    } else if (formation) {
      setSelectedFormation(formation);
    }
  };

  const handlePositionClick = (positionName: string) => {
    // This will be expanded in the next phase to open a player selection dialog
    toast.info(`Clicked on position: ${positionName}. Player selection coming soon!`);
  };

  const handlePlayerRemove = (positionName: string, playerId: string) => {
    if (!currentTeam) return;

    setShadowTeams(prev => prev.map(team => {
      if (team.id === currentTeam.id) {
        const updatedPlayersInPosition = (team.playersByPosition[positionName] || []).filter(
          player => player.id !== playerId
        );
        return {
          ...team,
          playersByPosition: {
            ...team.playersByPosition,
            [positionName]: updatedPlayersInPosition,
          },
        };
      }
      return team;
    }));
    toast.success("Player removed from position.");
  };

  const handleExportToPDF = () => {
    toast.info("PDF Export functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl w-full mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Shadow Teams</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Create New Team */}
          <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Team
              </Button>
            </DialogTrigger>
            <CreateShadowTeamDialog onConfirm={handleCreateTeam} onClose={() => setIsCreateTeamDialogOpen(false)} />
          </Dialog>

          {/* Select Existing Team */}
          <Select onValueChange={handleSelectTeam} value={selectedTeamId || ""}>
            <SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent">
              <SelectValue placeholder="Select a Shadow Team" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              {shadowTeams.length === 0 ? (
                <SelectItem value="no-teams" disabled>No teams created yet</SelectItem>
              ) : (
                shadowTeams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Select Formation */}
          <Select onValueChange={handleSelectFormation} value={selectedFormation?.id || ""}>
            <SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent" disabled={!currentTeam}>
              <SelectValue placeholder="Choose Formation" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              {FM_FORMATIONS.map(formation => (
                <SelectItem key={formation.id} value={formation.id}>
                  {formation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentTeam ? (
          <Card className="bg-card border-border text-card-foreground shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">{currentTeam.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPitchColor(prev => (prev === 'green' ? 'theme' : 'green'))}
                  className="bg-muted border-border text-muted-foreground hover:bg-accent"
                >
                  Toggle Pitch Color ({pitchColor === 'green' ? 'Green' : 'Theme'})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Team settings edit coming soon!")}
                  className="bg-muted border-border text-muted-foreground hover:bg-accent"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportToPDF}
                  className="bg-muted border-border text-muted-foreground hover:bg-accent"
                >
                  <Download className="mr-2 h-4 w-4" /> Export to PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <ShadowPitch
                formation={selectedFormation}
                playersByPosition={currentTeam.playersByPosition}
                onPositionClick={handlePositionClick}
                onPlayerRemove={handlePlayerRemove}
                pitchColor={pitchColor}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border text-card-foreground text-center p-8 rounded-lg shadow-lg">
            <CardTitle className="text-xl mb-4">No Shadow Team Selected</CardTitle>
            <CardContent>
              <p className="text-muted-foreground">
                Create a new team or select an existing one to start building your squad.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShadowTeams;