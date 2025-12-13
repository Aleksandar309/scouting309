"use client";

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, CalendarDays, Trash2, PlusCircle, ArrowUpDown } from 'lucide-react';
import { useShortlists } from '@/context/ShortlistContext';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from '@/types/player';
import { POSITION_ORDER } from '@/utils/position-order';
import AddToShortlistDialog from '@/components/AddToShortlistDialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ShortlistDetailsPageProps {
  players: Player[];
}

const ShortlistDetailsPage: React.FC<ShortlistDetailsPageProps> = ({ players }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shortlists, removePlayerFromShortlist, deleteShortlist } = useShortlists();

  const currentShortlist = shortlists.find(sl => sl.id === id);

  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'position' | 'name'>('position');

  if (!currentShortlist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 pt-16"> {/* Added pt-16 */}
        <div className="text-center bg-card p-8 rounded-lg shadow-lg border border-border">
          <h1 className="text-3xl font-bold mb-4 text-destructive">Shortlist Not Found</h1>
          <p className="text-xl text-muted-foreground mb-6">The shortlist you are looking for does not exist.</p>
          <Button
            variant="ghost"
            onClick={() => navigate('/shortlists')}
            className="text-primary hover:text-primary/90 p-0 h-auto"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Go Back to Shortlists
          </Button>
        </div>
      </div>
    );
  }

  const handleDeleteShortlist = () => {
    if (window.confirm(`Are you sure you want to delete the shortlist "${currentShortlist.name}"?`)) {
      deleteShortlist(currentShortlist.id);
      navigate('/shortlists');
    }
  };

  const sortPlayers = (shortlistPlayers: typeof currentShortlist.players) => {
    if (sortOrder === 'name') {
      return [...shortlistPlayers].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return [...shortlistPlayers].sort((a, b) => {
        const playerA = players.find(p => p.id === a.id);
        const playerB = players.find(p => p.id === b.id);

        if (!playerA || !playerB) return 0;

        const getPrimaryPositionIndex = (player: Player) => {
          for (const orderedPos of POSITION_ORDER) {
            const foundPos = player.positionsData.find(pd => pd.name === orderedPos);
            if (foundPos && foundPos.rating >= 8) {
              return POSITION_ORDER.indexOf(orderedPos);
            }
          }
          if (player.positions.length > 0) {
            return POSITION_ORDER.indexOf(player.positions[0]);
          }
          return Infinity;
        };

        const indexA = getPrimaryPositionIndex(playerA);
        const indexB = getPrimaryPositionIndex(playerB);

        if (indexA === indexB) {
          return a.name.localeCompare(b.name);
        }
        return indexA - indexB;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pt-16"> {/* Added pt-16 */}
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/shortlists')}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to Shortlists
        </Button>

        <Card className="bg-card border-border text-card-foreground shadow-lg mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-3xl font-bold">{currentShortlist.name}</CardTitle>
              <p className="text-muted-foreground flex items-center mt-1">
                <CalendarDays className="h-4 w-4 mr-1" /> Created: {new Date(currentShortlist.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-muted text-muted-foreground">{currentShortlist.players.length} players</Badge>
              <Dialog open={isAddPlayerDialogOpen} onOpenChange={setIsAddPlayerDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => e.preventDefault()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 h-auto"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <AddToShortlistDialog
                  allPlayers={players}
                  onClose={() => setIsAddPlayerDialogOpen(false)}
                  initialShortlistId={currentShortlist.id}
                />
              </Dialog>
              <Button
                variant="destructive"
                onClick={handleDeleteShortlist}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 h-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Shortlist
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentShortlist.players.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No players in this shortlist yet. Click "Add Player" to get started!</p>
            ) : (
              <div className="rounded-md border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-foreground">
                        <Button
                          variant="ghost"
                          onClick={() => setSortOrder(prev => prev === 'name' ? 'position' : 'name')}
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
                    {sortPlayers(currentShortlist.players).map((player) => (
                      <TableRow key={player.id} className="border-border hover:bg-table-row-hover">
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
                            onClick={() => removePlayerFromShortlist(currentShortlist.id, player.id)}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShortlistDetailsPage;