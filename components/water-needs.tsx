"use client";

import { useState } from "react";
import { Droplet, Calendar, AlertCircle, CheckCircle, Play, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const wateringSchedule = [
  { zone: "Zone A", time: "06:30", duration: "15 min", status: "completed" },
  { zone: "Zone B", time: "07:00", duration: "12 min", status: "completed" },
  { zone: "Zone C", time: "14:00", duration: "20 min", status: "pending" },
  { zone: "Zone D", time: "14:30", duration: "15 min", status: "pending" },
];

const plantNeeds = [
  { stage: "Seedling", waterNeed: "Low", frequency: "2x daily", current: true },
  { stage: "Vegetative", waterNeed: "Medium", frequency: "1x daily", current: false },
  { stage: "Mature", waterNeed: "High", frequency: "2x daily", current: false },
];

export function WaterNeeds() {
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [irrigationProgress, setIrrigationProgress] = useState(0);

  const startIrrigation = () => {
    setIsIrrigating(true);
    setIrrigationProgress(0);
    
    const interval = setInterval(() => {
      setIrrigationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsIrrigating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const waterUsedToday = 145;
  const waterTarget = 200;
  const waterPercentage = (waterUsedToday / waterTarget) * 100;

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-semibold text-foreground">Water Management</span>
          <Button 
            size="sm" 
            onClick={isIrrigating ? () => setIsIrrigating(false) : startIrrigation}
            className={`h-7 sm:h-8 text-[10px] sm:text-xs ${isIrrigating 
              ? "bg-chart-3 hover:bg-chart-3/90 text-foreground" 
              : "bg-chart-2 hover:bg-chart-2/90 text-foreground"
            }`}
          >
            {isIrrigating ? (
              <>
                <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                Irrigate
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Irrigation progress */}
        {isIrrigating && (
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-chart-2/10 border border-chart-2/30">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="text-xs sm:text-sm font-medium text-foreground">Irrigation in Progress</span>
              <span className="text-xs sm:text-sm text-chart-2 font-semibold">{irrigationProgress}%</span>
            </div>
            <Progress value={irrigationProgress} className="h-1.5 sm:h-2" />
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
              Watering Zone C - Est. time: {Math.round((100 - irrigationProgress) * 0.12)} min
            </p>
          </div>
        )}
        
        {/* Daily water usage */}
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-chart-2" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Daily Usage</span>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">{waterUsedToday}L / {waterTarget}L</span>
          </div>
          <div className="h-2 sm:h-3 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-chart-2 to-chart-2/70 rounded-full transition-all duration-500"
              style={{ width: `${waterPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 sm:mt-2">
            <span className="text-[10px] sm:text-xs text-primary flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              On track for today
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">{Math.round(waterPercentage)}% of target</span>
          </div>
        </div>
        
        {/* Schedule */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium text-foreground">{"Today's Schedule"}</span>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {wateringSchedule.map((item, i) => (
              <div 
                key={i}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-md sm:rounded-lg border ${
                  item.status === "completed" 
                    ? "bg-muted/30 border-border" 
                    : "bg-chart-2/5 border-chart-2/20"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {item.status === "completed" ? (
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-chart-2 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-medium text-foreground">{item.zone}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground ml-1.5 sm:ml-2">{item.duration}</span>
                  </div>
                </div>
                <span className={`text-xs sm:text-sm shrink-0 ${
                  item.status === "completed" ? "text-muted-foreground" : "text-foreground font-medium"
                }`}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Plant growth stage */}
        <div>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">
            Water Needs by Growth Stage
          </p>
          <div className="flex gap-1.5 sm:gap-2">
            {plantNeeds.map((stage, i) => (
              <div 
                key={i}
                className={`flex-1 p-2 sm:p-3 rounded-md sm:rounded-lg text-center border ${
                  stage.current 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-muted/30 border-border"
                }`}
              >
                <p className={`text-[10px] sm:text-xs font-medium ${stage.current ? "text-primary" : "text-muted-foreground"}`}>
                  {stage.stage}
                </p>
                <p className={`text-xs sm:text-sm font-semibold mt-0.5 sm:mt-1 ${stage.current ? "text-foreground" : "text-muted-foreground"}`}>
                  {stage.waterNeed}
                </p>
                <p className="text-[8px] sm:text-[10px] text-muted-foreground mt-0.5">{stage.frequency}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
