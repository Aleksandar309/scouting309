"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, ChevronLeft, CalendarDays, Briefcase } from 'lucide-react';
import { Scout } from '@/types/scout';
import { mockScouts } from '@/data/mockScouts';

const ScoutProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scout = mockScouts.find(s => s.id === id);

  if (!scout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="text-center bg-card p-8 rounded-lg shadow-lg border border-border">
          <h1 className="text-3xl font-bold mb-4 text-destructive">Scout Not Found</h1>
          <p className="text-xl text-muted-foreground mb-6">The scout you are looking for does not exist.</p>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 p-0 h-auto"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <Card className="bg-card border-border text-card-foreground shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-6 pb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={scout.avatarUrl} alt={scout.name} />
              <AvatarFallback className="bg-blue-600 text-white text-4xl">{scout.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">{scout.name}</CardTitle>
              <p className="text-muted-foreground text-lg">{scout.role}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-base">
                <Mail className="mr-3 h-5 w-5 text-muted-foreground" /> {scout.email}
              </div>
              <div className="flex items-center text-base">
                <Phone className="mr-3 h-5 w-5 text-muted-foreground" /> {scout.phone}
              </div>
              <div className="flex items-center text-base">
                <User className="mr-3 h-5 w-5 text-muted-foreground" /> Active Players: {scout.activePlayers}
              </div>
              <div className="flex items-center text-base">
                <CalendarDays className="mr-3 h-5 w-5 text-muted-foreground" /> Last Report: {scout.lastReportDate}
              </div>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">Scouting Focus</h3>
              <p className="text-sm">
                {scout.role === "Head Scout" && "Oversees all scouting operations, focusing on strategic targets and team fit across all regions."}
                {scout.role === "European Scout" && "Specializes in identifying talent across major European leagues, with an emphasis on technical ability and tactical intelligence."}
                {scout.role === "Youth Scout" && "Focuses on emerging talents in youth academies and lower leagues, looking for high potential and coachability."}
                {/* Add more specific descriptions if needed */}
              </p>
            </div>
            {/* Future: List of reports by this scout, or players scouted by this scout */}
            {/* <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">Recent Reports</h3>
              <p className="text-sm text-muted-foreground">Coming soon: A list of recent reports filed by {scout.name}.</p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoutProfile;