"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, ChevronLeft } from 'lucide-react'; // Added ChevronLeft icon
import { Scout } from '@/types/scout';
import { mockScouts } from '@/data/mockScouts'; // Import mockScouts from new file

const Scouts: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockScouts.map((scout) => (
            <Link to={`/scouts/${scout.id}`} key={scout.id}> {/* Make the whole card clickable */}
              <Card className="bg-card border-border text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"> {/* Added h-full for consistent height */}
                <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={scout.avatarUrl} alt={scout.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-xl">{scout.name.charAt(0)}</AvatarFallback>
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
                  {/* Removed the explicit button as the whole card is now a link */}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scouts;