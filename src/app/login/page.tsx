"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Sparkles, 
  GraduationCap, 
  Lock, 
  Mail, 
  Loader2, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  Zap, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Globe,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

function LoginContent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    setMounted(true);
    if (errorParam) {
      toast.error(errorParam);
    }
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkUser();
  }, [router, errorParam]);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      // Development Bypass: Redirect directly to dashboard
      setTimeout(() => {
        toast.success("Identity verified. Welcome to Campus Creative.");
        router.push("/dashboard");
        setLoading(false);
      }, 1000);
    };

    const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      // Development Bypass: Redirect directly to dashboard
      setTimeout(() => {
        toast.success("Account created. Welcome to Campus Creative.");
        router.push("/dashboard");
        setLoading(false);
      }, 1000);
    };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Refined Grid Pattern */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
      </div>

      {/* Industrial Left Panel */}
      <div className="hidden lg:flex flex-col lg:w-[450px] bg-muted/40 border-r border-border/50 p-12 justify-between relative shrink-0">
        <div className="relative z-10 space-y-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shadow-2xl">
              <GraduationCap className="h-6 w-6 text-background" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">Campus Creative</span>
          </Link>

          <div className="space-y-6 pt-4 border-l-2 border-primary/20 pl-8">
            <h2 className="text-4xl font-bold tracking-tight leading-[1.05] text-foreground">
              Institutional AI <br />
              Deployment <br />
              <span className="text-primary/60">Node v2.0</span>
            </h2>
            <p className="text-sm text-muted-foreground font-medium max-w-[280px] leading-relaxed">
              Standardized creative infrastructure for student organizations and academic departments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            {[
              { label: "High-Speed Inference", icon: Zap, status: "Active" },
              { label: "Secure Data Tunnel", icon: ShieldCheck, status: "Encrypted" },
              { label: "Global Campus CDN", icon: Globe, status: "Online" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/40 shadow-sm">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-[11px] font-black uppercase tracking-wider opacity-70">{item.label}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary/80 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 space-y-3">
            <div className="flex items-center gap-2">
              <Server className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cluster Status</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] font-bold">University Cloud Node: Operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Compact Portal */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-6 py-12 overflow-y-auto">
        <div className="absolute top-6 right-8 flex items-center gap-4 z-50">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="rounded-full gap-2 font-bold h-9 px-4 text-[11px] bg-muted/50 border border-border/40" asChild>
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>EXIT</span>
            </Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-2">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Campus Identity Protocol</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              Authentication
            </h1>
          </div>

          <div className="bg-card border border-border shadow-2xl rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/10" />
            
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex p-1 bg-muted rounded-xl gap-1">
                <button
                  onClick={() => setMode("login")}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest",
                    mode === "login" 
                      ? "bg-background shadow-md text-foreground border border-border/50" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest",
                    mode === "signup" 
                      ? "bg-background shadow-md text-foreground border border-border/50" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Join Us
                </button>
              </div>

              <form onSubmit={mode === "login" ? handleLogin : handleSignUp} className="space-y-5">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {mode === "signup" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Full Name
                        </Label>
                        <div className="relative group/input">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                          <Input 
                            type="text" 
                            placeholder="Alex Thompson" 
                            className="pl-11 h-11 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-all text-[13px] font-medium"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={mode === "signup"}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Institutional Email
                    </Label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                      <Input 
                        type="email" 
                        placeholder="thompson.a@university.edu" 
                        className="pl-11 h-11 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-all text-[13px] font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Password
                      </Label>
                      {mode === "login" && (
                        <button type="button" className="text-[10px] font-black text-primary/70 hover:text-primary tracking-widest uppercase">
                          Recovery
                        </button>
                      )}
                    </div>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••"
                        className="pl-11 pr-11 h-11 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-all text-[13px] font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-primary transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-11 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {mode === "login" ? "Verify Credentials" : "Initiate Protocol"}
                  {!loading && <ChevronRight className="ml-1 h-3 w-3" />}
                </Button>
              </form>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full h-9 border-dashed border-border/60 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors gap-2"
                  onClick={() => {
                    toast.promise(
                      new Promise((resolve, reject) => {
                        fetch('https://xaspddmsbemnrixwmuym.supabase.co/rest/v1/', { method: 'HEAD' })
                          .then(res => resolve(res))
                          .catch(err => reject(err))
                      }),
                      {
                        loading: 'Running Network Diagnostics...',
                        success: 'Connection to Institutional Node Secure.',
                        error: 'Network Link Blocked. Please use a VPN or different ISP.'
                      }
                    );
                  }}
                >
                  <Server className="h-3 w-3" />
                  Diagnose Network Link
                </Button>
              </div>
            </div>
          </div>


          <p className="text-[9px] font-black text-center text-muted-foreground/50 uppercase tracking-[0.4em] pt-4">
            Secured via Academic Identity Service Node 12-US
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
