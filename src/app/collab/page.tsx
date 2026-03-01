"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Plus, 
  MessageSquare, 
  History, 
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  X,
  Save,
  UserPlus,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  created_at: string;
  member_count?: number;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  project: string;
}

export default function Collaboration() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchTeams();
    fetchActivity();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/collab');
      const data = await response.json();
      
      if (data.error) {
        toast.error(`Failed to fetch teams: ${data.error}`);
      } else {
        setTeams(data);
      }
    } catch (e: any) {
      toast.error(`Failed to fetch teams: ${e.message}`);
    }
    setLoading(false);
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch('/api/collab', {
        method: 'POST',
        body: JSON.stringify({ action: 'fetchActivity' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data && data.length > 0) {
        setActivities(data.map((g: any) => ({
          id: g.id,
          user: "Campus User",
          action: `generated ${g.type} content`,
          time: new Date(g.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          project: g.content?.title || "Untitled"
        })));
      } else {
        setActivities([
          { id: '1', user: "Alex J.", action: "generated a poster prompt", time: "2m ago", project: "InnovateX" },
          { id: '2', user: "Sarah L.", action: "saved a custom utility", time: "15m ago", project: "Admissions Bot" },
          { id: '3', user: "Mike R.", action: "completed a bias check", time: "1h ago", project: "Dean's Letter" }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [isAddingMember, setIsAddingMember] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState("");

  const createTeam = async () => {
    if (!newName) return;
    
    try {
      const response = await fetch('/api/collab', {
        method: 'POST',
        body: JSON.stringify({ action: 'createTeam', name: newName }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.error) {
        console.error("Team creation error detail:", data.error);
        toast.error(`Failed to create team: ${data.error}`);
        return;
      }

      toast.success("Team created and joined successfully!");
      await fetchTeams();
      setIsCreating(false);
      setNewName("");
    } catch (e: any) {
      console.error("Unexpected error:", e);
      toast.error(e.message || "An unexpected error occurred");
    }
  };

  const addMember = async () => {
    if (!isAddingMember || !newMemberName) return;
    
    try {
      const response = await fetch('/api/collab', {
        method: 'POST',
        body: JSON.stringify({ action: 'addMember', teamId: isAddingMember, name: newMemberName }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.error) {
        toast.error(`Failed to add member: ${data.error}`);
      } else {
        toast.success(`${newMemberName} added to team!`);
        fetchTeams();
        setIsAddingMember(null);
        setNewMemberName("");
      }
    } catch (e: any) {
      toast.error(`Error adding member: ${e.message}`);
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const response = await fetch('/api/collab', {
        method: 'POST',
        body: JSON.stringify({ action: 'deleteTeam', id }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.error) {
        toast.error(`Failed to delete team: ${data.error}`);
      } else {
        toast.success("Team deleted");
        fetchTeams();
      }
    } catch (e: any) {
      toast.error(`Error deleting team: ${e.message}`);
    }
  };

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Collaboration</h1>
          <p className="text-muted-foreground">Work together with your campus teams to co-produce AI content.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="rounded-full gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Teams List */}
        <section className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Your Teams</h2>
              <div className="relative w-full max-w-xs">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                  className="pl-9 h-10 rounded-full" 
                  placeholder="Search teams..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           {loading ? (
             <div className="flex items-center justify-center p-20">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTeams.map(team => (
                   <Card key={team.id} className="group cursor-pointer hover:border-primary transition-all duration-300 relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTeam(team.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CardHeader className="flex flex-row items-center gap-4 pb-4">
                         <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {team.name[0].toUpperCase()}
                         </div>
                         <div className="space-y-1">
                            <CardTitle className="text-lg">{team.name}</CardTitle>
                            <CardDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">
                              {team.member_count} Members
                            </CardDescription>
                         </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                         <div className="flex items-center gap-2 text-xs text-green-500 font-bold bg-green-500/5 w-fit px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3" /> Online
                         </div>
                      </CardContent>
                        <CardFooter className="pt-0 flex justify-between">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="text-xs text-primary font-bold uppercase tracking-tighter gap-2 hover:bg-primary/10"
                             onClick={(e) => {
                               e.stopPropagation();
                               setIsAddingMember(team.id);
                             }}
                           >
                             <UserPlus className="h-3 w-3" /> Add Members
                           </Button>
                           <div className="flex -space-x-2">

                            {[1,2].map(i => (
                               <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted text-[8px] flex items-center justify-center font-bold">U{i}</div>
                            ))}
                            <div className="h-6 w-6 rounded-full border-2 border-background bg-primary/10 text-[8px] flex items-center justify-center text-primary font-bold">+1</div>
                         </div>
                      </CardFooter>
                   </Card>
                ))}
                {filteredTeams.length === 0 && (
                  <div className="col-span-2 flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl opacity-40">
                     <Users className="h-12 w-12 mb-4" />
                     <p className="font-bold">No teams found.</p>
                  </div>
                )}
             </div>
           )}
        </section>

        {/* Activity Feed */}
        <aside className="lg:col-span-4 space-y-6">
           <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" /> Shared History
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y">
                    {activities.map(act => (
                       <div key={act.id} className="p-4 flex gap-4 hover:bg-muted/30 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                             {act.user[0]}
                          </div>
                          <div className="space-y-1 min-w-0">
                             <p className="text-xs leading-none">
                                <span className="font-bold">{act.user}</span> {act.action}
                             </p>
                             <p className="text-[10px] text-muted-foreground truncate italic">In project: {act.project}</p>
                             <div className="flex items-center gap-1 text-[8px] text-muted-foreground font-bold uppercase tracking-tighter pt-1">
                                <Clock className="h-2 w-2" /> {act.time}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-primary/5 border-none shadow-none">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-widest text-primary flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Live Sync
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-[10px] leading-relaxed text-muted-foreground uppercase font-bold tracking-widest">Collaborators see changes in real-time. No more version conflicts.</p>
                 <div className="h-10 w-full bg-background/50 rounded-xl border flex items-center px-4 gap-2">
                    <Zap className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-mono opacity-60">Connected to Cloud Node</span>
                 </div>
              </CardContent>
           </Card>
        </aside>
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              <Card className="shadow-2xl border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Create New Team</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Team Name</Label>
                    <Input 
                      placeholder="e.g. Creative Committee"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && createTeam()}
                    />
                  </div>
                  <Button className="w-full gap-2" onClick={createTeam} disabled={!newName}>
                    <Save className="h-4 w-4" /> Save Team
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
        </AnimatePresence>

        {/* Add Member Modal */}
        <AnimatePresence>
          {isAddingMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md"
              >
                <Card className="shadow-2xl border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Add Team Member</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsAddingMember(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Member Name</Label>
                      <Input 
                        placeholder="e.g. Jane Doe"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addMember()}
                        autoFocus
                      />
                    </div>
                    <Button className="w-full gap-2" onClick={addMember} disabled={!newMemberName}>
                      <UserPlus className="h-4 w-4" /> Add to Team
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
