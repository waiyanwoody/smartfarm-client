"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <main className="flex-1 min-h-screen overflow-x-hidden w-full">
        <div className="p-4 pt-16 lg:pt-6 lg:p-6 xl:p-8">{children}</div>
      </main>
    </div>
  );
}
