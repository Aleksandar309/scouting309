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
    <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add {player.name} to Shortlist</DialogTitle>
        <DialogDescription className="text-gray-400">
          Select an existing shortlist or create a new one.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {!isCreatingNew ? (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortlist" className="text-right text-gray-300">
                Shortlist
              </Label>
              <Select onValueChange={setSelectedShortlistId} value={selectedShortlistId}>
                <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a shortlist" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
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
              className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Create New Shortlist
            </Button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newShortlistName" className="text-right text-gray-300">
                New Name
              </Label>
              <Input
                id="newShortlistName"
                value={newShortlistName}
                onChange={(e) => setNewShortlistName(e.target.value)}
                className="col-span-3 bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Summer Targets 2025"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsCreatingNew(false)}
              className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
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
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add to Shortlist
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddToShortlistDialog;