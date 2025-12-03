import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Import Button
import { ChevronLeft } from "lucide-react"; // Import ChevronLeft icon

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="text-center bg-card p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-5xl font-bold mb-4 text-destructive">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)} // Go back to the previous page
          className="text-blue-400 hover:text-blue-300 p-0 h-auto"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;