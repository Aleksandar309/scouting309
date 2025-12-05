"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ChevronLeft } from 'lucide-react'; // Import ChevronLeft icon

const Forum: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6"> {/* Added w-full */}
      <div className="max-w-4xl w-full text-center p-8 bg-card rounded-lg shadow-2xl border border-border">
        {/* Back Button */}
        <div className="flex justify-start mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)} // Go back to the previous page
            className="text-muted-foreground hover:text-foreground p-0 h-auto"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Nazad
          </Button>
        </div>

        <MessageSquare className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Forum</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Dobrodošli na forum! Ovde svi članovi zajednice mogu da diskutuju, dele ideje i sarađuju.
        </p>
        <div className="space-y-4">
          <Card className="bg-muted border-border text-muted-foreground">
            <CardHeader>
              <CardTitle className="text-xl">Opšte diskusije</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Mesto za sve opšte teme i najave.</p>
            </CardContent>
          </Card>
          <Card className="bg-muted border-border text-muted-foreground">
            <CardHeader>
              <CardTitle className="text-xl">Skauting strategije</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Razmenite mišljenja o skauting metodama i analizama igrača.</p>
            </CardContent>
          </Card>
          <Card className="bg-muted border-border text-muted-foreground">
            <CardHeader>
              <CardTitle className="text-xl">Predlozi i povratne informacije</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Podelite svoje ideje za poboljšanje platforme.</p>
            </CardContent>
          </Card>
        </div>
        {/* Removed the old "Nazad na početnu" button as a new one is added at the top */}
      </div>
    </div>
  );
};

export default Forum;