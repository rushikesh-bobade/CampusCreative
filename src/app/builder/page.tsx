"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Plus, 
  Play, 
  Save, 
  Trash2, 
  Settings2, 
  Sparkles,
  Zap,
  Layout,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  Database,
  Cloud,
  Code2,
  X,
  Loader2,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Utility {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  placeholders: string[];
}

export default function UtilityBuilder() {
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [runningUtility, setRunningUtility] = useState<Utility | null>(null);
  const [runValues, setRunValues] = useState<Record<string, string>>({});
  const [runResult, setRunResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  useEffect(() => {
    fetchUtilities();
  }, []);

    const fetchUtilities = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/utilities');
        const data = await response.json();
        setUtilities(data || []);
      } catch (e) {
        toast.error("Failed to fetch utilities");
      }
      setLoading(false);
    };

    const getPlaceholders = (template: string) => {
      const regex = /\[(.*?)\]/g;
      const matches = [];
      let match;
      while ((match = regex.exec(template)) !== null) {
        matches.push(match[1]);
      }
      return Array.from(new Set(matches));
    };

    const saveUtility = async () => {
      if (!newName || !newPrompt) return;
      
      const placeholders = getPlaceholders(newPrompt);
      
      try {
        const response = await fetch('/api/utilities', {
          method: 'POST',
          body: JSON.stringify({
            name: newName,
            description: newDesc,
            template: newPrompt,
            placeholders: placeholders,
            category: newCategory
          }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        toast.success("Utility saved successfully!");
        fetchUtilities();
        setIsCreating(false);
        setNewName("");
        setNewDesc("");
        setNewPrompt("");
      } catch (e: any) {
        toast.error(`Failed to save utility: ${e.message}`);
      }
    };

    const deleteUtility = async (id: string) => {
      try {
        const response = await fetch('/api/utilities', {
          method: 'POST',
          body: JSON.stringify({ action: 'delete', id }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        toast.success("Utility deleted");
        fetchUtilities();
      } catch (e: any) {
        toast.error(`Failed to delete utility: ${e.message}`);
      }
    };

  const handleRun = async () => {
    if (!runningUtility) return;
    setIsRunning(true);
    setRunResult(null);
    try {
      const response = await fetch("/api/utility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: runningUtility.template,
          values: runValues
        })
      });
      const data = await response.json();
      setRunResult(data.result);
    } catch (error) {
      toast.error("Failed to execute utility");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Utility Builder</h1>
          <p className="text-muted-foreground">Assemble your own low-code AI tools for specific campus needs.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="rounded-full gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Create Utility
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Creation Dialog */}
        <AnimatePresence>
          {isCreating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="lg:col-span-12"
            >
              <Card className="border-primary/20 bg-primary/5 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>New AI Utility</CardTitle>
                    <CardDescription>Define how your custom tool should behave.</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Utility Name</Label>
                      <Input 
                        placeholder="e.g. Budget Estimator" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Brief Description</Label>
                      <Input 
                        placeholder="What does this tool do?" 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input 
                        placeholder="e.g. Finance, Academic, Event" 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>System Prompt Template</Label>
                      <Textarea 
                        placeholder="Describe the AI's role and use [PLACEHOLDERS] for user inputs..." 
                        value={newPrompt}
                        onChange={(e) => setNewPrompt(e.target.value)}
                        className="min-h-[150px] bg-background font-mono text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                       <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                       <Button onClick={saveUtility} className="gap-2">
                          <Save className="h-4 w-4" /> Save Utility
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Utilities List */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center p-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {utilities.map((util, i) => (
                <motion.div
                  key={util.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full group hover:border-primary/50 transition-all border-muted/50">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                         <div className="px-2 py-1 rounded bg-primary/10 text-[10px] font-bold text-primary uppercase">
                            {util.category || 'General'}
                         </div>
                         <Button variant="ghost" size="icon" onClick={() => deleteUtility(util.id)} className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                      <CardTitle className="text-lg">{util.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{util.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                        onClick={() => {
                          setRunningUtility(util);
                          setRunValues({});
                          setRunResult(null);
                        }}
                      >
                        <Play className="h-3 w-3" /> Run Utility
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
              {utilities.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl opacity-40">
                   <Wrench className="h-12 w-12 mb-4" />
                   <p className="font-bold">No custom utilities built yet.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* sidebar Info */}
        <aside className="lg:col-span-4 space-y-6">
           <Card className="bg-muted/30 border-none shadow-none">
              <CardHeader>
                 <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                    <Cloud className="h-4 w-4" /> Cloud Deployment
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-xs leading-relaxed">
                    Once saved, your utility is automatically deployed as a private API endpoint for your team.
                 </p>
                 <div className="p-3 bg-card border rounded-xl flex items-center justify-between">
                    <span className="text-[10px] font-mono opacity-60">/api/v1/u/custom</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="h-4 w-4" /></Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-primary/5 border-none shadow-none">
              <CardHeader>
                 <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-primary">
                    <Code2 className="h-4 w-4" /> Prompt Tips
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="flex gap-3 text-xs">
                    <div className="h-4 w-4 rounded-full bg-primary/20 shrink-0 flex items-center justify-center text-[10px] font-bold">1</div>
                    <p>Use [BRACKETS] to define variable fields for the user to fill.</p>
                 </div>
                 <div className="flex gap-3 text-xs">
                    <div className="h-4 w-4 rounded-full bg-primary/20 shrink-0 flex items-center justify-center text-[10px] font-bold">2</div>
                    <p>Be specific about the tone (Formal, Casual, Enthusiastic).</p>
                 </div>
                 <div className="flex gap-3 text-xs">
                    <div className="h-4 w-4 rounded-full bg-primary/20 shrink-0 flex items-center justify-center text-[10px] font-bold">3</div>
                    <p>Define the output format (Markdown, JSON, or List).</p>
                 </div>
              </CardContent>
           </Card>
        </aside>
      </div>

      {/* Running Utility Modal */}
      <AnimatePresence>
        {runningUtility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl"
            >
              <Card className="shadow-2xl border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      {runningUtility.name}
                    </CardTitle>
                    <CardDescription>{runningUtility.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setRunningUtility(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.isArray(runningUtility.placeholders) && runningUtility.placeholders.map(placeholder => (
                          <div key={placeholder} className="space-y-2">
                            <Label className="capitalize">{placeholder.replace(/_/g, " ")}</Label>
                            <Input 
                              placeholder={`Enter ${placeholder}...`}
                              value={runValues[placeholder] || ""}
                              onChange={(e) => setRunValues(prev => ({ ...prev, [placeholder]: e.target.value }))}
                            />
                          </div>
                        ))}
                      </div>

                    {runResult && (
                      <div className="p-4 bg-muted rounded-xl space-y-2 max-h-[300px] overflow-y-auto">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Result</Label>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{runResult}</p>
                      </div>
                    )}

                    <Button 
                      className="w-full gap-2 h-12 shadow-lg shadow-primary/20" 
                      onClick={handleRun}
                      disabled={isRunning || (Array.isArray(runningUtility.placeholders) && runningUtility.placeholders.some(p => !runValues[p]))}
                    >
                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    {isRunning ? "Running Utility..." : "Execute Utility"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
