import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Players from "./pages/Players";
import Scouts from "./pages/Scouts";
import Shortlists from "./pages/Shortlists";
import ShadowTeams from "./pages/ShadowTeams";
import Tasks from "./pages/Tasks";
import Forum from "./pages/Forum"; // Import the new Forum page
import NotFound from "./pages/NotFound";
import { Player } from "./types/player";
import { Scout } from "./types/scout";
import { Shortlist } from "./types/shortlist";
import { ShadowTeam } from "./types/shadow-team";
import { Task } from "./types/task";

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [shadowTeams, setShadowTeams] = useState<ShadowTeam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Initialize with some dummy data if localStorage is empty
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    } else {
      setPlayers([
        { id: "1", name: "Lionel Messi", position: "Forward", team: "Inter Miami", nationality: "Argentina", dateOfBirth: "1987-06-24", scoutedBy: "1", reports: [] },
        { id: "2", name: "Cristiano Ronaldo", position: "Forward", team: "Al Nassr", nationality: "Portugal", dateOfBirth: "1985-02-05", scoutedBy: "2", reports: [] },
      ]);
    }

    const storedScouts = localStorage.getItem("scouts");
    if (storedScouts) {
      setScouts(JSON.parse(storedScouts));
    } else {
      setScouts([
        { id: "1", name: "Marko Petrović", email: "marko.petrovic@example.com", phone: "123-456-7890", region: "Europe", assignedTasks: [] },
        { id: "2", name: "Ana Kovačević", email: "ana.kovacevic@example.com", phone: "098-765-4321", region: "South America", assignedTasks: [] },
      ]);
    }

    const storedShortlists = localStorage.getItem("shortlists");
    if (storedShortlists) {
      setShortlists(JSON.parse(storedShortlists));
    } else {
      setShortlists([
        { id: "1", name: "Top Strikers 2024", players: ["1"], createdAt: "2024-01-15" },
      ]);
    }

    const storedShadowTeams = localStorage.getItem("shadowTeams");
    if (storedShadowTeams) {
      setShadowTeams(JSON.parse(storedShadowTeams));
    } else {
      setShadowTeams([
        { id: "1", name: "Dream Team Alpha", players: ["1", "2"], formation: "4-3-3", createdAt: "2024-02-01" },
      ]);
    }

    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks([
        { id: "1", title: "Scout new talent in Brazil", description: "Focus on U20 players in São Paulo.", assignedTo: "2", status: "Pending", dueDate: "2024-07-30" },
        { id: "2", title: "Analyze Messi's recent performance", description: "Create a detailed report on his last 5 games.", assignedTo: "1", status: "Completed", dueDate: "2024-06-20" },
      ]);
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
      <Routes>
        <Route path="/" element={<Index players={players} scouts={scouts} shortlists={shortlists} shadowTeams={shadowTeams} tasks={tasks} />} />
        <Route path="/players" element={<Players players={players} setPlayers={setPlayers} scouts={scouts} />} />
        <Route path="/scouts" element={<Scouts scouts={scouts} setScouts={setScouts} players={players} tasks={tasks} setTasks={setTasks} />} />
        <Route path="/shortlists" element={<Shortlists shortlists={shortlists} setShortlists={setShortlists} players={players} />} />
        <Route path="/shadow-teams" element={<ShadowTeams shadowTeams={shadowTeams} setShadowTeams={setShadowTeams} players={players} />} />
        <Route path="/tasks" element={<Tasks tasks={tasks} setTasks={setTasks} scouts={scouts} />} />
        <Route path="/forum" element={<Forum />} /> {/* New route for Forum */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;