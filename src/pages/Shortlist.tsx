"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useShortlists } from '@/context/ShortlistContext';
import { PlusCircle, Trash2, ChevronLeft, CalendarDays, ArrowUpDown } from 'lucide-react';
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
import { Player } from '@/types/player'; // Import Player type
import { POSITION_ORDER } from '@/utils/position-order'; // Import position order
import CreateShortlistDialog from '@/components/CreateShortlistDialog'; // Import the new dialog
import { Dialog, DialogTrigger } from '@/components/ui/dialog'; // Import Dialog components

interface ShortlistPageProps {
  players: Player[]; // Receive all players to get detailed position data
}

const ShortlistPage: React.FC<ShortlistPageProps> = ({ players }) => {
  const { shortlists, removePlayerFromShortlist, deleteShortlist } = useShortlists();
  const navigate = useNavigate();
  const [isCreateShortlistDialogOpen, setIsCreateShortlistDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'position' | 'date'>('position'); // State for sorting players within a shortlist

  // Sort shortlists by creation date (newest first)
  const sortedShortlists = [...shortlists].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const sortPlayers = (shortlistPlayers: { id: string; name: string; team: string; positions: string[]; }[]) => {
    if (sortOrder === 'date') {
      // For now, ShortlistItem doesn't have a creation date, so we'll sort by player name as a fallback
      return [...shortlistPlayers].sort((a, b) => a.name.localeCompare(b.name));
    } else { // 'position' sort
      return [...shortlistPlayers].sort((a, b) => {
        const playerA = players.find(p => p.id === a.id);
        const playerB = players.find(p => p.id === b.id);

        if (!playerA || !playerB) return 0; // Should not happen with proper data

        // Find the highest rated position for player A based on POSITION_ORDER
        const getPrimaryPositionIndex = (player: Player) => {
          for (const orderedPos of POSITION_ORDER) {
            const foundPos = player.positionsData.find(pd => pd.name === orderedPos);
            if (foundPos && foundPos.rating >= 8) { // Consider 'natural' position
              return POSITION_ORDER.indexOf(orderedPos);
            }
          }
          // Fallback to any position if no natural fit, or just the first listed position
          if (player.positions.length > 0) {
            return POSITION_ORDER.indexOf(player.positions[0]);
          }
          return Infinity; // Place at the end if no position found
        };

        const indexA = getPrimaryPositionIndex(playerA);
        const indexB = getPrimaryPositionIndex(playerB);

        if (indexA === indexB) {
          return a.name.localeCompare(b.name); // Secondary sort by name
        }
        return indexA - indexB;
      });
    }
  };

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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Shortlists</h1>
          <Dialog open={isCreateShortlistDialogOpen} onOpenChange={setIsCreateShortlistDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Shortlist
              </Button>
            </DialogTrigger>
            <CreateShortlistDialog onClose={() => setIsCreateShortlistDialogOpen(false)} />
          </Dialog>
        </div>

        {shortlists.length === 0 ? (
          <Card className="bg-card border-border text-card-foreground text-center p-8">
            <CardTitle className="text-xl mb-4">No Shortlists Yet!</CardTitle>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start by adding players to a shortlist from the Player Database or Player Profile pages, or create a new empty shortlist.
              </p>
              <Link to="/players">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <PlusCircle className="mr-2 h-4 w-4" /> Go to Player Database
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {sortedShortlists.map((shortlist) => (
              <Card key={shortlist.id} className="bg-card border-border text-card-foreground">
                <AccordionItem value={shortlist.id} className="border-b-0">
                  <AccordionTrigger className="flex items-center justify-between p-4 bg-muted rounded-t-md hover:bg-accent transition-colors">
                    <div className="flex flex-col items-start">
                      <CardTitle className="text-xl font-semibold text-foreground">{shortlist.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <CalendarDays className="h-4 w-4 mr-1" /> Created: {new Date(shortlist.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">{shortlist.players.length} players</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent accordion from toggling
                          deleteShortlist(shortlist.id);
                        }}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 h-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-muted rounded-b-md text-muted-foreground">
                    {shortlist.players.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No players in this shortlist yet.</p>
                    ) : (
                      <div className="rounded-md border border-border bg-card">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border">
                              <TableHead className="text-foreground">
                                <Button
                                  variant="ghost"
                                  onClick={() => setSortOrder(prev => prev === 'position' ? 'date' : 'position')}
                                  className="text-foreground hover:bg-accent p-0 h-auto"
                                >
                                  Name
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </TableHead>
                              <TableHead className="text-foreground">Team</TableHead>
                              <TableHead className="text-foreground">Positions</TableHead>
                              <TableHead className="text-foreground text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortPlayers(shortlist.players).map((player) => (
                              <TableRow key={player.id} className="border-border hover:bg-accent">
                                <TableCell>
                                  <Link to={`/player/${player.id}`} className="text-primary hover:underline">
                                    {player.name}
                                  </Link>
                                </TableCell>
                                <TableCell>{player.team}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {player.positions.map((pos) => (
                                      <Badge key={pos} variant="secondary" className="bg-muted text-muted-foreground text-base">
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
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 h-auto"
                                  >
                                    <Trash2 className="h-4 w-4" />
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