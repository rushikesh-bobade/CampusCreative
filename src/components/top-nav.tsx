"use client";

import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Plus,
  ArrowRight,
  Menu
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSearch } from "./search-context";
import { useSidebar } from "./sidebar-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const quickTools = [
  { name: "Creator Hub", href: "/creator", desc: "Text, Images, Marketing" },
  { name: "Asset Studio", href: "/studio", desc: "Design & Visuals" },
  { name: "Utility Builder", href: "/builder", desc: "Custom AI Tools" },
  { name: "Review Lab", href: "/review", desc: "Ethics & Bias Check" },
];

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const { isHidden, setIsHidden, isMobile, setIsOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [utilities, setUtilities] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    async function fetchUtils() {
      const { data } = await supabase.from('utilities').select('*');
      setUtilities(data || []);
    }
    fetchUtils();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const filteredQuickTools = quickTools.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUtilities = utilities.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(u => ({
    name: u.name,
    href: "/builder",
    desc: u.description || "Custom Utility"
  }));

  const allResults = [...filteredQuickTools, ...filteredUtilities].slice(0, 6);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-1 items-center gap-4 md:gap-8">
          {isHidden && !isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsHidden(false)} className="rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="relative w-full max-w-[400px] hidden md:flex">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search tools, projects, and assets..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200) }
              className="pl-9 bg-muted/50 border-none h-10 rounded-full focus-visible:ring-1 focus-visible:ring-primary/50"
            />
            
            {showResults && (
              <div className="absolute top-12 left-0 w-full bg-card border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Quick Results
                  </div>
                  {allResults.length > 0 ? (
                    <div className="space-y-1">
                      {allResults.map(tool => (
                        <Link 
                          key={tool.name} 
                          href={tool.href}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group"
                        >
                          <div>
                            <p className="text-sm font-bold">{tool.name}</p>
                            <p className="text-[10px] text-muted-foreground">{tool.desc}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground italic">
                    No matching tools found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background" />
            </Button>

            <ThemeToggle />

            <Button className="hidden sm:flex rounded-full gap-2 px-6 h-10 shadow-lg shadow-primary/20" asChild>
            <Link href="/creator">
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-muted/50 p-0 overflow-hidden ring-offset-2 hover:ring-2 hover:ring-primary/20 transition-all">
                  <User className="h-5 w-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email?.split('@')[0] || "Campus User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "Not signed in"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/settings">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

        </div>
      </div>
    </header>
  );
}
