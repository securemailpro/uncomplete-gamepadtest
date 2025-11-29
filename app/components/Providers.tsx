"use client";

import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { TooltipProvider } from '@/app/components/ui/tooltip';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="gamepad-tester-theme">
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
