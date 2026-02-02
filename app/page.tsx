"use client";

import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Home,
  Droplets,
  CloudRain,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const quickActions = [
  {
    title: "Leaf Analysis",
    description: "Capture and analyze lettuce leaves for diseases",
    href: "/leaf-analysis",
    icon: Leaf,
    status: "Ready",
    statusType: "success",
  },
  {
    title: "Roof Control",
    description: "Manage greenhouse roof position",
    href: "/roof-control",
    icon: Home,
    status: "75% Open",
    statusType: "info",
  },
  {
    title: "Soil Moisture",
    description: "Monitor moisture levels across zones",
    href: "/soil-moisture",
    icon: Droplets,
    status: "Optimal",
    statusType: "success",
  },
  {
    title: "Water Management",
    description: "Track irrigation and water usage",
    href: "/water-needs",
    icon: CloudRain,
    status: "Scheduled",
    statusType: "warning",
  },
];

const recentAlerts = [
  {
    message: "Zone B moisture level below threshold",
    time: "10 mins ago",
    type: "warning",
  },
  {
    message: "Roof automatically closed due to rain",
    time: "2 hours ago",
    type: "info",
  },
  {
    message: "Weekly irrigation cycle completed",
    time: "5 hours ago",
    type: "success",
  },
];

type SystemStatus = {
  rain: string;
  soil: string;
  temperature: number;
  humidity: number;
};

export default function Dashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const pi_url = process.env.NEXT_PUBLIC_PI_URL!;
      const res = await fetch(`${pi_url}/status`);
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Failed to fetch status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus(); // initial fetch
    const interval = setInterval(fetchStatus, 5000); // auto-refresh every 5s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your lettuce farm performance
            </p>
          </div>

          <button
            onClick={fetchStatus}
            disabled={loading}
            className="text-sm px-4 py-2 rounded-md border hover:bg-muted"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Top Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Soil Moisture</p>
              <p
                className={cn(
                  "text-xl font-semibold",
                  status?.soil === "dry" ? "text-red-500" : "text-green-600"
                )}
              >
                {status ? status.soil : "--"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-xl font-semibold">
                {status ? `${status.temperature} °C` : "--"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-xl font-semibold">
                {status ? `${status.humidity} %` : "--"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Rain</p>
              <p
                className={cn(
                  "text-xl font-semibold",
                  status?.rain === "rain"
                    ? "text-blue-600"
                    : "text-green-600"
                )}
              >
                {status ? status.rain : "--"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3">
                      <action.icon className="w-5 h-5 text-primary" />
                      <Badge>{action.status}</Badge>
                    </div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <h2 className="text-lg font-medium mb-4">Recent Alerts</h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {recentAlerts.map((alert, i) => (
                <div key={i} className="flex gap-3 px-4 py-3">
                  {alert.type === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                  <div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}