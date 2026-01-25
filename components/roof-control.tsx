"use client";

import { useState } from "react";
import { Home, ChevronUp, ChevronDown, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type RoofStatus = "open" | "closed" | "partial" | "moving";

export function RoofControl() {
  const [roofStatus, setRoofStatus] = useState<RoofStatus>("partial");
  const [roofPosition, setRoofPosition] = useState(45);
  const [autoMode, setAutoMode] = useState(true);
  const [isMoving, setIsMoving] = useState(false);

  const moveRoof = (direction: "open" | "close") => {
    setIsMoving(true);
    setRoofStatus("moving");
    
    const targetPosition = direction === "open" ? 100 : 0;
    const step = direction === "open" ? 5 : -5;
    
    const interval = setInterval(() => {
      setRoofPosition(prev => {
        const next = prev + step;
        if ((direction === "open" && next >= targetPosition) || 
            (direction === "close" && next <= targetPosition)) {
          clearInterval(interval);
          setIsMoving(false);
          setRoofStatus(direction === "open" ? "open" : "closed");
          return targetPosition;
        }
        return next;
      });
    }, 100);
  };

  const schedules = [
    { time: "06:00", action: "Open", active: true },
    { time: "12:00", action: "Partial (50%)", active: true },
    { time: "18:00", action: "Close", active: true },
  ];

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-semibold text-foreground">Roof Control</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs text-muted-foreground">Auto</span>
            <Switch checked={autoMode} onCheckedChange={setAutoMode} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Roof Visualization */}
        <div className="relative">
          <div className="aspect-[2/1] rounded-lg sm:rounded-xl bg-gradient-to-b from-chart-2/20 to-primary/10 border border-border overflow-hidden relative">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-chart-5/10 to-transparent" />
            
            {/* Roof panels */}
            <div 
              className="absolute top-0 left-0 right-0 bg-card border-b-2 border-border transition-all duration-300 flex items-end justify-center"
              style={{ height: `${100 - roofPosition}%` }}
            >
              <div className="w-full h-full relative overflow-hidden">
                <div className="absolute inset-0 flex">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-border/30 last:border-r-0" />
                  ))}
                </div>
                <Home className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 text-muted-foreground/50" />
              </div>
            </div>
            
            {/* Sun indicator */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-chart-3/30 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-chart-3" />
            </div>
            
            {/* Status badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-card/90 border border-border">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  roofStatus === "moving" ? "bg-chart-3 animate-pulse" :
                  roofStatus === "open" ? "bg-primary" :
                  roofStatus === "closed" ? "bg-muted-foreground" :
                  "bg-chart-2"
                }`} />
                <span className="text-xs font-medium text-foreground capitalize">
                  {roofStatus === "moving" ? "Moving..." : roofStatus}
                </span>
              </div>
            </div>
          </div>
          
          {/* Position indicator */}
          <div className="mt-2 sm:mt-3 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-muted-foreground">Position</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground">{roofPosition}% Open</span>
          </div>
          <div className="mt-1.5 sm:mt-2 h-1.5 sm:h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${roofPosition}%` }}
            />
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Button 
            onClick={() => moveRoof("open")} 
            disabled={isMoving || roofPosition === 100}
            className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Open Roof
          </Button>
          <Button 
            variant="outline" 
            onClick={() => moveRoof("close")} 
            disabled={isMoving || roofPosition === 0}
            className="w-full h-9 sm:h-10 text-xs sm:text-sm"
          >
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Close Roof
          </Button>
        </div>
        
        {/* Schedule */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Scheduled Actions</span>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {schedules.map((schedule, i) => (
              <div key={i} className="flex items-center justify-between p-2 sm:p-3 rounded-md sm:rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-mono text-foreground">{schedule.time}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{schedule.action}</span>
                </div>
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${schedule.active ? "bg-primary" : "bg-muted-foreground"}`} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center justify-between p-2 sm:p-3 rounded-md sm:rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm text-foreground">Energy Saved Today</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-primary">2.4 kWh</span>
        </div>
      </CardContent>
    </Card>
  );
}
