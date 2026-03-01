"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mail, 
  Instagram, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Download,
  Share2,
  Sparkles,
  LayoutDashboard,
  Zap,
  Code,
  FileText,
  Users,
  Megaphone,
  ArrowLeft,
  History
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface GeneratedContent {
  permissionEmail?: string;
  instaCaption?: string;
  imagePrompt?: string;
  codeSnippet?: string;
  outline?: string;
  roadmap?: string;
}

export default function CreatorHub() {
  const [mode, setMode] = useState("event");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
      async function fetchHistory() {
        try {
          const response = await fetch('/api/generations');
          const data = await response.json();
          setHistory(data || []);
        } catch (e) {
          console.error("Failed to fetch history:", e);
        }
      }
      fetchHistory();
    }, []);

    const handleGenerate = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!title || !description || !audience) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            eventName: title, 
            theme: description, 
            targetAudience: audience,
            mode 
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate content");
        }

        const data = await response.json();
        setResult(data);
        
        // Save to Supabase History via proxy
        try {
          const saveResponse = await fetch('/api/generations', {
            method: 'POST',
            body: JSON.stringify({
              type: mode,
              content: {
                title,
                ...data
              }
            }),
            headers: { 'Content-Type': 'application/json' }
          });
          const savedGen = await saveResponse.json();
          
          if (savedGen && !savedGen.error) {
            setHistory(prev => [savedGen, ...prev].slice(0, 5));
            toast.success("Content generated and saved to history!");
          }
        } catch (e) {
          console.error("Failed to save generation:", e);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

  const downloadResults = () => {
    if (!result) return;
    const content = `
CAMPUS CREATIVE SUITE - PROJECT ASSETS
Project: ${title}
Mode: ${mode}

FORMAL EMAIL:
${result.permissionEmail || "N/A"}

INSTAGRAM CAPTION:
${result.instaCaption || "N/A"}

CONTENT OUTLINE:
${result.outline || "N/A"}

AI IMAGE PROMPT:
${result.imagePrompt || "N/A"}

TECHNICAL ROADMAP:
${result.roadmap || "N/A"}

CODE SNIPPET:
${result.codeSnippet || "N/A"}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_assets.txt`;
    a.click();
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Creator Hub</h1>
          <p className="text-muted-foreground">Draft, design, and publish multimodal content for your campus.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border">
           <Button 
            variant={mode === "event" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setMode("event")}
            className="rounded-lg gap-2"
           >
             <Megaphone className="h-4 w-4" /> Event
           </Button>
           <Button 
            variant={mode === "academic" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setMode("academic")}
            className="rounded-lg gap-2"
           >
             <FileText className="h-4 w-4" /> Academic
           </Button>
           <Button 
            variant={mode === "tech" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setMode("tech")}
            className="rounded-lg gap-2"
           >
             <Code className="h-4 w-4" /> Tech
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Side */}
        <section className="lg:col-span-5">
          <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Input Details
              </CardTitle>
              <CardDescription>
                {mode === "event" && "Describe your event vision and marketing goals."}
                {mode === "academic" && "Describe your course, research, or study material."}
                {mode === "tech" && "Describe the utility or project you're building."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {mode === "event" ? "Event Name" : mode === "academic" ? "Topic / Course" : "Project Name"}
                  </Label>
                  <Input
                    id="title"
                    placeholder={mode === "event" ? "e.g. InnovateX Hackathon" : "e.g. Advanced Quantum Physics"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background/50 border-muted-foreground/20 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Vision & Core Idea</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the purpose, goals, and key highlights..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] bg-background/50 border-muted-foreground/20 focus:border-primary resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="e.g. Undergraduate students, Faculty, or Tech enthusiasts"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="bg-background/50 border-muted-foreground/20 focus:border-primary"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold shadow-xl shadow-primary/20 transition-all"
                  disabled={isLoading || !title || !description || !audience}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Crafting Multimodal Content...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5 fill-current" />
                      Generate Suite
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Results Side */}
        <section className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center min-h-[500px] p-12 text-center rounded-3xl border-2 border-dashed bg-card/30 backdrop-blur-sm"
              >
                <div className="relative mb-8">
                  <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Generating Multimodal Assets</h3>
                <p className="text-muted-foreground max-w-sm">
                  Our AI is analyzing your vision to create tailored content across text, image, and code.
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center justify-center min-h-[500px] p-8 rounded-3xl border-2 border-destructive/50 bg-destructive/5 text-center"
              >
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">{error}</p>
                <Button variant="outline" onClick={() => handleGenerate()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                  <Tabs defaultValue="text" className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <TabsList className="grid grid-cols-4 w-full max-w-lg h-12 p-1 bg-muted/50">
                        <TabsTrigger value="text" className="rounded-md text-xs">Textual</TabsTrigger>
                        <TabsTrigger value="visual" className="rounded-md text-xs">Visual</TabsTrigger>
                        <TabsTrigger value="roadmap" className="rounded-md text-xs">Roadmap</TabsTrigger>
                        <TabsTrigger value="technical" className="rounded-md text-xs">Technical</TabsTrigger>
                      </TabsList>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          navigator.share?.({
                            title: `Creative Suite: ${title}`,
                            text: `Check out the AI-generated assets for ${title}!`,
                            url: window.location.href
                          }).catch(() => {
                            copyToClipboard(window.location.href, "share");
                          });
                        }} className="rounded-lg gap-2 h-10 px-4">
                          <Share2 className="h-4 w-4" /> {copiedSection === "share" ? "Link Copied" : "Share"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadResults} className="rounded-lg gap-2 h-10 px-4">
                          <Download className="h-4 w-4" /> Download All
                        </Button>
                      </div>
                    </div>


                  <TabsContent value="text" className="mt-6 space-y-6">
                    {result.permissionEmail && (
                      <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                          <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-500" />
                            <span className="font-semibold text-sm">Formal Outreach</span>
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => copyToClipboard(result.permissionEmail!, "email")}>
                            {copiedSection === "email" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <CardContent className="p-6">
                           <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed font-serif italic border-l-4 border-primary/20 pl-6 py-2">
                              {result.permissionEmail}
                           </div>
                        </CardContent>
                      </Card>
                    )}
                    {result.instaCaption && (
                      <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                          <div className="flex items-center gap-2">
                            <Instagram className="h-5 w-5 text-pink-500" />
                            <span className="font-semibold text-sm">Social Media</span>
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => copyToClipboard(result.instaCaption!, "insta")}>
                            {copiedSection === "insta" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <CardContent className="p-6">
                           <p className="text-base font-medium leading-relaxed">{result.instaCaption}</p>
                        </CardContent>
                      </Card>
                    )}
                    {result.outline && (
                      <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-orange-500" />
                            <span className="font-semibold text-sm">Content Outline</span>
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => copyToClipboard(result.outline!, "outline")}>
                            {copiedSection === "outline" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <CardContent className="p-6">
                           <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.outline}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                    <TabsContent value="visual" className="mt-6">
                      <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-purple-500" />
                            <span className="font-semibold text-sm">Visual Prompt</span>
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => copyToClipboard(result.imagePrompt!, "prompt")}>
                            {copiedSection === "prompt" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <CardContent className="p-6">
                          <div className="bg-slate-950 text-slate-300 p-6 rounded-2xl font-mono text-sm leading-relaxed border border-white/5">
                             <span className="text-primary mr-2 opacity-50">$ generate --v 6.0</span>
                             {result.imagePrompt}
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-4">Optimized for DALL-E 3 & Midjourney</p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="roadmap" className="mt-6">
                      <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <span className="font-semibold text-sm">AI-Powered Roadmap</span>
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => copyToClipboard(result.roadmap!, "roadmap")}>
                            {copiedSection === "roadmap" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <CardContent className="p-6">
                           <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-primary/20">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed italic">{result.roadmap}</p>
                           </div>
                        </CardContent>
                      </Card>
                    </TabsContent>


                  <TabsContent value="technical" className="mt-6">
                    <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                        <div className="flex items-center gap-2">
                          <Code className="h-5 w-5 text-cyan-500" />
                          <span className="font-semibold text-sm">Tech Utility / Snippet</span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => copyToClipboard(result.codeSnippet!, "code")}>
                          {copiedSection === "code" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <CardContent className="p-6">
                        <pre className="bg-slate-950 text-slate-300 p-6 rounded-2xl font-mono text-sm overflow-x-auto">
                           <code>{result.codeSnippet || "No snippet generated for this mode."}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[500px] p-12 text-center rounded-3xl border-2 border-dashed bg-card/10 backdrop-blur-sm"
              >
                <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                   <Megaphone className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Awaiting your Vision</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Provide the details on the left and our AI will co-produce a full suite of materials for you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <section className="pt-10 border-t space-y-6">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-bold">Recent Generations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {history.map((gen) => (
              <Card 
                key={gen.id} 
                className="cursor-pointer hover:border-primary transition-all group overflow-hidden"
                onClick={() => {
                  setResult(gen.content);
                  setTitle(gen.content.title || "");
                  setMode(gen.type);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="px-2 py-0.5 rounded bg-primary/10 text-[8px] font-bold text-primary uppercase">
                      {gen.type}
                    </div>
                  </div>
                  <CardTitle className="text-xs truncate">{gen.content.title || "Untitled"}</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                   <p className="text-[10px] text-muted-foreground italic">Click to restore</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
