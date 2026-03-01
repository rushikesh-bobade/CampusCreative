"use client";

import { 
  Crown, 
  Sparkles, 
  Users, 
  LifeBuoy, 
  Zap, 
  CheckCircle2, 
  CreditCard,
  ArrowLeft,
  ShieldCheck,
  Globe,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SubscriptionPage() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col gap-4">
        <Link href="/settings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plan</h1>
          <p className="text-muted-foreground">Manage your campus workspace limits and features.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Crown className="h-32 w-32 text-primary rotate-12" />
            </div>
            
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground uppercase tracking-widest shadow-lg shadow-primary/20">Active Plan</div>
              </div>
              <CardTitle className="text-4xl font-extrabold flex items-center gap-3">
                University Pro Plan
              </CardTitle>
              <CardDescription className="text-lg max-w-xl mt-2">
                The ultimate creative suite for university clubs, events, and student organizations.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    title: "Unlimited AI Generations", 
                    desc: "Full access to text, image, and code models with no monthly caps.",
                    icon: Sparkles
                  },
                  { 
                    title: "Multi-Team Collaboration", 
                    desc: "Create and manage up to 50 active teams across your campus.",
                    icon: Users
                  },
                  { 
                    title: "Priority 24/7 Support", 
                    desc: "Dedicated assistance for major university fests and peak production times.",
                    icon: LifeBuoy
                  },
                  { 
                    title: "Custom AI Utilities", 
                    desc: "Build and deploy private AI tools tailored to your specific club needs.",
                    icon: Zap
                  },
                  { 
                    title: "Responsible AI Shield", 
                    desc: "Automatic bias detection and safety filtering for all campus content.",
                    icon: ShieldCheck
                  },
                  { 
                    title: "Campus White-labeling", 
                    desc: "Personalized workspace with your university's branding and domains.",
                    icon: Globe
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-background/60 border border-muted/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 border-t flex flex-col sm:flex-row items-center justify-between p-8 gap-6">
               <div className="flex flex-col gap-1 text-center sm:text-left">
                 <div className="flex items-center gap-2 justify-center sm:justify-start">
                   <CreditCard className="h-4 w-4 text-primary" />
                   <span className="text-sm font-bold">Billed Annually</span>
                 </div>
                 <p className="text-2xl font-black">$0 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Education Grant Coverage: 100%</p>
               </div>
               <div className="flex gap-4">
                 <Button variant="outline" className="rounded-xl font-bold">Download Invoice</Button>
                 <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">Renew Early</Button>
               </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Upgrade / Next Level Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="border-muted/50 bg-muted/20">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <Rocket className="h-5 w-5 text-primary" /> Future Expansion
               </CardTitle>
             </CardHeader>
             <CardContent className="text-sm text-muted-foreground">
               Your campus is currently utilizing the full potential of our Creative Suite. 
               Advanced enterprise features like "Department Isolation" and "Centralized Billing" 
               are currently in beta for your institution.
             </CardContent>
           </Card>

           <Card className="border-muted/50">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <CheckCircle2 className="h-5 w-5 text-green-500" /> Compliance Status
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-green-500" />
                   <span className="text-xs font-medium">FERPA & GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-green-500" />
                   <span className="text-xs font-medium">SOC2 Type II Certified AI Nodes</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-green-500" />
                   <span className="text-xs font-medium">Campus-wide Data Privacy Agreement</span>
                </div>
             </CardContent>
           </Card>
        </section>
      </div>
    </div>
  );
}
