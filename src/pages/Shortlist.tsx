"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useShortlists } from '@/context/ShortlistContext';
import { PlusCircle, Trash2, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShortlistPage: React.FC = () => {
  const { shortlists, removePlayerFromShortlist } = useShortlists();
  const navigate = useNavigate();

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

        <h1 className="text-3xl font-bold mb-8">My Shortlists</h1>

        {shortlists.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700 text-white text-center p-8">
            <CardTitle className="text-xl mb-4">No Shortlists Yet!</CardTitle>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Start by adding players to a shortlist from the Player Database or Player Profile pages.
              </p>
              <Link to="/players">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" /> Go to Player Database
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {shortlists.map((shortlist) => (
              <Card key={shortlist.id} className="bg-gray-800 border-gray-700 text-white">
                <AccordionItem value={shortlist.id} className="border-b-0">
                  <AccordionTrigger className="flex items-center justify-between p-4 bg-gray-700 rounded-t-md hover:bg-gray-600 transition-colors">
                    <div className="flex flex-col items-start">
                      <CardTitle className="text-xl font-semibold text-white">{shortlist.name}</CardTitle>
                      <p className="text-sm text-gray-400">{shortlist.players.length} players</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-gray-700 rounded-b-md text-gray-300">
                    {shortlist.players.length === 0 ? (
                      <p className="text-center text-gray-400 py-4">No players in this shortlist yet.</p>
                    ) : (
                      <div className="rounded-md border border-gray-600 bg-gray-800">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-600">
                              <TableHead className="text-gray-300">Name</TableHead>
                              <TableHead className="text-gray-300">Team</TableHead>
                              <TableHead className="text-gray-300">Positions</TableHead>
                              <TableHead className="text-gray-300 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {shortlist.players.map((player) => (
                              <TableRow key={player.id} className="border-gray-600 hover:bg-gray-700">
                                <TableCell>
                                  <Link to={`/player/${player.id}`} className="text-blue-400 hover:underline">
                                    {player.name}
                                  </Link>
                                </TableCell>
                                <TableCell>{player.team}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {player.positions.map((pos) => (
                                      <Badge key={pos} variant="secondary" className="bg-gray-600 text-gray-200 text-base"> {/* Povećana veličina teksta */}
                                        {pos}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removePlayerFromShortlist(shortlist.id, player.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white p-2 h-auto" // Smanjen padding dugmeta
                                  >
                                    <Trash2 className="h-4 w-4" /> {/* Ikona je već h-4 w-4, što je standardno malo */}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default ShortlistPage;