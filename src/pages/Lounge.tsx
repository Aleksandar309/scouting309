"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const PlaceholderPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="text-center bg-card p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold mb-4">Coming Soon!</h1>
        <p className="text-xl text-muted-foreground mb-6">
          This page is under construction. Check back later for exciting updates!
        </p>
        <Link to="/">
          <Button variant="ghost" className="text-primary hover:text-primary/90 p-0 h-auto">
            <ChevronLeft className="h-5 w-5 mr-1" /> Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PlaceholderPage;