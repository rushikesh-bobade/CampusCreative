"use client";

import { 
  Sparkles, 
  LayoutDashboard, 
  PenTool, 
  Palette, 
  Wrench, 
  ShieldCheck, 
  Users, 
  ChevronLeft,
  ChevronRight,
  Menu,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
  EyeOff
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Creator Hub", icon: PenTool, href: "/creator" },
  { name: "Asset Studio", icon: Palette, href: "/studio" },
  { name: "Utility Builder", icon: Wrench, href: "/builder" },
  { name: "Review Lab", icon: ShieldCheck, href: "/review" },
  { name: "Collaboration", icon: Users, href: "/collab" },
];

export function Sidebar() {
  const { isCollapsed, setIsCollapsed, isHidden, setIsHidden, isMobile, isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();

  const navContent = (
    <div className="flex flex-col h-full py-4">
      <div className={cn(
        "flex items-center gap-3 px-6 mb-8",
        isCollapsed && !isMobile ? "justify-center px-0" : ""
      )}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Sparkles className="h-6 w-6" />
        </div>
        {(!isCollapsed || isMobile) && (
          <div>
            <h1 className="text-lg font-bold tracking-tight whitespace-nowrap">
              Campus <span className="text-primary">Creative</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">AI Creative Suite</p>
          </div>
        )}
      </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && !isMobile ? "justify-center" : ""
                )}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
                {isActive && isCollapsed && !isMobile && (
                  <div className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto space-y-1 border-t pt-4">
          <Link 
            href="/settings"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200",
              isCollapsed && !isMobile ? "justify-center" : ""
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {(!isCollapsed || isMobile) && <span className="font-medium text-sm">Settings</span>}
          </Link>
          <button 
            onClick={() => setIsHidden(true)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200",
              isCollapsed && !isMobile ? "justify-center" : ""
            )}
          >
            <EyeOff className="h-5 w-5 shrink-0" />
            {(!isCollapsed || isMobile) && <span className="font-medium text-sm">Hide Sidebar</span>}
          </button>
          <Link 
            href="/subscription"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-4 mt-2 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
              isCollapsed && !isMobile ? "p-2 justify-center" : ""
            )}
          >
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Pro Plan</p>
              <p className="text-[10px] text-muted-foreground truncate">Unlimited Generations</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );

  // On mobile we use a different drawer mechanism
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-[60]">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full bg-background/80 backdrop-blur-md shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Drawer Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            "lg:hidden fixed top-0 left-0 z-[70] h-screen w-64 bg-card border-r transition-transform duration-300 ease-in-out shadow-2xl",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {navContent}
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Sidebar for Desktop */}
        <aside 
          className={cn(
            "hidden lg:flex flex-col fixed top-0 left-0 z-50 h-screen bg-card border-r transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
            isHidden ? "w-0 border-r-0 -translate-x-full" : (isCollapsed ? "w-20 translate-x-0" : "w-64 translate-x-0")
          )}
        >
          <div className={cn(
            "h-full",
            isCollapsed ? "w-20" : "w-64"
          )}>
            {navContent}
          </div>
          {!isHidden && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground shadow-sm transition-colors"
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>
          )}
        </aside>
    </>
  );
}
