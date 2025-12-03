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
import ShortlistPage from "./pages/Shortlist";
import { ShortlistProvider } from "./context/ShortlistContext";
import { ThemeProvider } from "./components/ThemeProvider"; // Import ThemeProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> {/* Wrap with ThemeProvider */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ShortlistProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/player/:id" element={<PlayerProfile />} />
              <Route path="/players" element={<PlayerDatabase />} />
              <Route path="/scouts" element={<Scouts />} />
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

export default App;