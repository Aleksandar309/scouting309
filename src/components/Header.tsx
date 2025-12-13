"use client";

import React from 'react';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm py-3 px-6 flex items-center justify-between",
      className
    )}>
      <Logo />
      <ThemeToggle />
    </header>
  );
};

export default Header;