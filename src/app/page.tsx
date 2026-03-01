"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Shield, 
  BarChart3,
  PenTool,
  Palette,
  Wrench,
  ShieldCheck,
  Star,
  Quote,
  GraduationCap,
  Box,
  Layers,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

function Floating3DElement({ children, className, delay = 0, duration = 6, rotate = true }: { children: React.ReactNode, className?: string, delay?: number, duration?: number, rotate?: boolean }) {
  return (
    <motion.div
      initial={{ y: 0, rotateX: 0, rotateY: 0 }}
      animate={{ 
        y: [0, -20, 0],
        rotateX: rotate ? [0, 10, -10, 0] : 0,
        rotateY: rotate ? [0, -10, 10, 0] : 0,
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      className={cn("absolute pointer-events-none perspective-[1000px]", className)}
    >
      <div className="transform-3d">
        {children}
      </div>
    </motion.div>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
      }}
      className={cn("perspective-[1000px]", className)}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const heroX = useTransform(mouseX, [-0.5, 0.5], [20, -20]);
  const heroY = useTransform(mouseY, [-0.5, 0.5], [20, -20]);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Campus Creative
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center bg-muted/40 px-6 py-2 rounded-full border border-border/50">
            <Link href="#features" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#solutions" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
            <Link href="#impact" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Impact</Link>
            <Link href="#pricing" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Button variant="ghost" className="hidden sm:flex font-bold hover:bg-primary/10 hover:text-primary transition-all px-6 rounded-full" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="rounded-full px-6 font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40 border-b min-h-[90vh] flex items-center justify-center perspective-[2000px]">
          {/* 3D Background Grid */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
                 style={{ transform: "perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)" }} />
          </div>

          {/* Floating 3D Elements */}
          <Floating3DElement className="top-1/4 left-10 md:left-20" delay={0}>
             <div className="h-16 w-16 md:h-24 md:w-24 rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center shadow-2xl rotate-12">
                <Box className="h-8 w-8 md:h-12 md:w-12 text-primary" />
             </div>
          </Floating3DElement>

          <Floating3DElement className="bottom-1/4 right-10 md:right-20" delay={2} duration={8}>
             <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-secondary/20 backdrop-blur-xl border border-secondary/30 flex items-center justify-center shadow-2xl -rotate-12">
                <Layers className="h-6 w-6 md:h-10 md:w-10 text-secondary-foreground" />
             </div>
          </Floating3DElement>

          <Floating3DElement className="top-1/3 right-1/4" delay={1} duration={7}>
             <div className="h-10 w-10 md:h-16 md:w-16 rounded-xl bg-orange-500/10 backdrop-blur-xl border border-orange-500/20 flex items-center justify-center shadow-2xl rotate-45">
                <Cpu className="h-5 w-5 md:h-8 md:w-8 text-orange-500" />
             </div>
          </Floating3DElement>

          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] left-[0%] w-[40rem] h-[40rem] bg-secondary/15 rounded-full blur-[100px]" />
          </div>

          <motion.div 
            style={{ x: heroX, y: heroY }}
            className="container relative z-10 mx-auto px-4 md:px-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by 5,000+ Students
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black tracking-tighter max-w-5xl mx-auto mb-8 leading-[0.95] lg:leading-[1]"
            >
              Empower Your <span className="text-primary italic relative inline-block">
                Creative Voice
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
            >
              Access high-speed generative AI tools tailored for student leaders, researchers, and campus innovators. 
              Built for the high-speed campus life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <Button size="lg" className="rounded-full px-10 h-16 text-xl font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all" asChild>
                <Link href="/login">
                  Start Creating Now <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-xl font-bold border-2 hover:bg-muted/50 transition-all" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 text-center md:text-left">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9]">
                  Tools built for <span className="text-primary italic">Campus Leaders.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium">
                  We've consolidated the world's most powerful AI models into a single dashboard tailored for student life.
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2"><ArrowRight className="rotate-180" /></Button>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2"><ArrowRight /></Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Creator Hub",
                  description: "Draft emails, club captions, and articles in seconds with persona-based AI.",
                  icon: PenTool,
                  color: "bg-blue-600",
                  tag: "Content"
                },
                {
                  title: "Asset Studio",
                  description: "Generate professional posters and event visuals with DALL-E 3 & Flux.",
                  icon: Palette,
                  color: "bg-purple-600",
                  tag: "Design"
                },
                {
                  title: "Utility Builder",
                  description: "Create no-code AI workflows for research, study guides, or club management.",
                  icon: Wrench,
                  color: "bg-orange-600",
                  tag: "Dev"
                },
                {
                  title: "Review Lab",
                  description: "Ethical AI checks for bias and quality control before you publish campus-wide.",
                  icon: ShieldCheck,
                  color: "bg-emerald-600",
                  tag: "Ethics"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TiltCard>
                    <Card className="group border-2 border-border/50 shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-500 h-full flex flex-col overflow-hidden bg-background">
                      <CardContent className="pt-8 p-8 flex flex-col flex-1 relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                            <feature.icon className="h-7 w-7" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full border">
                            {feature.tag}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                        <p className="text-muted-foreground font-medium leading-relaxed mb-8 flex-1">
                          {feature.description}
                        </p>
                        <Link href="/login" className="flex items-center gap-2 text-sm font-black text-primary group/link">
                          Try this tool <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </CardContent>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0" />
                    </Card>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-32">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">Voices from the <span className="text-primary italic">Quad.</span></h2>
              <p className="text-xl text-muted-foreground font-medium">Join 5,000+ student leaders already scaling their impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Campus Creative changed how our Marketing Club works. We produce 10x more content with half the effort.",
                  author: "Elena Rodriguez",
                  role: "Marketing Club President",
                  avatar: "ER"
                },
                {
                  quote: "The Review Lab is a lifesaver. It ensures our research posters are accurate and inclusive.",
                  author: "David Chen",
                  role: "Research Assistant",
                  avatar: "DC"
                },
                {
                  quote: "Finally, an AI tool that actually understands what a college student needs, not just generic business tools.",
                  author: "Sarah Jenkins",
                  role: "Student Gov Rep",
                  avatar: "SJ"
                }
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TiltCard>
                    <div className="p-8 rounded-[2rem] bg-muted/20 border-2 border-dashed flex flex-col gap-6 relative h-full group hover:bg-background hover:shadow-2xl transition-all duration-500">
                      <Quote className="h-10 w-10 text-primary/20 absolute top-8 right-8" />
                      <div className="flex gap-1 text-primary">
                        {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                      </div>
                      <p className="text-lg font-bold italic leading-relaxed flex-1">"{t.quote}"</p>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="font-black text-sm">{t.author}</p>
                          <p className="text-xs text-muted-foreground font-bold">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[3rem] bg-primary p-12 md:p-24 text-center text-primary-foreground shadow-2xl">
               <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                    Ready to start your <span className="opacity-60 italic">AI journey?</span>
                  </h2>
                  <p className="text-xl md:text-2xl font-medium text-primary-foreground/80">
                    Sign up with your campus email today and get immediate access to all tools.
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <Button size="lg" variant="secondary" className="rounded-full px-12 h-18 text-2xl font-black text-primary hover:scale-[1.05] transition-transform" asChild>
                      <Link href="/login">Get Started Now</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-12 h-18 text-2xl font-black bg-white/10 border-white/20 hover:bg-white/20 transition-all" asChild>
                      <Link href="#impact">See Impact</Link>
                    </Button>
                  </div>
               </div>
               <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 bg-white/10 rounded-full blur-[100px]" />
               <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-96 w-96 bg-black/10 rounded-full blur-[100px]" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-2xl font-black tracking-tighter">Campus Creative</span>
              </Link>
              <p className="text-muted-foreground font-medium max-w-xs text-lg">
                Democratizing high-end creative tools for every student on campus.
              </p>
              <div className="flex gap-4">
                 {[Globe, Users, Shield, Zap].map((Icon, i) => (
                   <div key={i} className="h-10 w-10 rounded-full border flex items-center justify-center text-muted-foreground hover:text-primary transition-all cursor-pointer">
                      <Icon className="h-5 w-5" />
                   </div>
                 ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-widest text-primary">Platform</h4>
              <ul className="space-y-4">
                {['Features', 'Solutions', 'Asset Studio', 'Review Lab'].map(item => (
                  <li key={item}><Link href="#" className="text-muted-foreground font-bold hover:text-foreground transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-widest text-primary">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Contact', 'Terms', 'Privacy'].map(item => (
                  <li key={item}><Link href="#" className="text-muted-foreground font-bold hover:text-foreground transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground font-bold">© 2026 Campus Creative Suite. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="text-sm font-black text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
              <Link href="#" className="text-sm font-black text-muted-foreground hover:text-primary transition-colors">API Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
