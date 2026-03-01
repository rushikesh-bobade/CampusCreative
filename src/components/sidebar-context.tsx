"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isHidden: boolean;
  setIsHidden: (value: boolean) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

  export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const savedHidden = localStorage.getItem("sidebar_hidden");
      const savedCollapsed = localStorage.getItem("sidebar_collapsed");
      if (savedHidden === "true") setIsHidden(true);
      if (savedCollapsed === "true") setIsCollapsed(true);

      const handleResize = () => {
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);
        if (mobile) {
          setIsCollapsed(true);
        }
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleHidden = (val: boolean) => {
      setIsHidden(val);
      localStorage.setItem("sidebar_hidden", val.toString());
    };

    const toggleCollapsed = (val: boolean) => {
      setIsCollapsed(val);
      localStorage.setItem("sidebar_collapsed", val.toString());
    };

    return (
      <SidebarContext.Provider
        value={{
          isCollapsed,
          setIsCollapsed: toggleCollapsed,
          isHidden,
          setIsHidden: toggleHidden,
          isMobile,
          isOpen,
          setIsOpen,
        }}
      >
        {children}
      </SidebarContext.Provider>
    );
  }

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
