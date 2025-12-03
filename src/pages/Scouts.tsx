"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, ChevronLeft } from 'lucide-react'; // Added ChevronLeft icon
import { Scout } from '@/types/scout';

const mockScouts: Scout[] = [
  {
    id: "1",
    name: "James Clark",
    role: "Head Scout",
    email: "james.clark@brighton.com",
    phone: "+44 7123 456789",
    activePlayers: 5,
    lastReportDate: "2024-07-20",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JC",
  },
  {
    id: "2",
    name: "Mia Scout",
    role: "European Scout",
    email: "mia.scout@brighton.com",
    phone: "+44 7987 654321",
    activePlayers: 8,
    lastReportDate: "2024-07-22",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MS",
  },
  {
    id: "3",
    name: "David Lee",
    role: "Youth Scout",
    email: "david.lee@brighton.com",
    phone: "+44 7555 123456",
    activePlayers: 3,
    lastReportDate: "2024-07-18",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DL",
  },
];

const Scouts: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Our Scouting Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockScouts.map((scout) => (
            <Card key={scout.id} className="bg-gray-800 border-gray-700 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={scout.avatarUrl} alt={scout.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl">{scout.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-semibold">{scout.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{scout.role}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" /> {scout.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-gray-500" /> {scout.phone}
                </div>
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-gray-500" /> Active Players: {scout.activePlayers}
                </div>
                <div className="text-xs text-gray-500">Last Report: {scout.lastReportDate}</div>
                {/* You could add a link to a detailed scout profile here if needed */}
                {/* <Link to={`/scouts/${scout.id}`}>
                  <Button variant="outline" className="mt-4 w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600">View Profile</Button>
                </Link> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scouts;