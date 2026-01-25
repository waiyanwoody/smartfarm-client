"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { SoilMoisture } from "@/components/soil-moisture";

export default function SoilMoisturePage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Soil Moisture</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Monitor soil moisture levels across all farm zones
          </p>
        </div>
        <SoilMoisture />
      </div>
    </DashboardLayout>
  );
}
