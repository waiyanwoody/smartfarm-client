"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import LeafAnalysis from "@/components/leaf-analysis";

export default function LeafAnalysisPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Leaf Analysis</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Capture and analyze lettuce leaves for disease detection
          </p>
        </div>
        <LeafAnalysis />
      </div>
    </DashboardLayout>
  );
}
