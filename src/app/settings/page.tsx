"use client";

import { useState, useEffect, Suspense } from "react";
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Globe, 
  Save,
  User,
  Zap,
  CheckCircle2,
  CreditCard,
  Crown,
  Sparkles,
  LifeBuoy,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function SettingsContent() {
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["account", "subscription", "appearance", "notifications", "privacy"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [campusName, setCampusName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    generations: true,
    teams: true,
    updates: false
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    shareData: true
  });

    useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCampusName(data[0].campus_name || "");
          if (data[0].theme) setTheme(data[0].theme);
          if (data[0].notifications_enabled !== undefined) {
            setNotifications(prev => ({ ...prev, generations: data[0].notifications_enabled }));
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [setTheme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          campus_name: campusName,
          theme: theme,
          notifications_enabled: notifications.generations
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <nav className="flex flex-col space-y-1">
            <Button 
              variant="ghost" 
              className={cn("justify-start gap-3 rounded-xl", activeTab === "account" && "bg-primary/10 text-primary font-bold")}
              onClick={() => setActiveTab("account")}
            >
              <User className="h-4 w-4" /> Account
            </Button>
            <Button 
              variant="ghost" 
              className={cn("justify-start gap-3 rounded-xl", activeTab === "subscription" && "bg-primary/10 text-primary font-bold")}
              onClick={() => setActiveTab("subscription")}
            >
              <Crown className="h-4 w-4" /> Subscription
            </Button>
            <Button 
              variant="ghost" 
              className={cn("justify-start gap-3 rounded-xl", activeTab === "appearance" && "bg-primary/10 text-primary font-bold")}
              onClick={() => setActiveTab("appearance")}
            >
              <Globe className="h-4 w-4" /> Appearance
            </Button>
            <Button 
              variant="ghost" 
              className={cn("justify-start gap-3 rounded-xl", activeTab === "notifications" && "bg-primary/10 text-primary font-bold")}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="h-4 w-4" /> Notifications
            </Button>
            <Button 
              variant="ghost" 
              className={cn("justify-start gap-3 rounded-xl", activeTab === "privacy" && "bg-primary/10 text-primary font-bold")}
              onClick={() => setActiveTab("privacy")}
            >
              <Shield className="h-4 w-4" /> Privacy & Security
            </Button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === "account" && (
            <Card className="border-muted/50">
              <CardHeader>
                <CardTitle className="text-xl">Campus Profile</CardTitle>
                <CardDescription>Personalize your workspace for your university.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="campus">University / Campus Name</Label>
                  <Input 
                    id="campus" 
                    placeholder="e.g. Stanford University" 
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    disabled={loading}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Crown className="h-24 w-24 text-primary" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2 py-1 rounded bg-primary text-[10px] font-bold text-primary-foreground uppercase tracking-widest">Active Plan</div>
                  </div>
                  <CardTitle className="text-3xl font-bold flex items-center gap-3">
                    University Pro Plan
                  </CardTitle>
                  <CardDescription className="text-base">Everything needed for campus-wide creation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-background/50 border border-muted/50">
                       <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                       <div>
                         <p className="font-bold text-sm">Unlimited Generations</p>
                         <p className="text-xs text-muted-foreground">No limits on AI text, image, or code creation.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-background/50 border border-muted/50">
                       <Users className="h-5 w-5 text-primary mt-0.5" />
                       <div>
                         <p className="font-bold text-sm">Multi-Team Support</p>
                         <p className="text-xs text-muted-foreground">Collaborate with up to 50 active campus teams.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-background/50 border border-muted/50">
                       <LifeBuoy className="h-5 w-5 text-primary mt-0.5" />
                       <div>
                         <p className="font-bold text-sm">Priority Support</p>
                         <p className="text-xs text-muted-foreground">Fast-track assistance for fests and events.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-background/50 border border-muted/50">
                       <Zap className="h-5 w-5 text-primary mt-0.5" />
                       <div>
                         <p className="font-bold text-sm">Advanced API Access</p>
                         <p className="text-xs text-muted-foreground">Build and deploy custom AI utilities globally.</p>
                       </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t flex items-center justify-between p-6">
                   <div className="flex items-center gap-2">
                     <CreditCard className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium">Billed annually at $0 (Education Grant)</span>
                   </div>
                   <Button variant="outline" className="rounded-xl border-primary/20 text-primary font-bold" asChild>
                      <Link href="/subscription">Manage Billing</Link>
                   </Button>
                </CardFooter>
              </Card>

              <Card className="border-muted/50">
                <CardHeader>
                   <CardTitle className="text-xl">Plan Benefits Recap</CardTitle>
                   <CardDescription>Why your campus chose Pro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm">High-speed GenAI nodes (Gemini 1.5 Flash)</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Responsible AI scanning in real-time</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Custom domain white-labeling for your university</span>
                   </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "appearance" && (
            <Card className="border-muted/50">
              <CardHeader>
                <CardTitle className="text-xl">Appearance</CardTitle>
                <CardDescription>Customize how the platform looks for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border bg-muted/30">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <div>
                      <p className="font-medium">Theme Mode</p>
                      <p className="text-xs text-muted-foreground">Toggle between light and dark mode</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <Button 
                      variant={theme === 'light' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTheme('light')}
                      className="rounded-xl"
                    >
                      Light
                    </Button>
                    <Button 
                      variant={theme === 'dark' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTheme('dark')}
                      className="rounded-xl"
                    >
                      Dark
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="border-muted/50">
              <CardHeader>
                <CardTitle className="text-xl">Notifications</CardTitle>
                <CardDescription>Stay updated on your team's creative progress.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'generations', label: 'AI Generation Alerts', desc: 'Notify when content generation is complete' },
                  { key: 'teams', label: 'Team Activity', desc: 'Notify when a teammate invites you or creates content' },
                  { key: 'updates', label: 'Product Updates', desc: 'Receive info about new AI features' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-base">{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                     </div>
                     <Button 
                      variant={notifications[item.key as keyof typeof notifications] ? "default" : "outline"}
                      size="sm"
                      className="rounded-full px-6"
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                     >
                       {notifications[item.key as keyof typeof notifications] ? "Enabled" : "Disabled"}
                     </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card className="border-muted/50">
              <CardHeader>
                <CardTitle className="text-xl">Privacy & Security</CardTitle>
                <CardDescription>Control your data and profile visibility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-base">Public Profile</Label>
                        <p className="text-xs text-muted-foreground">Let others on campus find you by name</p>
                     </div>
                     <Button 
                      variant={privacy.publicProfile ? "default" : "outline"}
                      size="sm"
                      className="rounded-full px-6"
                      onClick={() => setPrivacy(prev => ({ ...prev, publicProfile: !prev.publicProfile }))}
                     >
                       {privacy.publicProfile ? "Public" : "Private"}
                     </Button>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-base">Usage Sharing</Label>
                        <p className="text-xs text-muted-foreground">Share anonymous usage data to improve AI models</p>
                     </div>
                     <Button 
                      variant={privacy.shareData ? "default" : "outline"}
                      size="sm"
                      className="rounded-full px-6"
                      onClick={() => setPrivacy(prev => ({ ...prev, shareData: !prev.shareData }))}
                     >
                       {privacy.shareData ? "Sharing" : "Opt-out"}
                     </Button>
                  </div>
                  <div className="pt-4 border-t">
                     <Button variant="destructive" className="w-full rounded-xl">Deactivate Account</Button>
                  </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end pt-6 border-t">
            <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2 px-8 shadow-lg shadow-primary/20">
              <Save className="h-4 w-4" /> {saving ? "Saving All Settings..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
