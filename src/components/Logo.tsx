"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link to="/" className={cn("flex items-center space-x-2 block", className)}>
      <span className="text-3xl font-extrabold text-brand-foreground bg-brand px-3 py-1 rounded-lg shadow-md">
        309
      </span>
      <span className="text-3xl font-extrabold text-foreground">
        Scouting
      </span>
    </Link>
  );
};

export default Logo;