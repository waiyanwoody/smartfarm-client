"use client";

import { cn } from "@/lib/utils"

import { DashboardLayout } from "@/components/dashboard-layout";
import { StatsOverview } from "@/components/stats-overview";
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

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Overview of your lettuce farm performance
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Quick Actions */}
        <div>
          <h2 className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-primary/10">
                        <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <Badge
                        variant={
                          action.statusType === "success"
                            ? "default"
                            : action.statusType === "warning"
                              ? "secondary"
                              : "outline"
                        }
                        className={cn(
                          "text-[10px] sm:text-xs",
                          action.statusType === "success"
                            ? "bg-primary/10 text-primary border-0"
                            : action.statusType === "warning"
                              ? "bg-amber-100 text-amber-700 border-0"
                              : ""
                        )}
                      >
                        {action.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm sm:text-base text-foreground mb-1">
                      {action.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                      {action.description}
                    </p>
                    <div className="flex items-center text-xs sm:text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Open
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <h2 className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">
            Recent Alerts
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4"
                  >
                    {alert.type === "warning" ? (
                      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-100 shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-foreground">{alert.message}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
