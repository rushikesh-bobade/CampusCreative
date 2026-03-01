"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  PenTool, 
  Palette, 
  Wrench, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Zap,
  Layout,
  MessageSquare,
  FileCode,
  Image as ImageIcon,
  Video,
  Mic,
  ArrowUpRight,
  Activity,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useSearch } from "@/components/search-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const tools = [
  {
    title: "Creator Hub",
    description: "High-performance multimodal creativity suite for text, images, and marketing assets.",
    icon: PenTool,
    href: "/creator",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    features: ["Formal Emails", "Social Captions", "AI Image Prompts"]
  },
  {
    title: "Asset Studio",
    description: "Design and export professional visual assets for your campus events.",
    icon: Palette,
    href: "/studio",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    features: ["Poster Templates", "Brand Kits", "Video Briefs"]
  },
  {
    title: "Utility Builder",
    description: "Low-code workspace to assemble custom AI utilities for your specific research team.",
    icon: Wrench,
    href: "/builder",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    features: ["Custom Prompts", "Workflow Automation", "API Connect"]
  },
  {
    title: "Review Lab",
    description: "Responsible AI protocols for attribution, bias checks, and ethical filtering.",
    icon: ShieldCheck,
    href: "/review",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    features: ["Bias Detection", "Content Filtering", "Fact Checking"]
  }
];

const stats = [
  { label: "Generations", value: "12.4k", change: "+14%", icon: Zap },
  { label: "Active Clubs", value: "842", change: "+22%", icon: Users },
  { label: "Avg. Latency", value: "0.8s", change: "-12%", icon: Activity },
  { label: "Uptime", value: "99.9%", change: "Stable", icon: ShieldCheck },
];

export default function Dashboard() {
  const { searchQuery } = useSearch();
  const [utilities, setUtilities] = useState<any[]>([]);
  const [collabActivity, setCollabActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const utilsRes = await fetch('/api/utilities');
        const utilsData = await utilsRes.json();
        setUtilities((utilsData || []).slice(0, 4));

        const collabRes = await fetch('/api/collab', {
          method: 'POST',
          body: JSON.stringify({ action: 'fetchActivity' }),
          headers: { 'Content-Type': 'application/json' }
        });
        const collabData = await collabRes.json();
        if (collabData && !collabData.error) {
          setCollabActivity(collabData.slice(0, 3));
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUtilities = utilities.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-12 max-w-[1600px] mx-auto space-y-16 selection:bg-primary/20">
      {/* Dynamic Header Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-muted/50 via-background to-background border border-border/40 p-10 lg:p-20 shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              Intelligence Optimized for Campus
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                Open up <span className="text-primary italic">Creation</span> <br />
                for Every Student.
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                Empowering student organizations to draft, design, and innovate with high-speed AI. 
                Your unified workspace for campus leadership.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <Button size="lg" className="rounded-2xl gap-2 px-10 h-16 text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" asChild>
                <Link href="/creator">
                  Start Creating <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl gap-2 px-10 h-16 text-lg font-bold border-2 hover:bg-muted/50 transition-all" asChild>
                <Link href="/builder">
                  Explore Hub
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-6 relative">
            <div className="space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-card border shadow-xl flex flex-col items-center justify-center gap-4 hover:-translate-y-2 transition-transform">
                <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest opacity-60">Natural Language</span>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-card border shadow-xl flex flex-col items-center justify-center gap-4 translate-x-8 hover:-translate-y-2 transition-transform">
                <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest opacity-60">Visual Assets</span>
              </div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="p-8 rounded-[2.5rem] bg-card border shadow-xl flex flex-col items-center justify-center gap-4 hover:-translate-y-2 transition-transform">
                <div className="h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                  <FileCode className="h-8 w-8" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest opacity-60">Code & Logic</span>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-card border shadow-xl flex flex-col items-center justify-center gap-4 translate-x-8 hover:-translate-y-2 transition-transform">
                <div className="h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-inner">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest opacity-60">Ethical Check</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Quickview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="p-6 rounded-3xl border bg-card/50 hover:bg-card transition-colors flex flex-col gap-4 group"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-500' : stat.change === 'Stable' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Tools Section */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tighter">AI Workspace</h2>
            <p className="text-muted-foreground text-lg font-medium">Select a high-speed tool to accelerate your current project.</p>
          </div>
          <Button variant="ghost" className="gap-2 text-primary font-black uppercase tracking-widest text-xs h-12 hover:bg-primary/5 rounded-full px-6 border border-transparent hover:border-primary/20 transition-all" asChild>
            <Link href="/builder">
              Launch Utility Hub <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[320px] rounded-[2.5rem] border border-muted/50 bg-muted/20 animate-pulse" />
              ))}
            </>
          ) : (filteredTools.length > 0 || filteredUtilities.length > 0) ? (
            <>
              {filteredTools.map((tool, i) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={tool.href}>
                    <Card className={`h-full group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer overflow-hidden border-border/60 rounded-[2.5rem] bg-card/40 backdrop-blur-sm relative`}>
                      <CardHeader className="p-8 pb-4">
                        <div className={`h-14 w-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 shadow-inner border border-white/10 dark:border-black/10`}>
                          <tool.icon className={`h-7 w-7 ${tool.color}`} />
                        </div>
                        <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                        <CardDescription className="font-medium leading-relaxed mt-2">{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="px-8 pb-8">
                        <div className="flex flex-wrap gap-2 mt-4">
                          {tool.features.map(feature => (
                            <span key={feature} className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-muted border text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <ArrowRight className={`h-6 w-6 ${tool.color}`} />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </>
          ) : (
            <div className="col-span-full py-32 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed">
              <p className="text-xl font-bold text-muted-foreground uppercase tracking-widest">No matching tools detected.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Collaboration */}
      <section className="relative overflow-hidden rounded-[3.5rem] bg-muted/40 border-2 border-dashed border-border/60 p-10 lg:p-20 group">
        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="h-16 w-16 rounded-[2rem] bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
              <Users className="h-8 w-8" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">
                Co-produce <br />
                <span className="text-primary">Seamlessly.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                Collaboration is native to the flow. Multi-student generation, shared asset history, 
                and peer-review loops built for the campus.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-2xl h-14 px-8 font-black shadow-lg" asChild>
                <Link href="/collab">Manage Your Team</Link>
              </Button>
              <Button variant="ghost" className="gap-2 font-black text-xs uppercase tracking-[0.2em]" asChild>
                <Link href="/collab">
                  View shared logs <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border-4 border-background shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(255,255,255,0.05)] bg-card p-10">
            <div className="flex items-center justify-between mb-12">
              <div className="flex -space-x-4">
                {['JD', 'AL', 'SM', 'RK'].map((id, i) => (
                  <div key={i} className="h-12 w-12 rounded-full border-4 border-background bg-muted flex items-center justify-center text-xs font-black shadow-lg">
                    {id}
                  </div>
                ))}
                <div className="h-12 w-12 rounded-full border-4 border-background bg-primary flex items-center justify-center text-white text-xs font-black shadow-lg">
                  +18
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] border border-green-500/20">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live Sync Active
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { user: "Alex L.", action: "generated poster brand kit", time: "2s ago", type: "Visual" },
                { user: "Sarah M.", action: "saved research summary", time: "1m ago", type: "Text" },
                { user: "Jamie D.", action: "completed bias review", time: "5m ago", type: "Security" },
              ].map((act, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-border/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-[10px] font-black border">
                      {act.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-sm font-bold">
                      <span className="text-primary">{act.user}</span> {act.action}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">{act.time}</span>
                </div>
              ))}
            </div>

            <div className="absolute bottom-10 right-10">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary shadow-2xl shadow-primary/30 text-primary-foreground font-black text-xs uppercase tracking-widest">
                <Zap className="h-4 w-4 fill-current animate-bounce" />
                Next-Gen Sync
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Banner */}
      <section className="py-12 border-y flex flex-wrap justify-between items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
         {['Gemini 2.0', 'DALL-E 3', 'Stable Diffusion', 'Llama 3.1', 'GPT-4o'].map(ai => (
           <span key={ai} className="text-2xl font-black tracking-tighter opacity-40 hover:opacity-100 transition-opacity cursor-default">{ai}</span>
         ))}
      </section>
    </div>
  );
}
