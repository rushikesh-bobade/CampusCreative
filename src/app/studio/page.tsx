"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Layers, 
  Maximize, 
  Download, 
  Share2, 
  ArrowLeft,
  Sparkles,
  Zap,
  Layout,
  ImageIcon,
  Type,
  Video,
  Play,
  X,
  Loader2,
  Check,
  Copy,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DesignConcept {
  id: string;
  title: string;
  description: string;
  prompt: string;
  palette: { name: string; hex: string }[];
  typography: { heading: string; body: string };
  created_at: string;
}

export default function AssetStudio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [design, setDesign] = useState<{
    imagePrompt: string;
    colors: { name: string; hex: string }[];
    typography: { heading: string; body: string };
    layout: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [concepts, setConcepts] = useState<DesignConcept[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConcepts();
  }, []);

    const fetchConcepts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/studio');
        const data = await response.json();
        setConcepts(data || []);
      } catch (e) {
        toast.error("Failed to fetch concepts");
      }
      setLoading(false);
    };

    const handleGenerate = async () => {
      if (!prompt) return;
      setIsGenerating(true);
      setDesign(null);
      try {
        const response = await fetch("/api/asset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, category: "poster" })
        });
        const data = await response.json();
        setDesign(data);
        
        // Save to Supabase automatically via proxy
        try {
          await fetch('/api/studio', {
            method: 'POST',
            body: JSON.stringify({
              title: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
              description: prompt,
              prompt: data.imagePrompt,
              palette: data.colors,
              typography: data.typography,
              layout_advice: data.layout
            }),
            headers: { 'Content-Type': 'application/json' }
          });
          fetchConcepts();
        } catch (e) {
          console.error("Failed to save concept:", e);
        }
      } catch (error) {
        toast.error("Failed to generate design");
      } finally {
        setIsGenerating(false);
      }
    };

    const deleteConcept = async (id: string) => {
      try {
        const response = await fetch('/api/studio', {
          method: 'POST',
          body: JSON.stringify({ action: 'delete', id }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        toast.success("Concept deleted");
        fetchConcepts();
      } catch (e: any) {
        toast.error(`Failed to delete concept: ${e.message}`);
      }
    };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Asset Studio</h1>
          <p className="text-muted-foreground">Design and export visual assets for your campus events with AI assistance.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="rounded-full gap-2" onClick={() => setShowModal(true)}><Sparkles className="h-4 w-4" /> New AI Concept</Button>
           <Button className="rounded-full gap-2 shadow-lg shadow-primary/20"><Download className="h-4 w-4" /> Export Assets</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Editor Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
           <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Visual Layers
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                 {[ "Background", "Overlay Text", "Brand Logo", "Visual Decor" ].map(layer => (
                    <div key={layer} className="p-3 bg-muted/30 rounded-xl flex items-center justify-between border border-transparent hover:border-primary/20 cursor-pointer transition-all">
                       <span className="text-xs font-medium">{layer}</span>
                       <Zap className="h-3 w-3 text-primary opacity-40" />
                    </div>
                 ))}
                 <Button variant="ghost" className="w-full text-xs text-primary font-bold mt-4">+ Add New Layer</Button>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-primary" /> AI Designer
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 text-[10px] uppercase font-bold tracking-tighter" onClick={() => setShowModal(true)}><ImageIcon className="h-4 w-4" /> AI Fill</Button>
                    <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 text-[10px] uppercase font-bold tracking-tighter" onClick={() => setShowModal(true)}><Type className="h-4 w-4" /> Font Magic</Button>
                    <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 text-[10px] uppercase font-bold tracking-tighter" onClick={() => setShowModal(true)}><Layout className="h-4 w-4" /> Re-Layout</Button>
                    <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 text-[10px] uppercase font-bold tracking-tighter" onClick={() => setShowModal(true)}><Sparkles className="h-4 w-4" /> Enhance</Button>
                 </div>
              </CardContent>
           </Card>
        </aside>

        {/* Main Workspace */}
        <section className="lg:col-span-9 space-y-8">
           <div className="aspect-video w-full rounded-3xl bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
              <div className="relative z-10 space-y-6">
                 <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4 animate-pulse">
                    <Palette className="h-10 w-10" />
                 </div>
                 <h2 className="text-2xl font-bold tracking-tight">Active Design Workspace</h2>
                 <p className="text-muted-foreground max-w-sm mx-auto">
                    Select a concept below or use AI to generate a custom visual vision for your project.
                 </p>
                 <div className="flex gap-4 justify-center">
                    <Button className="rounded-full gap-2 px-8 shadow-lg shadow-primary/20" onClick={() => setShowModal(true)}><Sparkles className="h-4 w-4" /> AI Generate Poster</Button>
                    <Button variant="outline" className="rounded-full gap-2 px-8">Upload Media</Button>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="font-bold">Generated Concepts</h3>
                 <Button variant="link" className="text-xs font-bold text-primary uppercase">History</Button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center p-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {concepts.map(concept => (
                      <Card key={concept.id} className="group cursor-pointer hover:border-primary transition-all duration-300 relative">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConcept(concept.id);
                            }}
                         >
                            <Trash2 className="h-4 w-4" />
                         </Button>
                         <div 
                           className="aspect-[4/3] rounded-t-xl border-b flex items-center justify-center"
                           style={{ backgroundColor: concept.palette?.[0]?.hex || 'var(--muted)' }}
                         >
                           <Maximize className="h-8 w-8 text-white opacity-20" />
                         </div>
                         <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold truncate">{concept.title}</CardTitle>
                            <CardDescription className="text-xs line-clamp-1">{concept.description}</CardDescription>
                         </CardHeader>
                         <CardFooter className="p-4 pt-0">
                           <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-tighter h-8 gap-2" onClick={() => copyToClipboard(concept.prompt)}>
                             <Copy className="h-3 w-3" /> Copy Prompt
                           </Button>
                         </CardFooter>
                      </Card>
                   ))}
                   {concepts.length === 0 && (
                     <div className="col-span-3 flex flex-col items-center justify-center p-10 border border-dashed rounded-3xl opacity-40">
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <p className="text-sm font-bold">No concepts generated.</p>
                     </div>
                   )}
                </div>
              )}
           </div>
        </section>
      </div>

      {/* AI Design Modal */}
      <AnimatePresence>
        {showModal && (
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
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Design Assistant
                    </CardTitle>
                    <CardDescription>Describe the poster or visual you want to create.</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Your Vision</Label>
                    <Input 
                      placeholder="e.g. A neon-style hackathon poster with futuristic grid lines..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                  </div>

                  {design && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Image Prompt</Label>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(design.imagePrompt || "")} className="h-6 gap-1 text-[10px]">
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                          </Button>
                        </div>
                        <p className="text-xs leading-relaxed italic">"{design.imagePrompt || "No prompt available"}"</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Color Palette</Label>
                            <div className="flex gap-2">
                               {design.colors?.map((c, idx) => (
                                  <div key={`${c.hex}-${idx}`} className="group relative">
                                     <div className="h-8 w-8 rounded-full border border-white/10" style={{ backgroundColor: c.hex }} title={c.name} />
                                     <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] bg-background border px-1 rounded font-bold">{c.hex}</div>
                                  </div>
                               ))}
                               {(!design.colors || design.colors.length === 0) && <p className="text-[8px] text-muted-foreground">No palette found</p>}
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Typography</Label>
                            <div className="text-[10px] font-medium">
                               <p><span className="text-muted-foreground">H:</span> {design.typography?.heading || "Sans-serif"}</p>
                               <p><span className="text-muted-foreground">B:</span> {design.typography?.body || "Serif"}</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Layout Advice</Label>
                         <p className="text-xs text-muted-foreground">{design.layout || "Centric balance recommended."}</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full gap-2 h-12 shadow-lg shadow-primary/20" 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    {isGenerating ? "Generating Design..." : "Generate Design Concept"}
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
