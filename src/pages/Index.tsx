import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LayoutDashboard, Search, UserRound, ListChecks } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle /> {/* Add ThemeToggle here */}
      </div>
      <div className="max-w-4xl w-full text-center p-8 bg-card rounded-lg shadow-2xl border border-border">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Brighton Scouting Dashboard
        </h1>
        <p className="text-xl text-muted-foreground mb-10">
          Your central hub for player analysis and team management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Player Database</CardTitle>
              <Search className="h-6 w-6 text-blue-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Browse and manage all scouted players.</p>
              <Link to="/players">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View Players
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Scouting Team</CardTitle>
              <Users className="h-6 w-6 text-green-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Meet our dedicated scouting personnel.</p>
              <Link to="/scouts">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  View Scouts
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Shortlists</CardTitle>
              <ListChecks className="h-6 w-6 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Manage your curated player shortlists.</p>
              <Link to="/shortlists">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                  View Shortlists
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200 col-span-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Example Player Profile</CardTitle>
              <UserRound className="h-6 w-6 text-purple-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">See a detailed player profile in action.</p>
              <Link to="/player/1">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  View Example Player
                </Button>
              </Link>
            </CardContent>
          </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;