import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Flag, Goal, MapPin, Scale, User, Wallet } from "lucide-react";
import { Player } from "@/types/player";
import AttributeRating from "@/components/AttributeRating";
import RadarChart from "@/components/RadarChart";

const mockPlayer: Player = {
  id: "1",
  name: "Mats Wieffer",
  team: "Feyenoord",
  positions: ["CDM", "CM"],
  priorityTarget: true,
  criticalPriority: true,
  nationality: "Netherlands",
  age: 26,
  value: "€25M",
  footed: "Right Footed",
  details: {
    height: "188 cm",
    weight: "78 kg",
    league: "Eredivisie",
    contractExpiry: "Jun 2027",
    wageDemands: "60-80k/week",
    agent: "SEG Football",
    notes: "Elite ball-winning midfielder. Perfect profile for Brighton's system. Strong in duels, excellent reading of the game.",
  },
  scoutingProfile: {
    overall: 9,
    potential: 9,
    brightonFit: 10,
  },
  technical: [
    { name: "First Touch", rating: 9 },
    { name: "Passing Range", rating: 9 },
    { name: "Ball Striking", rating: 8 },
    { name: "Dribbling", rating: 7 },
    { name: "Crossing", rating: 6 },
    { name: "Aerial Ability", rating: 8 },
  ],
  tactical: [
    { name: "Positioning", rating: 9 },
    { name: "Decision Making", rating: 9 },
    { name: "Game Intelligence", rating: 9 },
    { name: "Off-Ball Movement", rating: 9 },
    { name: "Pressing", rating: 9 },
    { name: "Defensive Awareness", rating: 9 },
  ],
  physical: [
    { name: "Pace", rating: 8 },
    { name: "Acceleration", rating: 8 },
    { name: "Strength", rating: 9 },
    { name: "Stamina", rating: 9 },
    { name: "Agility", rating: 8 },
    { name: "Recovery", rating: 9 },
  ],
  mentalPsychology: [
    { name: "Composure", rating: 9 },
    { name: "Leadership", rating: 9 },
    { name: "Work Rate", rating: 9 },
    { name: "Concentration", rating: 9 },
    { name: "Coachability", rating: 9 },
    { name: "Resilience", rating: 9 },
  ],
  keyStrengths: [
    "Exceptional reading of the game and anticipation.",
    "Wins possession in dangerous areas consistently.",
    "Distribution under pressure is elite - rarely loses the ball.",
    "Commands the midfield zone with authority.",
  ],
  areasForDevelopment: [
    "Could improve final third creativity.",
    "Occasional tendency to be over-aggressive in challenges.",
    "Long-range shooting needs work.",
  ],
  scoutingReports: [
    { id: "rep1", date: "Dec 2, 2025", scout: "Mia Scout", rating: 10, title: "dessa" },
    { id: "rep2", date: "Nov 10, 2024", scout: "James Clark", rating: 9, title: "Feyenoord vs Ajax" },
  ],
};

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app, you would fetch player data based on 'id'
  const player = mockPlayer; // Using mock data for now

  if (!player) {
    return <div className="text-center text-white mt-10">Player not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
              {player.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{player.name}</h1>
              <p className="text-gray-400">{player.team}</p>
              <div className="flex items-center space-x-2 mt-1">
                {player.positions.map((pos) => (
                  <Badge key={pos} variant="secondary" className="bg-gray-700 text-gray-200">{pos}</Badge>
                ))}
                {player.priorityTarget && <Badge className="bg-yellow-600 text-white">Priority Target</Badge>}
                {player.criticalPriority && <Badge className="bg-red-600 text-white">Critical Priority</Badge>}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">Edit</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">New Report</Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-gray-400 mb-8">
          <span className="flex items-center"><Flag className="mr-1 h-4 w-4" /> {player.nationality}</span>
          <span className="flex items-center"><CalendarDays className="mr-1 h-4 w-4" /> {player.age} years old</span>
          <span className="flex items-center"><Wallet className="mr-1 h-4 w-4" /> {player.value}</span>
          <span className="flex items-center"><Goal className="mr-1 h-4 w-4" /> {player.footed}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Player Details Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Player Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-300">
              <div className="grid grid-cols-2 gap-y-1">
                <span>Height: {player.details.height}</span>
                <span>Weight: {player.details.weight}</span>
                <span>League: {player.details.league}</span>
                <span>Contract expiry: {player.details.contractExpiry}</span>
                <span>Wage Demands: {player.details.wageDemands}</span>
                <span>Agent: {player.details.agent}</span>
              </div>
              <p className="text-sm mt-4">{player.details.notes}</p>
            </CardContent>
          </Card>

          {/* Scouting Profile Card */}
          <Card className="bg-gray-800 border-gray-700 text-white col-span-1 md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Scouting Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-around space-y-4 md:space-y-0 md:space-x-4">
              <RadarChart />
              <div className="flex flex-col space-y-2 text-center md:text-left">
                <div className="text-xl font-bold">{player.scoutingProfile.overall} <span className="text-sm font-normal text-gray-400">Overall</span></div>
                <div className="text-xl font-bold">{player.scoutingProfile.potential} <span className="text-sm font-normal text-gray-400">Potential</span></div>
                <div className="text-xl font-bold">{player.scoutingProfile.brightonFit} <span className="text-sm font-normal text-gray-400">Brighton Fit</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Attributes Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center"><User className="mr-2 h-5 w-5" /> Technical</CardTitle>
            </CardHeader>
            <CardContent>
              {player.technical.map((attr) => (
                <AttributeRating key={attr.name} name={attr.name} rating={attr.rating} />
              ))}
            </CardContent>
          </Card>

          {/* Tactical Attributes Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center"><MapPin className="mr-2 h-5 w-5" /> Tactical</CardTitle>
            </CardHeader>
            <CardContent>
              {player.tactical.map((attr) => (
                <AttributeRating key={attr.name} name={attr.name} rating={attr.rating} />
              ))}
            </CardContent>
          </Card>

          {/* Physical Attributes Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center"><Scale className="mr-2 h-5 w-5" /> Physical</CardTitle>
            </CardHeader>
            <CardContent>
              {player.physical.map((attr) => (
                <AttributeRating key={attr.name} name={attr.name} rating={attr.rating} />
              ))}
            </CardContent>
          </Card>

          {/* Mental & Psychology Attributes Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center"><User className="mr-2 h-5 w-5" /> Mental & Psychology</CardTitle>
            </CardHeader>
            <CardContent>
              {player.mentalPsychology.map((attr) => (
                <AttributeRating key={attr.name} name={attr.name} rating={attr.rating} />
              ))}
            </CardContent>
          </Card>

          {/* Key Strengths Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Key Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-300 text-sm">
              {player.keyStrengths.map((strength, index) => (
                <p key={index}>• {strength}</p>
              ))}
            </CardContent>
          </Card>

          {/* Areas for Development Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Areas for Development</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-300 text-sm">
              {player.areasForDevelopment.map((area, index) => (
                <p key={index}>• {area}</p>
              ))}
            </CardContent>
          </Card>

          {/* Scouting Reports Card */}
          <Card className="bg-gray-800 border-gray-700 text-white col-span-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Scouting Reports ({player.scoutingReports.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {player.scoutingReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-xs text-gray-400">{report.date} • {report.scout}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500 text-white">{report.rating}</Badge>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      Sign Immediately <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;