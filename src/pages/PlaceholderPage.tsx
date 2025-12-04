"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const PlaceholderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Navigated to placeholder page: ${location.pathname}`);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="text-center bg-card p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold mb-4 text-primary">Coming Soon!</h1>
        <p className="text-xl text-muted-foreground mb-6">
          This page ({location.pathname}) is under construction.
        </p>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-primary hover:text-primary/90 p-0 h-auto"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Go Back
        </Button>
      </div>
    </div>
  );
};

export default PlaceholderPage;