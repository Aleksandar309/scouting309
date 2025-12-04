"use client";

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'New Page';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full text-center bg-card p-8 rounded-lg shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4 capitalize">{pageName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-muted-foreground mb-6">
            This is a placeholder page. Content coming soon!
          </p>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-primary hover:text-primary/90 p-0 h-auto"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Go Back
          </Button>
        </CardContent>
      </div>
    </div>
  );
};

export default PlaceholderPage;