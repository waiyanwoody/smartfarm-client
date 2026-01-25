"use client";

import { Droplets, Thermometer, Sun, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Soil Moisture",
    value: "68%",
    change: "+2.5%",
    positive: true,
    icon: Droplets,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    label: "Temperature",
    value: "24°C",
    change: "-1.2°C",
    positive: true,
    icon: Thermometer,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    label: "Light Intensity",
    value: "850 lux",
    change: "+120",
    positive: true,
    icon: Sun,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    label: "Humidity",
    value: "72%",
    change: "+5%",
    positive: true,
    icon: Wind,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-3 sm:p-5 border border-border bg-card">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
              <p className="text-lg sm:text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
              <p className={`text-[10px] sm:text-xs mt-1 ${stat.positive ? "text-primary" : "text-destructive"}`}>
                {stat.change} from yesterday
              </p>
            </div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
