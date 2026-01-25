"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { createContext, useContext, useEffect, useState } from "react";

type AccentColor = "green" | "blue" | "purple" | "orange" | "rose";

interface AccentContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const AccentContext = createContext<AccentContextType | undefined>(undefined);

function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColor>("green");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedAccent = localStorage.getItem("smartfarm-accent") as AccentColor | null;
    if (savedAccent) {
      setAccentColorState(savedAccent);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    const accentColors: Record<AccentColor, { primary: string; ring: string }> = {
      green: {
        primary: "oklch(0.55 0.15 145)",
        ring: "oklch(0.55 0.15 145)",
      },
      blue: {
        primary: "oklch(0.55 0.15 240)",
        ring: "oklch(0.55 0.15 240)",
      },
      purple: {
        primary: "oklch(0.55 0.15 300)",
        ring: "oklch(0.55 0.15 300)",
      },
      orange: {
        primary: "oklch(0.65 0.18 50)",
        ring: "oklch(0.65 0.18 50)",
      },
      rose: {
        primary: "oklch(0.55 0.18 10)",
        ring: "oklch(0.55 0.18 10)",
      },
    };

    const colors = accentColors[accentColor];
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--ring", colors.ring);
    root.style.setProperty("--sidebar-primary", colors.primary);
    root.style.setProperty("--sidebar-ring", colors.ring);
    root.style.setProperty("--chart-1", colors.primary);
  }, [accentColor, mounted]);

  const setAccentColor = (newColor: AccentColor) => {
    setAccentColorState(newColor);
    localStorage.setItem("smartfarm-accent", newColor);
  };

  return (
    <AccentContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccentColor() {
  const context = useContext(AccentContext);
  if (!context) {
    throw new Error("useAccentColor must be used within a ThemeProvider");
  }
  return context;
}

export function useTheme() {
  const nextTheme = useNextTheme();
  const accent = useAccentColor();
  return {
    ...nextTheme,
    ...accent,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AccentProvider>{children}</AccentProvider>
    </NextThemesProvider>
  );
}
