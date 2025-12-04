"use client";

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, ChevronLeft, CalendarDays, Briefcase, Table2, LayoutGrid, Edit } from 'lucide-react';
import { Scout, Assignment } from '@/types/scout';
import { Player } from '@/types/player';
import {
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import PlayerCardGridDisplay from '@/components/PlayerCardGridDisplay';
import PlayerTableDisplay from '@/components/PlayerTableDisplay';
import { playerTableColumns } from '@/utils/player-table-columns';
import { format, isPast } from 'date-fns';
import ScoutAttributesSection from '@/components/ScoutAttributesSection';
import { ScoutRole } from '@/utils/scout-roles';
import { getPriorityBadgeClass, getStatusBadgeClass, getDueDateStatus } from '@/utils/assignment-utils';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'; // Import Dialog components
import ScoutEditForm from '@/components/ScoutEditForm'; // Import ScoutEditForm

interface ScoutProfileProps {
  players: Player[];
  assignments: Assignment[];
  scouts: Scout[]; // Receive scouts from App.tsx
  setScouts: React.Dispatch<React.SetStateAction<Scout[]>>; // Receive setScouts from App.tsx
}

const ScoutProfile: React.FC<ScoutProfileProps> = ({ players, assignments, scouts, setScouts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentScout = scouts.find(s => s.id === id); // Use scouts from props

  const [viewMode, setViewMode] = React.useState<'table' | 'card'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('scoutProfileViewMode') as 'table' | 'card') || 'table';
    }
    return 'table';
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [selectedScoutRole, setSelectedScoutRole] = useState<ScoutRole | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false); // State for edit form dialog

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scoutProfileViewMode', viewMode);
    }
  }, [viewMode]);

  if (!currentScout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="text-center bg-card p-8 rounded-lg shadow-lg border border-border">
          <h1 className="text-3xl font-bold mb-4 text-destructive">Scout Not Found</h1>
          <p className="text-xl text-muted-foreground mb-6">The scout you are looking for does not exist.</p>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-primary hover:text-primary/90 p-0 h-auto"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveScout = (updatedScout: Scout) => {
    setScouts((prevScouts) =>
      prevScouts.map((s) => (s.id === updatedScout.id ? updatedScout : s))
    );
    setIsEditFormOpen(false);
  };

  // Filter players reported by this scout
  const scoutedPlayers = players.filter(player =>
    player.scoutingReports.some(report => report.scout === currentScout.name)
  );

  // Filter assignments for this scout
  const scoutAssignments = assignments.filter(assignment => assignment.assignedTo === currentScout.id);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <Card className="bg-card border-border text-card-foreground shadow-lg mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentScout.avatarUrl} alt={currentScout.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">{currentScout.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold">{currentScout.name}</CardTitle>
                <p className="text-muted-foreground text-lg">{currentScout.role}</p>
              </div>
            </div>
            <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-card text-foreground border-border hover:bg-accent">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </DialogTrigger>
              <ScoutEditForm scout={currentScout} onSave={handleSaveScout} onClose={() => setIsEditFormOpen(false)} />
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-base">
                <Mail className="mr-3 h-5 w-5 text-muted-foreground" /> {currentScout.email}
              </div>
              <div className="flex items-center text-base">
                <Phone className="mr-3 h-5 w-5 text-muted-foreground" /> {currentScout.phone}
              </div>
              <div className="flex items-center text-base">
                <User className="mr-3 h-5 w-5 text-muted-foreground" /> Active Players: {currentScout.activePlayers}
              </div>
              <div className="flex items-center text-base">
                <CalendarDays className="mr-3 h-5 w-5 text-muted-foreground" /> Last Report: {currentScout.lastReportDate}
              </div>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">Scouting Focus</h3>
              <p className="text-sm">
                {currentScout.role === "Head Scout" && "Oversees all scouting operations, focusing on strategic targets and team fit across all regions."}
                {currentScout.role === "European Scout" && "Specializes in identifying talent across major European leagues, with an emphasis on technical ability and tactical intelligence."}
                {currentScout.role === "Youth Scout" && "Focuses on emerging talents in youth academies and lower leagues, looking for high potential and coachability."}
                {/* Add more role descriptions as needed */}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scout Attributes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Scout Attributes</h2>
          <ScoutAttributesSection
            scout={currentScout}
            selectedScoutRole={selectedScoutRole}
            onRoleSelect={setSelectedScoutRole}
            // isEditable={isEditFormOpen} // Only editable via the form, not directly here
          />
        </div>

        {/* Scout Assignments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Assignments for {currentScout.name} ({scoutAssignments.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scoutAssignments.length === 0 ? (
              <Card className="bg-card border-border text-card-foreground text-center p-8 lg:col-span-2">
                <CardTitle className="text-xl mb-4">No Assignments Yet!</CardTitle>
                <CardContent>
                  <p className="text-muted-foreground">
                    {currentScout.name} currently has no active assignments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              scoutAssignments.map((assignment) => (
                <Card key={assignment.id} className="bg-card border-border text-card-foreground shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">{assignment.title}</CardTitle>
                      <Badge className={getPriorityBadgeClass(assignment.priority)}>{assignment.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Briefcase className="h-4 w-4 mr-1" /> Assigned to: <Link to={`/scouts/${assignment.assignedTo}`} className="text-primary hover:underline ml-1">{assignment.assignedToName}</Link>
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground text-sm">
                    <p>{assignment.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" /> Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                        {getDueDateStatus(assignment.dueDate, assignment.status)}
                      </span>
                      <Badge className={getStatusBadgeClass(assignment.status)}>{assignment.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Scouted Players Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Players Scouted by {currentScout.name} ({scoutedPlayers.length})</h2>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value: 'table' | 'card') => {
              if (value) setViewMode(value);
            }}
            className="bg-muted rounded-md p-1 border border-border"
          >
            <ToggleGroupItem value="table" aria-label="Toggle table view" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-muted-foreground hover:bg-accent">
              <Table2 className="h-4 w-4 mr-2" /> Table View
            </ToggleGroupItem>
            <ToggleGroupItem value="card" aria-label="Toggle card view" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-muted-foreground hover:bg-accent">
              <LayoutGrid className="h-4 w-4 mr-2" /> Card View
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {scoutedPlayers.length === 0 ? (
          <Card className="bg-card border-border text-card-foreground text-center p-8">
            <CardTitle className="text-xl mb-4">No Players Scouted Yet!</CardTitle>
            <CardContent>
              <p className="text-muted-foreground">
                {currentScout.name} has not filed any reports for players yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          viewMode === 'table' ? (
            <PlayerTableDisplay
              data={scoutedPlayers}
              columns={playerTableColumns}
              sorting={sorting}
              setSorting={setSorting}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          ) : (
            <PlayerCardGridDisplay players={scoutedPlayers} />
          )
        )}
      </div>
    </div>
  );
};

export default ScoutProfile;