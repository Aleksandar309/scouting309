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
import { ShortlistProvider } from "./context/ShortlistContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { useState, useEffect } from "react"; // Import useEffect
import { initialMockPlayers } from "./data/mockPlayers";
import { mockScouts, initialMockAssignments } from "./data/mockScouts";
import { Player } from "./types/player"; // Import Player type

const queryClient = new QueryClient();

const App = () => {
  // Initialize players state from localStorage or use initial mock data
  const [players, setPlayers] = useState<Player[]>(() => {
    if (typeof window !== 'undefined') {
      const savedPlayers = localStorage.getItem('players');
      return savedPlayers ? JSON.parse(savedPlayers) : initialMockPlayers;
    }
    return initialMockPlayers;
  });

  // Save players state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('players', JSON.stringify(players));
    }
  }, [players]);

  const [assignments, setAssignments] = useState(initialMockAssignments);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ShortlistProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/player/:id" element={<PlayerProfile players={players} setPlayers={setPlayers} scouts={mockScouts} />} />
                <Route path="/players" element={<PlayerDatabase players={players} setPlayers={setPlayers} />} />
                <Route path="/scouts" element={<Scouts assignments={assignments} setAssignments={setAssignments} />} />
                <Route path="/scouts/:id" element={<ScoutProfile players={players} assignments={assignments} />} />
                <Route path="/shortlists" element={<ShortlistPage />} />
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