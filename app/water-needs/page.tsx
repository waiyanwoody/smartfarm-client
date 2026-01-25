"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { WaterNeeds } from "@/components/water-needs";

export default function WaterNeedsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Water Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Track irrigation schedules and water usage
          </p>
        </div>
        <WaterNeeds />
      </div>
    </DashboardLayout>
  );
}
