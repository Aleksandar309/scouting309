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
import ScoutProfile from "./pages/ScoutProfile"; // Import ScoutProfile
import ShortlistPage from "./pages/Shortlist";
import { ShortlistProvider } from "./context/ShortlistContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { useState } from "react"; // Import useState
import { initialMockPlayers } from "./data/mockPlayers"; // Import initial mock players
import { mockScouts } from "./data/mockScouts"; // Import mockScouts

const queryClient = new QueryClient();

const App = () => {
  const [players, setPlayers] = useState(initialMockPlayers); // Lift player state

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
                <Route path="/player/:id" element={<PlayerProfile players={players} setPlayers={setPlayers} scouts={mockScouts} />} /> {/* Pass scouts */}
                <Route path="/players" element={<PlayerDatabase players={players} setPlayers={setPlayers} />} />
                <Route path="/scouts" element={<Scouts />} />
                <Route path="/scouts/:id" element={<ScoutProfile players={players} />} /> {/* Pass players to ScoutProfile */}
                <Route path="/shortlists" element={<ShortlistPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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