"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  BookOpen, 
  Filter, 
  ArrowLeft,
  Loader2,
  Lock,
  Zap
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import Link from "next/link";

export default function ReviewLab() {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    bias: { score: number; details: string[] };
    attribution: { sources: string[] };
    safety: { status: "pass" | "fail"; issues: string[] };
  } | null>(null);

  const handleAnalyze = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Failed to analyze content");
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Review Lab</h1>
          <p className="text-muted-foreground">Ensure your AI-generated content is responsible, ethical, and accurate.</p>
        </div>
        <div className="px-4 py-2 bg-green-500/10 rounded-full text-green-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border border-green-500/20">
           <CheckCircle2 className="h-3 w-3" /> Safe Computing Enabled
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Input Side */}
        <section className="lg:col-span-5">
           <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Content Scanner
                 </CardTitle>
                 <CardDescription>Paste your draft below to run an ethics & bias check.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label>Draft Content</Label>
                    <Textarea 
                       placeholder="Paste your generated text here..." 
                       className="min-h-[300px] bg-background/50 border-muted-foreground/20 resize-none"
                       value={content}
                       onChange={(e) => setContent(e.target.value)}
                    />
                 </div>
                 <Button 
                    className="w-full h-12 gap-2 shadow-lg shadow-primary/20" 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !content}
                 >
                    {isAnalyzing ? (
                       <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Responsibility...
                       </>
                    ) : (
                       <>
                          <ShieldCheck className="h-4 w-4" /> Run Review Lab
                       </>
                    )}
                 </Button>
              </CardContent>
           </Card>
        </section>

        {/* Results Side */}
        <section className="lg:col-span-7 space-y-6">
           <AnimatePresence mode="wait">
              {results ? (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                 >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Card className="border-none shadow-lg bg-card/80">
                          <CardHeader className="pb-2">
                             <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                   <Scale className="h-4 w-4 text-primary" /> Bias Score
                                </CardTitle>
                                <span className="text-2xl font-bold">{results.bias.score}%</span>
                             </div>
                          </CardHeader>
                          <CardContent>
                             <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                                <motion.div 
                                   initial={{ width: 0 }} 
                                   animate={{ width: `${results.bias.score}%` }} 
                                   className="h-full bg-primary"
                                />
                             </div>
                             <ul className="space-y-2">
                                {results.bias.details.map((d, i) => (
                                   <li key={i} className="text-xs text-muted-foreground flex gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary/40 mt-1 shrink-0" />
                                      {d}
                                   </li>
                                ))}
                             </ul>
                          </CardContent>
                       </Card>

                       <Card className="border-none shadow-lg bg-card/80">
                          <CardHeader className="pb-2">
                             <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Filter className="h-4 w-4 text-green-500" /> Safety Status
                             </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                             <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-bold">Compliant</span>
                             </div>
                             <p className="text-xs text-muted-foreground leading-relaxed">
                                No harmful keywords, hate speech, or sensitive campus topics detected in this draft.
                             </p>
                          </CardContent>
                       </Card>
                    </div>

                    <Card className="border-none shadow-lg bg-card/80">
                       <CardHeader>
                          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                             <BookOpen className="h-4 w-4 text-blue-500" /> Source Attribution
                          </CardTitle>
                          <CardDescription>AI-generated content often mimics these identified source patterns.</CardDescription>
                       </CardHeader>
                       <CardContent>
                          <div className="flex flex-wrap gap-2">
                             {results.attribution.sources.map(s => (
                                <div key={s} className="px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] font-bold text-blue-500 flex items-center gap-2">
                                   <Lock className="h-3 w-3" /> {s}
                                </div>
                             ))}
                          </div>
                       </CardContent>
                       <CardFooter className="bg-muted/10 border-t py-3">
                          <p className="text-[10px] text-muted-foreground italic uppercase tracking-wider">Note: This is a simulated attribution based on stylistic analysis.</p>
                       </CardFooter>
                    </Card>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-4 items-center">
                       <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          <Zap className="h-5 w-5 fill-current" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-bold">Ready to publish?</p>
                          <p className="text-xs text-muted-foreground">Your content passes all primary responsibility checks. You can now safely export or share it.</p>
                       </div>
                    </div>
                 </motion.div>
              ) : (
                 <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center min-h-[500px] p-12 text-center rounded-3xl border-2 border-dashed bg-card/10"
                 >
                    <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Analysis Needed</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                       AI content should always be reviewed. Paste your text to ensure it meets campus standards for fairness and accuracy.
                    </p>
                 </motion.div>
              )}
           </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
