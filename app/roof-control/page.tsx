"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { RoofControl } from "@/components/roof-control";

export default function RoofControlPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Roof Control</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your greenhouse roof position and automation
          </p>
        </div>
        <RoofControl />
      </div>
    </DashboardLayout>
  );
}
