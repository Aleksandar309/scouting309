"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, ChevronLeft, PlusCircle, CalendarDays, Briefcase } from 'lucide-react';
import { Scout, Assignment } from '@/types/scout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AssignmentForm from '@/components/AssignmentForm';
import { Badge } from '@/components/ui/badge';
import { format, isPast } from 'date-fns';
import { getPriorityBadgeClass, getStatusBadgeClass, getDueDateStatus } from '@/utils/task-utils'; // Updated import

interface ScoutsPageProps {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  scouts: Scout[]; // Receive scouts from App.tsx
}

const ScoutsPage: React.FC<ScoutsPageProps> = ({ assignments, setAssignments, scouts }) => {
  const navigate = useNavigate();
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
    setIsAssignmentFormOpen(false);
  };

  // Group scouts by custom categories
  const groupedScouts: { [key: string]: Scout[] } = {
    "Directors, Presidents, Board Members": [],
    "Head Scout/Chief": [],
    "Senior Scouts": [],
    "General Scouts": [], // New category for general scouts
    "Youth Scouts": [],
  };

  scouts.forEach(scout => { // Use scouts from props
    if (scout.role === "Head Scout") {
      groupedScouts["Head Scout/Chief"].push(scout);
    } else if (scout.role === "Senior Scout") {
      groupedScouts["Senior Scouts"].push(scout);
    } else if (scout.role === "Youth Scout") {
      groupedScouts["Youth Scouts"].push(scout);
    } else if (scout.role === "Scout") {
      groupedScouts["General Scouts"].push(scout);
    } else if (scout.role === "Technical Director" || scout.role === "Director of Football") {
      groupedScouts["Directors, Presidents, Board Members"].push(scout);
    }
    // Add logic for other roles if they exist in mockScouts, e.g., Technical Director, Director of Football
    // For now, they will fall into no category if not explicitly handled.
  });

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

        <h1 className="text-3xl font-bold mb-8">Our Scouting Team</h1>

        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted border-border">
            <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:bg-accent">Scouting Team</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:bg-accent">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-6">
            {Object.entries(groupedScouts).map(([category, categoryScouts]) => ( // Renamed scouts to categoryScouts to avoid conflict
              // Only render the category if there are scouts in it
              categoryScouts.length > 0 && (
                <div key={category} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryScouts.map((scout) => (
                      <Link to={`/scouts/${scout.id}`} key={scout.id}>
                        <Card className="bg-card border-border text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                          <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={scout.avatarUrl} alt={scout.name} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xl">{scout.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-xl font-semibold">{scout.name}</CardTitle>
                              <p className="text-muted-foreground text-sm">{scout.role}</p>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 text-muted-foreground">
                            <div className="flex items-center text-sm">
                              <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {scout.email}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {scout.phone}
                            </div>
                            <div className="flex items-center text-sm">
                              <User className="mr-2 h-4 w-4 text-muted-foreground" /> Active Players: {scout.activePlayers}
                            </div>
                            <div className="text-xs text-muted-foreground">Last Report: {scout.lastReportDate}</div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            ))}
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            <div className="flex justify-end mb-4">
              <Dialog open={isAssignmentFormOpen} onOpenChange={setIsAssignmentFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Assignment
                  </Button>
                </DialogTrigger>
                <AssignmentForm onAddAssignment={handleAddAssignment} onClose={() => setIsAssignmentFormOpen(false)} scouts={scouts} />
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assignments.length === 0 ? (
                <Card className="bg-card border-border text-card-foreground text-center p-8 lg:col-span-2">
                  <CardTitle className="text-xl mb-4">No Assignments Yet!</CardTitle>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Start by creating a new assignment for your scouts.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                assignments.map((assignment) => (
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScoutsPage;