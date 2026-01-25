"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  {
    id: "light" as const,
    label: "Light",
    icon: Sun,
    description: "Light background with dark text",
  },
  {
    id: "dark" as const,
    label: "Dark",
    icon: Moon,
    description: "Dark background with light text",
  },
  {
    id: "system" as const,
    label: "System",
    icon: Monitor,
    description: "Follow system preferences",
  },
];

const accentColors = [
  {
    id: "green" as const,
    label: "Green",
    color: "bg-[oklch(0.55_0.15_145)]",
    description: "Natural & Fresh",
  },
  {
    id: "blue" as const,
    label: "Blue",
    color: "bg-[oklch(0.55_0.15_240)]",
    description: "Calm & Professional",
  },
  {
    id: "purple" as const,
    label: "Purple",
    color: "bg-[oklch(0.55_0.15_300)]",
    description: "Creative & Modern",
  },
  {
    id: "orange" as const,
    label: "Orange",
    color: "bg-[oklch(0.65_0.18_50)]",
    description: "Warm & Energetic",
  },
  {
    id: "rose" as const,
    label: "Rose",
    color: "bg-[oklch(0.55_0.18_10)]",
    description: "Soft & Elegant",
  },
];

export default function SettingsPage() {
  const { theme, setTheme, accentColor, setAccentColor, resolvedTheme } = useTheme();
  const currentTheme = theme || "system";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Customize your SmartFarm dashboard experience
          </p>
        </div>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how SmartFarm looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Theme Mode */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-sm sm:text-base font-medium">Theme Mode</Label>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isSelected = currentTheme === themeOption.id;
                  return (
                    <button
                      key={themeOption.id}
                      onClick={() => setTheme(themeOption.id)}
                      className={cn(
                        "relative flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200",
                        "hover:border-primary/50 hover:bg-accent/50",
                        isSelected
                          ? "border-primary bg-accent"
                          : "border-border bg-card"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                      <div
                        className={cn(
                          "w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-xs sm:text-base text-foreground">
                          {themeOption.label}
                        </p>
                        <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">
                          {themeOption.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-sm sm:text-base font-medium">Accent Color</Label>
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {accentColors.map((colorOption) => {
                  const isSelected = accentColor === colorOption.id;
                  return (
                    <button
                      key={colorOption.id}
                      onClick={() => setAccentColor(colorOption.id)}
                      className={cn(
                        "relative flex flex-col items-center gap-1.5 sm:gap-3 p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200",
                        "hover:border-primary/50 hover:bg-accent/50",
                        isSelected
                          ? "border-primary bg-accent"
                          : "border-border bg-card"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                      <div
                        className={cn(
                          "w-6 h-6 sm:w-10 sm:h-10 rounded-full shadow-sm ring-2 ring-offset-1 sm:ring-offset-2 ring-offset-background transition-all",
                          colorOption.color,
                          isSelected ? "ring-foreground" : "ring-transparent"
                        )}
                      />
                      <div className="text-center">
                        <p className="font-medium text-[10px] sm:text-sm text-foreground">
                          {colorOption.label}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground hidden sm:block">
                          {colorOption.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Preview</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              See how your selected theme looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 sm:p-6 rounded-lg sm:rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold text-sm sm:text-base">SF</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">SmartFarm Dashboard</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Your lettuce analytics</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-md sm:rounded-lg bg-card border border-border">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Moisture</p>
                  <p className="text-sm sm:text-lg font-semibold text-primary">72%</p>
                </div>
                <div className="p-2 sm:p-3 rounded-md sm:rounded-lg bg-card border border-border">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Health</p>
                  <p className="text-sm sm:text-lg font-semibold text-primary">Good</p>
                </div>
                <div className="p-2 sm:p-3 rounded-md sm:rounded-lg bg-card border border-border">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Plants</p>
                  <p className="text-sm sm:text-lg font-semibold text-primary">124</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
