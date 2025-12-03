"use client";

import React, { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShortlists } from '@/context/ShortlistContext';
import { Player } from '@/types/player';
import { ShortlistItem } from '@/types/shortlist';

interface AddToShortlistDialogProps {
  player: Player;
  onClose: () => void;
}

const AddToShortlistDialog: React.FC<AddToShortlistDialogProps> = ({ player, onClose }) => {
  const { shortlists, addPlayerToShortlist, createShortlist } = useShortlists();
  const [selectedShortlistId, setSelectedShortlistId] = useState<string>('');
  const [newShortlistName, setNewShortlistName] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  const handleAddToShortlist = () => {
    const shortlistItem: ShortlistItem = {
      id: player.id,
      name: player.name,
      team: player.team,
      positions: player.positions,
    };

    if (isCreatingNew && newShortlistName.trim()) {
      createShortlist(newShortlistName.trim(), shortlistItem);
    } else if (selectedShortlistId) {
      addPlayerToShortlist(selectedShortlistId, shortlistItem);
    }
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add {player.name} to Shortlist</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Select an existing shortlist or create a new one.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {!isCreatingNew ? (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortlist" className="text-right text-muted-foreground">
                Shortlist
              </Label>
              <Select onValueChange={setSelectedShortlistId} value={selectedShortlistId}>
                <SelectTrigger className="col-span-3 bg-input border-border text-foreground">
                  <SelectValue placeholder="Select a shortlist" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  {shortlists.map((sl) => (
                    <SelectItem key={sl.id} value={sl.id}>
                      {sl.name} ({sl.players.length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsCreatingNew(true)}
              className="w-full bg-muted border-border text-muted-foreground hover:bg-accent"
            >
              Create New Shortlist
            </Button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newShortlistName" className="text-right text-muted-foreground">
                New Name
              </Label>
              <Input
                id="newShortlistName"
                value={newShortlistName}
                onChange={(e) => setNewShortlistName(e.target.value)}
                className="col-span-3 bg-input border-border text-foreground"
                placeholder="e.g., Summer Targets 2025"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsCreatingNew(false)}
              className="w-full bg-muted border-border text-muted-foreground hover:bg-accent"
            >
              Back to Existing Shortlists
            </Button>
          </>
        )}
      </div>
      <DialogFooter>
        <Button
          type="submit"
          onClick={handleAddToShortlist}
          disabled={(!selectedShortlistId && !newShortlistName.trim()) || (isCreatingNew && !newShortlistName.trim())}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Add to Shortlist
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddToShortlistDialog;