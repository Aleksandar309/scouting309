import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PlayerDatabase from "./pages/PlayerDatabase";
import Scouts from "./pages/Scouts";
import ShortlistPage from "./pages/Shortlist";
import ShadowTeams from "./pages/ShadowTeams";
import Tasks from "./pages/Tasks";
import Forum from "./pages/Forum";
import NotFound from "./pages/NotFound";
import PlayerProfile from "./pages/PlayerProfile";
import ScoutProfile from "./pages/ScoutProfile";
import ShortlistDetailsPage from "./pages/ShortlistDetailsPage"; // Import new page
import { Player } from "./types/player";
import { Scout } from "./types/scout";
import { Shortlist } from "./types/shortlist";
import { ShadowTeam } from "./types/shadow-team";
import { Task } from "./types/task";
import { ShortlistProvider } from "./context/ShortlistContext";
import { initialMockPlayers } from "./data/mockPlayers";
import { mockScouts } from "./data/mockScouts";
import { initialMockTasks } from "./data/mockTasks";

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [shadowTeams, setShadowTeams] = useState<ShadowTeam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    } else {
      setPlayers(initialMockPlayers);
    }

    const storedScouts = localStorage.getItem("scouts");
    if (storedScouts) {
      setScouts(JSON.parse(storedScouts));
    } else {
      setScouts(mockScouts);
    }

    const storedShortlists = localStorage.getItem("shortlists");
    if (storedShortlists) {
      setShortlists(JSON.parse(storedShortlists));
    } else {
      setShortlists([
        { id: "1", name: "Top Strikers 2024", players: [{ id: "5", name: "Evan Ferguson", team: "Brighton", positions: ["CF", "AM"] }], createdAt: new Date().toISOString() },
        { id: "2", name: "Midfield Targets", players: [{ id: "1", name: "Mats Wieffer", team: "Feyenoord", positions: ["DM", "CM", "CF"] }], createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
    }

    const storedShadowTeams = localStorage.getItem("shadowTeams");
    if (storedShadowTeams) {
      setShadowTeams(JSON.parse(storedShadowTeams));
    } else {
      setShadowTeams([
        { id: "1", name: "Dream Team Alpha", formationId: "433", playersByPosition: {}, sharingSettings: "private", calendarIntegration: false },
      ]);
    }

    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(initialMockTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("scouts", JSON.stringify(scouts));
  }, [scouts]);

  useEffect(() => {
    localStorage.setItem("shortlists", JSON.stringify(shortlists));
  }, [shortlists]);

  useEffect(() => {
    localStorage.setItem("shadowTeams", JSON.stringify(shadowTeams));
  }, [shadowTeams]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <Router>
      <ShortlistProvider shortlists={shortlists} setShortlists={setShortlists}>
        <Routes>
          <Route path="/" element={<Index players={players} scouts={scouts} shortlists={shortlists} shadowTeams={shadowTeams} tasks={tasks} />} />
          <Route path="/players" element={<PlayerDatabase players={players} setPlayers={setPlayers} />} />
          <Route path="/player/:id" element={<PlayerProfile players={players} setPlayers={setPlayers} scouts={scouts} shadowTeams={shadowTeams} setShadowTeams={setShadowTeams} />} />
          <Route path="/scouts" element={<Scouts assignments={[]} setAssignments={() => {}} scouts={scouts} setScouts={setScouts} players={players} tasks={tasks} setTasks={setTasks} />} />
          <Route path="/scouts/:id" element={<ScoutProfile players={players} assignments={[]} scouts={scouts} setScouts={setScouts} tasks={tasks} setTasks={setTasks} />} />
          <Route path="/shortlists" element={<ShortlistPage players={players} />} />
          <Route path="/shortlists/:id" element={<ShortlistDetailsPage players={players} />} />
          <Route path="/shadow-teams" element={<ShadowTeams shadowTeams={shadowTeams} setShadowTeams={setShadowTeams} players={players} />} />
          <Route path="/tasks" element={<Tasks tasks={tasks} setTasks={setTasks} scouts={scouts} />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ShortlistProvider>
    </Router>
  );
}

export default App;