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
import AddPlayerToShadowTeamDialog from '@/components/AddPlayerToShadowTeamDialog'; // Import the new dialog

interface ShadowTeamsProps {
  players: Player[];
  shadowTeams: ShadowTeam[];
  setShadowTeams: React.Dispatch<React.SetStateAction<ShadowTeam[]>>;
}

const ShadowTeams: React.FC<ShadowTeamsProps> = ({ players, shadowTeams, setShadowTeams }) => {
  const navigate = useNavigate();
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);

  // State for two teams
  const [selectedTeam1Id, setSelectedTeam1Id] = useState<string | null>(null);
  const [selectedTeam2Id, setSelectedTeam2Id] = useState<string | null>(null);

  const [selectedFormation1, setSelectedFormation1] = useState<Formation | null>(null);
  const [selectedFormation2, setSelectedFormation2] = useState<Formation | null>(null);

  const [pitchColor, setPitchColor] = useState<'green' | 'theme'>('green');

  // State for AddPlayerToShadowTeamDialog
  const [isAddPlayerToTeamDialogOpen, setIsAddPlayerToTeamDialogOpen] = useState(false);
  const [selectedPositionForAdd, setSelectedPositionForAdd] = useState<string | null>(null);
  const [targetTeamIdForAdd, setTargetTeamIdForAdd] = useState<string | null>(null); // New state to track which team the dialog is for

  const currentTeam1 = selectedTeam1Id ? shadowTeams.find(team => team.id === selectedTeam1Id) : null;
  const currentTeam2 = selectedTeam2Id ? shadowTeams.find(team => team.id === selectedTeam2Id) : null;

  useEffect(() => {
    if (currentTeam1) {
      const formation = FM_FORMATIONS.find(f => f.id === currentTeam1.formationId);
      setSelectedFormation1(formation || null);
    } else {
      setSelectedFormation1(null);
    }
  }, [currentTeam1]);

  useEffect(() => {
    if (currentTeam2) {
      const formation = FM_FORMATIONS.find(f => f.id === currentTeam2.formationId);
      setSelectedFormation2(formation || null);
    } else {
      setSelectedFormation2(null);
    }
  }, [currentTeam2]);

  const handleCreateTeam = (newTeamData: Omit<ShadowTeam, 'id' | 'playersByPosition'>) => {
    const newTeam: ShadowTeam = {
      id: `st-${Date.now()}`,
      ...newTeamData,
      playersByPosition: {},
    };
    setShadowTeams(prev => [...prev, newTeam]);
    // If no team 1 is selected, select the new team as team 1
    if (!selectedTeam1Id) {
      setSelectedTeam1Id(newTeam.id);
    } else if (!selectedTeam2Id) { // Otherwise, if no team 2 is selected, select as team 2
      setSelectedTeam2Id(newTeam.id);
    }
  };

  const handleSelectTeam = (teamId: string, teamNumber: 1 | 2) => {
    if (teamNumber === 1) {
      setSelectedTeam1Id(teamId);
    } else {
      setSelectedTeam2Id(teamId);
    }
  };

  const handleSelectFormation = (formationId: string, teamNumber: 1 | 2) => {
    let teamToUpdate: ShadowTeam | null = null;
    if (teamNumber === 1 && currentTeam1) {
      teamToUpdate = currentTeam1;
    } else if (teamNumber === 2 && currentTeam2) {
      teamToUpdate = currentTeam2;
    }

    const formation = FM_FORMATIONS.find(f => f.id === formationId);

    if (teamToUpdate && formation) {
      setShadowTeams(prev => prev.map(team =>
        team.id === teamToUpdate!.id
          ? { ...team, formationId: formation.id, playersByPosition: {} }
          : team
      ));
      if (teamNumber === 1) {
        setSelectedFormation1(formation);
      } else {
        setSelectedFormation2(formation);
      }
      toast.info(`Formation changed to ${formation.name}. Players reset.`);
    } else if (formation) {
      if (teamNumber === 1) {
        setSelectedFormation1(formation);
      } else {
        setSelectedFormation2(formation);
      }
    }
  };

  const handlePositionClick = (teamId: string, positionName: string) => {
    setTargetTeamIdForAdd(teamId);
    setSelectedPositionForAdd(positionName);
    setIsAddPlayerToTeamDialogOpen(true);
  };

  const handleAddPlayerToPosition = (teamId: string, positionName: string, player: ShadowTeamPlayer) => {
    setShadowTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        const currentPlayersInPosition = team.playersByPosition[positionName] || [];
        if (currentPlayersInPosition.some(p => p.id === player.id)) {
          toast.info(`${player.name} je već dodan na poziciju ${positionName} u timu ${team.name}.`);
          return team;
        }
        return {
          ...team,
          playersByPosition: {
            ...team.playersByPosition,
            [positionName]: [...currentPlayersInPosition, player],
          },
        };
      }
      return team;
    }));
  };

  const handlePlayerRemove = (teamId: string, positionName: string, playerId: string) => {
    setShadowTeams(prev => prev.map(team => {
      if (team.id === teamId) {
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

  const handlePlayerDragStop = (
    teamId: string,
    positionName: string,
    playerId: string,
    newX: number,
    newY: number
  ) => {
    setShadowTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        const updatedPlayersInPosition = (team.playersByPosition[positionName] || []).map(
          player => player.id === playerId
            ? { ...player, customX: newX, customY: newY }
            : player
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
  };

  const handleExportToPDF = () => {
    toast.info("PDF Export functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-full mx-auto"> {/* Changed max-w-7xl to max-w-full */}
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Shadow Teams</h1>

        {/* Controls for Team 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Team
              </Button>
            </DialogTrigger>
            <CreateShadowTeamDialog onConfirm={handleCreateTeam} onClose={() => setIsCreateTeamDialogOpen(false)} />
          </Dialog>

          <Select onValueChange={(value) => handleSelectTeam(value, 1)} value={selectedTeam1Id || ""}>
            <SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent">
              <SelectValue placeholder="Select Shadow Team 1" />
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

          <Select onValueChange={(value) => handleSelectFormation(value, 1)} value={selectedFormation1?.id || ""}>
            <SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent" disabled={!currentTeam1}>
              <SelectValue placeholder="Choose Formation 1" />
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

        {/* Controls for Team 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1"></div> {/* Empty div for alignment */}
          <Select onValueChange={(value) => handleSelectTeam(value, 2)} value={selectedTeam2Id || ""}>
            <SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent">
              <SelectValue placeholder="Select Shadow Team 2" />
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

          <Select onValueChange={(value) => handleSelectFormation(value, 2)} value={selectedFormation2?.id || ""}>
            <SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent" disabled={!currentTeam2}>
              <SelectValue placeholder="Choose Formation 2" />
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


        <div className="flex flex-wrap lg:flex-nowrap gap-6 justify-center"> {/* Flex container for pitches */}
          {currentTeam1 ? (
            <Card className="bg-card border-border text-card-foreground shadow-lg flex-1 min-w-[45%]"> {/* flex-1 to take available space */}
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold">{currentTeam1.name}</CardTitle>
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
                  formation={selectedFormation1}
                  playersByPosition={currentTeam1.playersByPosition}
                  onPositionClick={(posName) => handlePositionClick(currentTeam1.id, posName)}
                  onPlayerRemove={(posName, playerId) => handlePlayerRemove(currentTeam1.id, posName, playerId)}
                  onPlayerDragStop={(posName, playerId, x, y) => handlePlayerDragStop(currentTeam1.id, posName, playerId, x, y)}
                  pitchColor={pitchColor}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border text-card-foreground text-center p-8 rounded-lg shadow-lg flex-1 min-w-[45%]">
              <CardTitle className="text-xl mb-4">No Shadow Team 1 Selected</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">
                  Create a new team or select an existing one to start building your squad.
                </p>
              </CardContent>
            </Card>
          )}

          {currentTeam2 ? (
            <Card className="bg-card border-border text-card-foreground shadow-lg flex-1 min-w-[45%]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold">{currentTeam2.name}</CardTitle>
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
                  formation={selectedFormation2}
                  playersByPosition={currentTeam2.playersByPosition}
                  onPositionClick={(posName) => handlePositionClick(currentTeam2.id, posName)}
                  onPlayerRemove={(posName, playerId) => handlePlayerRemove(currentTeam2.id, posName, playerId)}
                  onPlayerDragStop={(posName, playerId, x, y) => handlePlayerDragStop(currentTeam2.id, posName, playerId, x, y)}
                  pitchColor={pitchColor}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border text-card-foreground text-center p-8 rounded-lg shadow-lg flex-1 min-w-[45%]">
              <CardTitle className="text-xl mb-4">No Shadow Team 2 Selected</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">
                  Create a new team or select an existing one to start building your squad.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Player To Shadow Team Dialog */}
      <Dialog open={isAddPlayerToTeamDialogOpen} onOpenChange={setIsAddPlayerToTeamDialogOpen}>
        {isAddPlayerToTeamDialogOpen && targetTeamIdForAdd && (
          <AddPlayerToShadowTeamDialog
            players={players}
            shadowTeams={shadowTeams}
            onAddPlayer={handleAddPlayerToPosition}
            onClose={() => {
              setIsAddPlayerToTeamDialogOpen(false);
              setSelectedPositionForAdd(null);
              setTargetTeamIdForAdd(null);
            }}
            initialPositionName={selectedPositionForAdd || undefined}
            initialTeamId={targetTeamIdForAdd || undefined}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ShadowTeams;