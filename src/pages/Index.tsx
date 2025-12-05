import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LayoutDashboard, Search, ListChecks, ClipboardList, MessageSquare } from "lucide-react"; // Import MessageSquare icon
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Player } from "@/types/player"; // Import Player type
import { Scout } from "@/types/scout"; // Import Scout type
import { Shortlist } from "@/types/shortlist"; // Import Shortlist type
import { ShadowTeam } from "@/types/shadow-team"; // Import ShadowTeam type
import { Task } from "@/types/task"; // Import Task type
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components

interface IndexProps {
  players: Player[];
  scouts: Scout[];
  shortlists: Shortlist[];
  shadowTeams: ShadowTeam[];
  tasks: Task[]; // Add tasks to props
}

const Index: React.FC<IndexProps> = ({ players, scouts, shortlists, shadowTeams, tasks }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl w-full text-center p-8 bg-card rounded-lg shadow-2xl border border-border">
        <Logo className="mb-10 mx-auto" />
        <p className="text-xl text-muted-foreground mb-10">
          Your central hub for player analysis and team management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link to="/players" className="block">
            <Card className="bg-card border-border text-card-foreground hover:shadow-xl transition-shadow duration-300 min-h-[320px] flex flex-col cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Player Database</CardTitle>
                <Search className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-32 flex items-center justify-center w-full rounded-md mb-4 bg-muted text-primary text-6xl font-bold">
                        {players.length}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border text-popover-foreground">
                      <p>Total number of players in your database.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-muted-foreground mb-4">Browse and manage all scouted players.</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground pointer-events-none">
                  View Players
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/scouts" className="block">
            <Card className="bg-card border-border text-card-foreground hover:shadow-xl transition-shadow duration-300 min-h-[320px] flex flex-col cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Scouting Team</CardTitle>
                <Users className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="h-32 flex items-center justify-center w-full rounded-md mb-4 bg-muted text-primary text-6xl font-bold">
                  {scouts.length}
                </div>
                <p className="text-sm text-muted-foreground mb-4">Meet our dedicated scouting personnel.</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground pointer-events-none">
                  View Scouts
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/shortlists" className="block">
            <Card className="bg-card border-border text-card-foreground hover:shadow-xl transition-shadow duration-300 min-h-[320px] flex flex-col cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Shortlists</CardTitle>
                <ListChecks className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="h-32 flex items-center justify-center w-full rounded-md mb-4 bg-muted text-primary text-6xl font-bold">
                  {shortlists.length}
                </div>
                <p className="text-sm text-muted-foreground mb-4">Manage your curated player shortlists.</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground pointer-events-none">
                  View Shortlists
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* New grid for placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link to="/shadow-teams" className="block">
            <Card className="bg-card border-border text-card-foreground hover:shadow-xl transition-shadow duration-300 min-h-[320px] flex flex-col cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Shadow Teams</CardTitle>
                <LayoutDashboard className="h-6 w-6 text-primary" /> {/* Placeholder icon */}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-32 flex items-center justify-center w-full rounded-md mb-4 bg-muted text-primary text-6xl font-bold">
                        {shadowTeams.length}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border text-popover-foreground">
                      <p>Total number of shadow teams you have created.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-muted-foreground mb-4">Create and manage your dream teams.</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground pointer-events-none">
                  Go to Shadow Teams
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tasks" className="block">
            <Card className="bg-card border-border text-card-foreground hover:shadow-xl transition-shadow duration-300 min-h-[320px] flex flex-col cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Scouting Tasks</CardTitle>
                <ClipboardList className="h-6 w-6 text-primary" /> {/* New icon for tasks */}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-32 flex items-center justify-center w-full rounded-md mb-4 bg-muted text-primary text-6xl font-bold">
                        {tasks.length}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border text-popover-foreground">
                      <p>Total number of scouting tasks.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-muted-foreground mb-4">Manage scouting assignments and missions.</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground pointer-events-none">
                  View Tasks
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/forum" className="block">
            <Card className="bg-card border-border text-card-foreground hover:shadow-xl transition-shadow duration-300 min-h-[320px] flex flex-col cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Forum</CardTitle>
                <MessageSquare className="h-6 w-6 text-primary" /> {/* Icon for Forum */}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="h-32 flex items-center justify-center w-full rounded-md mb-4 bg-muted text-primary text-6xl font-bold">
                  <MessageSquare className="h-16 w-16" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Mesto za diskusiju za sve članove zajednice.</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground pointer-events-none">
                  Idi na Forum
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;