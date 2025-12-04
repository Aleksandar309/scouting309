import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LayoutDashboard, Search, ListChecks } from "lucide-react"; // Removed UserRound as it's no longer needed for the example player card
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

const Index = () => {
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
          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Player Database</CardTitle>
              <Search className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Browse and manage all scouted players.</p>
              <Link to="/players">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Players
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Scouting Team</CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Meet our dedicated scouting personnel.</p>
              <Link to="/scouts">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Scouts
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Shortlists</CardTitle>
              <ListChecks className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Manage your curated player shortlists.</p>
              <Link to="/shortlists">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Shortlists
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* New grid for placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">New Page 1</CardTitle>
              <LayoutDashboard className="h-6 w-6 text-primary" /> {/* Placeholder icon */}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Description for New Page 1.</p>
              <Link to="/new-page-1">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Go to Page 1
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">New Page 2</CardTitle>
              <LayoutDashboard className="h-6 w-6 text-primary" /> {/* Placeholder icon */}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Description for New Page 2.</p>
              <Link to="/new-page-2">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Go to Page 2
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground hover:bg-accent transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">New Page 3</CardTitle>
              <LayoutDashboard className="h-6 w-6 text-primary" /> {/* Placeholder icon */}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Description for New Page 3.</p>
              <Link to="/new-page-3">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Go to Page 3
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;