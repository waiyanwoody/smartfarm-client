"use client";

import { useState } from "react";
import { Droplets, TrendingUp, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const zones = [
  { id: "zone-a", name: "Zone A", moisture: 72, optimal: true, temp: "23°C" },
  { id: "zone-b", name: "Zone B", moisture: 65, optimal: true, temp: "24°C" },
  { id: "zone-c", name: "Zone C", moisture: 48, optimal: false, temp: "25°C" },
  { id: "zone-d", name: "Zone D", moisture: 70, optimal: true, temp: "23°C" },
];

const moistureHistory = [
  { time: "00:00", value: 65 },
  { time: "04:00", value: 62 },
  { time: "08:00", value: 58 },
  { time: "12:00", value: 55 },
  { time: "16:00", value: 68 },
  { time: "20:00", value: 72 },
  { time: "Now", value: 68 },
];

export function SoilMoisture() {
  const [selectedZone, setSelectedZone] = useState("all");

  const averageMoisture = Math.round(
    zones.reduce((acc, z) => acc + z.moisture, 0) / zones.length
  );

  const maxValue = Math.max(...moistureHistory.map(h => h.value));
  const minValue = Math.min(...moistureHistory.map(h => h.value));

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Soil Moisture</CardTitle>
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-24 sm:w-32 h-7 sm:h-8 text-[10px] sm:text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {zones.map(zone => (
                <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Main gauge */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${averageMoisture * 2.64} 264`}
                strokeLinecap="round"
                className="text-chart-2"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-foreground">{averageMoisture}%</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Average</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Optimal Range</span>
              <span className="text-xs sm:text-sm font-medium text-foreground">60-75%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Status</span>
              <span className="text-xs sm:text-sm font-medium text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
                Optimal
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Last Updated</span>
              <span className="text-xs sm:text-sm text-foreground">2 min ago</span>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium text-foreground">24h Trend</span>
          </div>
          <div className="h-20 sm:h-24 flex items-end gap-0.5 sm:gap-1">
            {moistureHistory.map((point, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1">
                <div 
                  className="w-full rounded-t bg-chart-2/80 hover:bg-chart-2 transition-colors cursor-pointer relative group"
                  style={{ height: `${((point.value - minValue + 10) / (maxValue - minValue + 20)) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-[10px] sm:text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {point.value}%
                  </div>
                </div>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground">{point.time}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Zone grid */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Zone Status</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {zones.map((zone) => (
              <div 
                key={zone.id}
                className={`p-2 sm:p-3 rounded-md sm:rounded-lg border ${
                  zone.optimal 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-chart-3/5 border-chart-3/20"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                  <span className="text-xs sm:text-sm font-medium text-foreground">{zone.name}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{zone.temp}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Droplets className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${zone.optimal ? "text-chart-2" : "text-chart-3"}`} />
                  <span className={`text-sm sm:text-lg font-semibold ${zone.optimal ? "text-chart-2" : "text-chart-3"}`}>
                    {zone.moisture}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
