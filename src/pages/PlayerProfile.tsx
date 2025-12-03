import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarDays,
  Flag,
  Goal,
  MapPin,
  Scale,
  User,
  Wallet,
  Plus,
  BarChart2,
  Radar,
  ChevronLeft,
  Maximize, // Added for Height
  Weight, // Added for Weight
  Trophy, // Added for League
  DollarSign, // Added for Wage Demands
  Briefcase, // Added for Agent
} from "lucide-react";
import { Player } from "@/types/player";
import AttributeRating from "@/components/AttributeRating";
import RadarChart from "@/components/RadarChart";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ScoutReportForm from "@/components/ScoutReportForm";
import AddToShortlistDialog from '@/components/AddToShortlistDialog';
import PlayerStatistics from '@/components/PlayerStatistics';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const initialMockPlayer: Player = {
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
    {
      id: "rep1",
      date: "Dec 2, 2025",
      scout: "Mia Scout",
      rating: 10,
      title: "Initial Assessment",
      keyStrengths: "Excellent vision, strong passing, good leadership.",
      areasForDevelopment: "Needs to improve aerial duels, occasional lapses in concentration."
    },
    {
      id: "rep2",
      date: "Nov 10, 2024",
      scout: "James Clark",
      rating: 9,
      title: "Feyenoord vs Ajax Match Report",
      keyStrengths: "Dominant in midfield, crucial interceptions, calm under pressure.",
      areasForDevelopment: "Sometimes holds onto the ball too long, needs to release quicker."
    },
  ],
};

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player>(initialMockPlayer);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [isShortlistFormOpen, setIsShortlistFormOpen] = useState(false);
  const [showScoutingProfile, setShowScoutingProfile] = useState(true);

  if (!player) {
    return <div className="text-center text-white mt-10">Player not found.</div>;
  }

  const handleAddReport = (newReport: Player["scoutingReports"][0]) => {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      scoutingReports: [...prevPlayer.scoutingReports, newReport],
    }));
  };

  const attributesForRadar = [
    ...player.technical.slice(0, 3),
    ...player.tactical.slice(0, 3),
    ...player.physical.slice(0, 3),
    ...player.mentalPsychology.slice(0, 3),
  ];

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
            <Dialog open={isShortlistFormOpen} onOpenChange={setIsShortlistFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Shortlist
                </Button>
              </DialogTrigger>
              <AddToShortlistDialog player={player} onClose={() => setIsShortlistFormOpen(false)} />
            </Dialog>
            <Dialog open={isReportFormOpen} onOpenChange={setIsReportFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">New Report</Button>
              </DialogTrigger>
              <ScoutReportForm player={player} onReportSubmit={handleAddReport} onClose={() => setIsReportFormOpen(false)} />
            </Dialog>
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
            <CardContent className="space-y-3 text-gray-300"> {/* Increased space-y for better separation */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2"> {/* Adjusted gap */}
                <div className="flex items-center">
                  <Maximize className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Height: <span className="font-medium text-white">{player.details.height}</span></span>
                </div>
                <div className="flex items-center">
                  <Weight className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Weight: <span className="font-medium text-white">{player.details.weight}</span></span>
                </div>
                <div className="flex items-center">
                  <Trophy className="mr-2 h-4 w-4 text-gray-500" />
                  <span>League: <span className="font-medium text-white">{player.details.league}</span></span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Contract expiry: <span className="font-medium text-white">{player.details.contractExpiry}</span></span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Wage Demands: <span className="font-medium text-white">{player.details.wageDemands}</span></span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Agent: <span className="font-medium text-white">{player.details.agent}</span></span>
                </div>
              </div>
              <p className="text-sm mt-4 border-t border-gray-700 pt-3">{player.details.notes}</p> {/* Added border-top for separation */}
            </CardContent>
          </Card>

          {/* Scouting Profile / Statistics Card */}
          <Card className="bg-gray-800 border-gray-700 text-white col-span-1 md:col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {showScoutingProfile ? "Scouting Profile" : "Player Statistics"}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowScoutingProfile(!showScoutingProfile)}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                {showScoutingProfile ? (
                  <>
                    <BarChart2 className="mr-2 h-4 w-4" /> View Statistics
                  </>
                ) : (
                  <>
                    <Radar className="mr-2 h-4 w-4" /> View Scouting Profile
                  </>
                )}
              </Button>
            </CardHeader>
            {showScoutingProfile ? (
              <CardContent className="flex flex-col md:flex-row items-center justify-around space-y-4 md:space-y-0 md:space-x-4">
                <RadarChart playerAttributes={attributesForRadar} />
                <div className="flex flex-col space-y-2 text-center md:text-left">
                  <div className="text-xl font-bold">{player.scoutingProfile.overall} <span className="text-sm font-normal text-gray-400">Overall</span></div>
                  <div className="text-xl font-bold">{player.scoutingProfile.potential} <span className="text-sm font-normal text-gray-400">Potential</span></div>
                  <div className="text-xl font-bold">{player.scoutingProfile.brightonFit} <span className="text-sm font-normal text-gray-400">Brighton Fit</span></div>
                </div>
              </CardContent>
            ) : (
              <PlayerStatistics />
            )}
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
              <Accordion type="single" collapsible className="w-full">
                {player.scoutingReports.map((report) => (
                  <AccordionItem key={report.id} value={report.id} className="border-gray-700">
                    <AccordionTrigger className="flex items-center justify-between p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-start">
                        <p className="font-medium text-white">{report.title}</p>
                        <p className="text-xs text-gray-400">{report.date} • {report.scout}</p>
                      </div>
                      <Badge className="bg-blue-500 text-white">{report.rating}</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-gray-700 rounded-b-md text-gray-300 space-y-2">
                      {report.keyStrengths && (
                        <div>
                          <h4 className="font-semibold text-white mb-1">Key Strengths:</h4>
                          <p className="text-sm">{report.keyStrengths}</p>
                        </div>
                      )}
                      {report.areasForDevelopment && (
                        <div>
                          <h4 className="font-semibold text-white mb-1">Areas for Development:</h4>
                          <p className="text-sm">{report.areasForDevelopment}</p>
                        </div>
                      )}
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 mt-2">
                        Sign Immediately <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;