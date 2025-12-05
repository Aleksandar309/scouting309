"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlayerProfile from "./pages/PlayerProfile";
import PlayerDatabase from "./pages/PlayerDatabase";
import Scouts from "./pages/Scouts";
import ScoutProfile from "./pages/ScoutProfile";
import ShortlistPage from "./pages/Shortlist";
import ShadowTeams from "./pages/ShadowTeams"; // Import the new ShadowTeams page
import PlaceholderPage from "./pages/PlaceholderPage"; // Import the new generic PlaceholderPage
import { ShortlistProvider } from "./context/ShortlistContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { useState, useEffect } from "react";
import { initialMockPlayers } from "./data/mockPlayers";
import { mockScouts as initialMockScouts, initialMockAssignments } from "./data/mockScouts";
import { Player } from "./types/player";
import { Scout, Assignment } from "./types/scout";
import { Shortlist } from "./types/shortlist";
import { ShadowTeam } from "./types/shadow-team"; // Import ShadowTeam type

const queryClient = new QueryClient();

const App = () => {
  const [players, setPlayers] = useState<Player[]>(() => {
    if (typeof window !== 'undefined') {
      const savedPlayers = localStorage.getItem('players');
      return savedPlayers ? JSON.parse(savedPlayers) : initialMockPlayers;
    }
    return initialMockPlayers;
  });

  const [scouts, setScouts] = useState<Scout[]>(() => {
    if (typeof window !== 'undefined') {
      const savedScouts = localStorage.getItem('scouts');
      return savedScouts ? JSON.parse(savedScouts) : initialMockScouts;
    }
    return initialMockScouts;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    if (typeof window !== 'undefined') {
      const savedAssignments = localStorage.getItem('assignments');
      return savedAssignments ? JSON.parse(savedAssignments) : initialMockAssignments;
    }
    return initialMockAssignments;
  });

  const [shortlists, setShortlists] = useState<Shortlist[]>(() => {
    if (typeof window !== 'undefined') {
      const savedShortlists = localStorage.getItem('shortlists');
      return savedShortlists ? JSON.parse(savedShortlists) : [];
    }
    return [];
  });

  const [shadowTeams, setShadowTeams] = useState<ShadowTeam[]>(() => { // New state for Shadow Teams
    if (typeof window !== 'undefined') {
      const savedShadowTeams = localStorage.getItem('shadowTeams');
      return savedShadowTeams ? JSON.parse(savedShadowTeams) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('players', JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scouts', JSON.stringify(scouts));
    }
  }, [scouts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('assignments', JSON.stringify(assignments));
    }
  }, [assignments]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shortlists', JSON.stringify(shortlists));
    }
  }, [shortlists]);

  useEffect(() => { // New useEffect for shadowTeams
    if (typeof window !== 'undefined') {
      localStorage.setItem('shadowTeams', JSON.stringify(shadowTeams));
    }
  }, [shadowTeams]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ShortlistProvider shortlists={shortlists} setShortlists={setShortlists}>
              <Routes>
                <Route path="/" element={<Index players={players} scouts={scouts} shortlists={shortlists} shadowTeams={shadowTeams} />} />
                <Route path="/player/:id" element={<PlayerProfile players={players} setPlayers={setPlayers} scouts={scouts} shadowTeams={shadowTeams} setShadowTeams={setShadowTeams} />} />
                <Route path="/players" element={<PlayerDatabase players={players} setPlayers={setPlayers} />} />
                <Route path="/scouts" element={<Scouts assignments={assignments} setAssignments={setAssignments} scouts={scouts} />} />
                <Route path="/scouts/:id" element={<ScoutProfile players={players} assignments={assignments} scouts={scouts} setScouts={setScouts} />} />
                <Route path="/shortlists" element={<ShortlistPage />} />
                <Route path="/shadow-teams" element={<ShadowTeams players={players} shadowTeams={shadowTeams} setShadowTeams={setShadowTeams} />} /> {/* New route */}
                <Route path="/new-page-2" element={<PlaceholderPage />} />
                <Route path="/new-page-3" element={<PlaceholderPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ShortlistProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;