"use client";

import { SidebarProvider, useSidebar } from "./sidebar-context";
import { SearchProvider } from "./search-context";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublicPage = pathname === "/" || pathname?.startsWith("/login") || pathname?.startsWith("/auth/callback");

  if (isPublicPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <SidebarProvider>
      <SearchProvider>
        {mounted ? (
          <LayoutContent>{children}</LayoutContent>
        ) : (
          <main className="min-h-screen bg-background">{children}</main>
        )}
      </SearchProvider>
    </SidebarProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isHidden, isMobile } = useSidebar();

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <Sidebar />
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          !isMobile && !isHidden && (isCollapsed ? "lg:ml-20" : "lg:ml-64"),
          !isMobile && isHidden && "lg:ml-0"
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-auto relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
