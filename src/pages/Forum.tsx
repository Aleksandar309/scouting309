"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react'; // Icon for forum

const Forum: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-2xl w-full text-center p-8 bg-card rounded-lg shadow-2xl border border-border">
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
        <Link to="/" className="mt-8 inline-block">
          <Button variant="outline">Nazad na početnu</Button>
        </Link>
      </div>
    </div>
  );
};

export default Forum;