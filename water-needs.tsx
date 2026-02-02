"use client";

import { useEffect, useState } from "react";
import { Droplet, AlertCircle, CheckCircle, Play, Pause, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const API_BASE = "http://192.168.100.61:8000";

type SystemState = {
  mode: "auto" | "manual";
  soil: "dry" | "wet" | null;
  pump_status: "on" | "off";
};

export function WaterNeeds() {
  const [state, setState] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      const data = await res.json();
      setState(data);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // ===== Manual Water ON/OFF =====
  const toggleWater = async () => {
    if (!state || state.mode !== "manual") return;
    setLoading(true);
    try {
      if (state.pump_status === "on") {
        await fetch(`${API_BASE}/water/manual/stop`, { method: "POST" });
      } else {
        await fetch(`${API_BASE}/water/manual/start`, { method: "POST" });
      }
      await fetchStatus();
    } catch (err) {
      console.error("Manual water failed:", err);
    }
    setLoading(false);
  };

  // ===== Enable AUTO mode =====
  const enableAuto = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/water/auto`, { method: "POST" });
      await fetchStatus();
    } catch (err) {
      console.error("Enable auto failed:", err);
    }
    setLoading(false);
  };

  // ===== Enable MANUAL mode =====
  const enableManual = async () => {
    setLoading(true);
    try {
      // Switch mode manually, do NOT force pump ON/OFF
      await fetch(`${API_BASE}/water/manual/stop`, { method: "POST" }); // safe, ensures manual mode
      await fetchStatus();
    } catch (err) {
      console.error("Enable manual failed:", err);
    }
    setLoading(false);
  };

  if (!state) return null;

  const isAuto = state.mode === "auto";
  const isManual = state.mode === "manual";

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Water Management</span>
          <div className="flex gap-2">
            <Button size="sm" variant={isAuto ? "default" : "outline"} onClick={enableAuto} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Auto
            </Button>

            <Button size="sm" variant={isManual ? "default" : "outline"} onClick={enableManual} disabled={loading}>
              <Play className="w-4 h-4 mr-1" />
              Manual
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* MODE + SOIL */}
        <div className="flex justify-between text-sm">
          <span>
            Mode:{" "}
            <b className={isAuto ? "text-primary" : "text-orange-500"}>
              {state.mode.toUpperCase()}
            </b>
          </span>
          <span>
            Soil:{" "}
            <b className={state.soil === "dry" ? "text-red-500" : "text-green-500"}>
              {state.soil ?? "--"}
            </b>
          </span>
        </div>

        {/* PUMP STATUS */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Pump Status</span>
            {state.pump_status === "on" ? (
              <span className="flex items-center gap-1 text-chart-2">
                <Droplet className="w-4 h-4" /> ON
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground">
                <AlertCircle className="w-4 h-4" /> OFF
              </span>
            )}
          </div>

          <Progress value={state.pump_status === "on" ? 100 : 0} className="h-2" />

          <p className="text-xs text-muted-foreground mt-2">
            {isAuto
              ? "Automatic watering based on soil moisture. Manual button disabled."
              : "Manual watering control enabled — press Water / Stop to control the pump."}
          </p>
        </div>

        {/* MANUAL BUTTON */}
        {isManual && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={toggleWater}
              disabled={loading}
              className={
                state.pump_status === "on"
                  ? "bg-red-500 hover:bg-red-500/90"
                  : "bg-chart-2 hover:bg-chart-2/90"
              }
            >
              {state.pump_status === "on" ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Water
                </>
              )}
            </Button>
          </div>
        )}

        {/* AUTO INFO */}
        {isAuto && (
          <div className="flex items-center gap-2 text-xs text-primary">
            <CheckCircle className="w-4 h-4" />
            Auto watering active — pump runs only when soil is dry
          </div>
        )}
      </CardContent>
    </Card>
  );
}