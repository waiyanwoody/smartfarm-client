"use client";

import { useState, useEffect } from "react";
import { Home, ChevronUp, ChevronDown, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type RoofStatus = "open" | "closed" | "moving";

// ✅ Use env variable instead of hardcoded IP
const PI_URL = process.env.NEXT_PUBLIC_PI_URL ;

export function RoofControl() {
  const [roofStatus, setRoofStatus] = useState<RoofStatus>("closed");
  const [roofPosition, setRoofPosition] = useState(0);
  const [autoMode, setAutoMode] = useState(true);
  const [isMoving, setIsMoving] = useState(false);

  // 🔥 REAL HARDWARE CONTROL
  const sendRoofCommand = async (value: 0 | 1) => {
    setIsMoving(true);
    setRoofStatus("moving");

    try {
      const res = await fetch(`${PI_URL}/rain/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();

      setRoofStatus(data.roof_status as RoofStatus);
      setRoofPosition(data.roof_status === "open" ? 100 : 0);
    } catch (err) {
      console.error("Failed to control roof", err);
    } finally {
      setIsMoving(false);
    }
  };

  // ⚡ Auto mode toggle effect
  useEffect(() => {
    const setAuto = async () => {
      try {
        const res = await fetch(`${PI_URL}/rain/auto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setRoofStatus(data.roof_status as RoofStatus);
        setRoofPosition(data.roof_status === "open" ? 100 : 0);
      } catch (err) {
        console.error("Failed to set auto mode", err);
      }
    };
    setAuto();
  }, [autoMode]);

  // 🕒 Poll /status every 1.5s for real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${PI_URL}/status`);
        const data = await res.json();
        setRoofStatus(data.roof_status as RoofStatus);
        setRoofPosition(data.roof_status === "open" ? 100 : 0);
        setIsMoving(data.is_moving);
      } catch (err) {
        console.error("Failed to fetch roof status", err);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const schedules = [
    { time: "06:00", action: "Open", active: true },
    { time: "18:00", action: "Close", active: true },
  ];

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Roof Control</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Auto</span>
            <Switch checked={autoMode} onCheckedChange={setAutoMode} />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ROOF VISUAL */}
        <div className="relative">
          <div className="aspect-[2/1] rounded-xl bg-gradient-to-b from-muted to-background border overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 bg-card border-b transition-all"
              style={{ height: `${100 - roofPosition}%` }}
            >
              <Home className="absolute bottom-2 left-1/2 -translate-x-1/2 text-muted-foreground" />
            </div>

            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-card border">
              <span className="text-xs font-medium capitalize">
                {roofStatus === "moving" ? "Moving..." : roofStatus}
              </span>
            </div>
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Position</span>
            <span className="font-semibold">{roofPosition}% Open</span>
          </div>

          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${roofPosition}%` }}
            />
          </div>
        </div>

        {/* MANUAL CONTROLS */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => sendRoofCommand(1)}
            disabled={isMoving || roofPosition === 100 || autoMode}
          >
            <ChevronUp className="w-4 h-4 mr-2" />
            Open Roof
          </Button>

          <Button
            variant="outline"
            onClick={() => sendRoofCommand(0)}
            disabled={isMoving || roofPosition === 0 || autoMode}
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Close Roof
          </Button>
        </div>

        {/* SCHEDULE (UI ONLY) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Scheduled Actions</span>
          </div>

          <div className="space-y-2">
            {schedules.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-2 rounded-lg bg-muted/50 border"
              >
                <span className="font-mono text-sm">{s.time}</span>
                <span className="text-sm text-muted-foreground">{s.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border">
          <span className="text-sm font-medium">Energy Saved Today</span>
          <span className="font-semibold text-primary">2.4 kWh</span>
        </div>
      </CardContent>
    </Card>
  );
}