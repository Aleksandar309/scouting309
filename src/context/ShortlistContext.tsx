"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { Shortlist, ShortlistItem } from '@/types/shortlist';
import { toast } from 'sonner';

interface ShortlistContextType {
  shortlists: Shortlist[];
  addPlayerToShortlist: (shortlistId: string, player: ShortlistItem) => void;
  createShortlist: (name: string, initialPlayer?: ShortlistItem) => void;
  removePlayerFromShortlist: (shortlistId: string, playerId: string) => void;
  deleteShortlist: (shortlistId: string) => void; // NEW: Function to delete a shortlist
}

const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined);

interface ShortlistProviderProps {
  children: ReactNode;
  shortlists: Shortlist[]; // Now received as prop
  setShortlists: React.Dispatch<React.SetStateAction<Shortlist[]>>; // Now received as prop
}

export const ShortlistProvider: React.FC<ShortlistProviderProps> = ({ children, shortlists, setShortlists }) => {
  // shortlists state is now managed in App.tsx and passed down

  const addPlayerToShortlist = (shortlistId: string, player: ShortlistItem) => {
    setShortlists((prevShortlists) => {
      const updatedShortlists = prevShortlists.map((sl) => {
        if (sl.id === shortlistId) {
          if (sl.players.some((p) => p.id === player.id)) {
            toast.info(`${player.name} is already in this shortlist.`);
            return sl;
          }
          toast.success(`${player.name} added to ${sl.name}.`);
          return { ...sl, players: [...sl.players, player] };
        }
        return sl;
      });
      return updatedShortlists;
    });
  };

  const createShortlist = (name: string, initialPlayer?: ShortlistItem) => {
    setShortlists((prevShortlists) => {
      if (prevShortlists.some(sl => sl.name.toLowerCase() === name.toLowerCase())) {
        toast.error(`Shortlist "${name}" already exists.`);
        return prevShortlists;
      }
      const newShortlist: Shortlist = {
        id: `sl-${Date.now()}`,
        name,
        players: initialPlayer ? [initialPlayer] : [],
        createdAt: new Date().toISOString(), // NEW: Add creation date
      };
      toast.success(`Shortlist "${name}" created!`);
      if (initialPlayer) {
        toast.success(`${initialPlayer.name} added to "${name}".`);
      }
      return [...prevShortlists, newShortlist];
    });
  };

  const removePlayerFromShortlist = (shortlistId: string, playerId: string) => {
    setShortlists((prevShortlists) => {
      const updatedShortlists = prevShortlists.map((sl) => {
        if (sl.id === shortlistId) {
          const updatedPlayers = sl.players.filter((p) => p.id !== playerId);
          toast.info(`Player removed from ${sl.name}.`);
          return { ...sl, players: updatedPlayers };
        }
        return sl;
      });
      return updatedShortlists;
    });
  };

  const deleteShortlist = (shortlistId: string) => {
    setShortlists((prevShortlists) => {
      const updatedShortlists = prevShortlists.filter((sl) => sl.id !== shortlistId);
      toast.success("Shortlist deleted successfully.");
      return updatedShortlists;
    });
  };

  return (
    <ShortlistContext.Provider value={{ shortlists, addPlayerToShortlist, createShortlist, removePlayerFromShortlist, deleteShortlist }}>
      {children}
    </ShortlistContext.Provider>
  );
};

export const useShortlists = () => {
  const context = useContext(ShortlistContext);
  if (context === undefined) {
    throw new Error('useShortlists must be used within a ShortlistProvider');
  }
  return context;
};