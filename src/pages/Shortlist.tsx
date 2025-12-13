"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useShortlists } from '@/context/ShortlistContext';
import { PlusCircle, Trash2, ChevronLeft, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CreateShortlistDialog from '@/components/CreateShortlistDialog';
import AddToShortlistDialog from '@/components/AddToShortlistDialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Player } from '@/types/player';

interface ShortlistPageProps {
  players: Player[];
}

const ShortlistPage: React.FC<ShortlistPageProps> = ({ players }) => {
  const { shortlists, deleteShortlist } = useShortlists();
  const navigate = useNavigate();
  const [isCreateShortlistDialogOpen, setIsCreateShortlistDialogOpen] = useState(false);

  const sortedShortlists = [...shortlists].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pt-16"> {/* Added pt-16 */}
      <div className="max-w-7xl mx-auto">
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
          <div className="space-y-4">
            {sortedShortlists.map((shortlist) => (
              <Card key={shortlist.id} className="bg-card border-border text-card-foreground hover:shadow-xl transition-shadow duration-300">
                <Link to={`/shortlists/${shortlist.id}`} className="block p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <CardTitle className="text-xl font-semibold text-foreground">{shortlist.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <CalendarDays className="h-4 w-4 mr-1" /> Created: {new Date(shortlist.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">{shortlist.players.length} players</Badge>
                      
                      <Dialog>
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
                          onClose={() => {}}
                          initialShortlistId={shortlist.id}
                        />
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          if (window.confirm(`Are you sure you want to delete the shortlist "${shortlist.name}"?`)) {
                            deleteShortlist(shortlist.id);
                          }
                        }}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 h-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistPage;