"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Leaf,
  Home,
  Droplets,
  CloudRain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Leaf Analysis",
    href: "/leaf-analysis",
    icon: Leaf,
  },
  {
    label: "Roof Control",
    href: "/roof-control",
    icon: Home,
  },
  {
    label: "Soil Moisture",
    href: "/soil-moisture",
    icon: Droplets,
  },
  // {
  //   label: "Water Needs",
  //   href: "/water-needs",
  //   icon: CloudRain,
  // },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border shadow-md hover:bg-accent transition-colors"
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0 z-40",
          // Mobile styles
          "fixed lg:relative",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Width
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo */}
          <div className={cn(
            "flex items-center gap-3 px-6 py-6 border-b border-border transition-all duration-300",
            isCollapsed && "lg:px-4 lg:justify-center"
          )}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shrink-0">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="overflow-hidden lg:hidden xl:block">
                <h1 className="text-lg font-semibold text-foreground whitespace-nowrap">SmartFarm</h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Lettuce Analytics</p>
              </div>
            )}
            {!isCollapsed && (
              <div className="overflow-hidden hidden lg:block xl:hidden">
                <h1 className="text-lg font-semibold text-foreground whitespace-nowrap">SmartFarm</h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Lettuce Analytics</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden",
            isCollapsed && !isMobileOpen ? "lg:px-3" : "px-4"
          )}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isCollapsed && !isMobileOpen ? "lg:px-3 lg:justify-center px-4" : "px-4",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {(!isCollapsed || isMobileOpen) && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={cn(
            "py-4 border-t border-border",
            isCollapsed && !isMobileOpen ? "lg:px-3" : "px-4"
          )}>
            <Link
              href="/settings"
              onClick={handleNavClick}
              title={isCollapsed && !isMobileOpen ? "Settings" : undefined}
              className={cn(
                "flex items-center gap-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                isCollapsed && !isMobileOpen ? "lg:px-3 lg:justify-center px-4" : "px-4"
              )}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Settings</span>}
            </Link>
            {(!isCollapsed || isMobileOpen) && (
              <div className="mt-4 px-4">
                <p className="text-xs text-muted-foreground">
                  Farm Status: <span className="text-primary font-medium">Online</span>
                </p>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute top-6 -right-3 z-50 hidden lg:flex",
              "items-center justify-center",
              "w-6 h-6 bg-card hover:bg-accent border border-border rounded-full shadow-md",
              "hover:shadow-lg hover:scale-110 active:scale-95",
              "transition-all duration-200 ease-out",
              "group"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
