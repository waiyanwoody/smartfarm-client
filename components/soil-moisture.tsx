"use client";

import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SoilHistoryPoint = {
  time: string;
  value: number;
};

const MAX_HISTORY_POINTS = 60; // 5s × 60 = last 5 minutes

export default function SoilMoisture() {
  const [soilPercentage, setSoilPercentage] = useState(0);
  const [history, setHistory] = useState<SoilHistoryPoint[]>([]);

  const pi_url = process.env.NEXT_PUBLIC_PI_URL!;

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${pi_url}/status`);
      const data = await res.json();

      // Map soil state to percentage
      const value = data.soil === "dry" ? 35 : 75;
      setSoilPercentage(value);

      const now = new Date();
      const timeLabel =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0") +
        ":" +
        now.getSeconds().toString().padStart(2, "0");

      setHistory((prev) => [
        ...prev.slice(-MAX_HISTORY_POINTS + 1),
        { time: timeLabel, value },
      ]);
    } catch (err) {
      console.error("Failed to fetch soil status", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5 * 1000); // every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const isOptimal = soilPercentage >= 60 && soilPercentage <= 75;

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          Soil Moisture
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-2 text-2xl font-bold">
            {soilPercentage}%
            <span className={cn(isOptimal ? "text-green-600" : "text-red-500")}>
              {isOptimal ? "Optimal" : "Dry"}
            </span>
          </div>

          <div className="flex-1 w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          <span className="text-lg font-medium">
            Current Soil Moisture: {soilPercentage}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}