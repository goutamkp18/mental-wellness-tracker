import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Gamepad2, LineChart, LogOut, Sparkles, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setUserName(profile.full_name || "Friend");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "Take care! Come back soon.",
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-calm">
        <div className="animate-pulse-soft">
          <Brain className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-wellness-calm/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <header className="relative border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-wellness rounded-xl flex items-center justify-center shadow-soft">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">MindWell</h1>
              <p className="text-xs text-muted-foreground">Mental Wellness Platform</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Welcome back, {userName}! 👋
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your mental wellness journey continues. Choose an activity below to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="group hover:shadow-glow transition-smooth cursor-pointer border-primary/20 hover:border-primary/40"
              onClick={() => navigate("/mood-assessment")}
            >
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-wellness rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth shadow-soft">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-display">AI Mood Assessment</CardTitle>
                <CardDescription className="text-base">
                  Take a personalized assessment powered by AI to understand your mental wellness across 10 key dimensions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary font-medium">
                  Start Assessment
                  <Target className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group hover:shadow-glow transition-smooth cursor-pointer border-accent/30 hover:border-accent/50"
              onClick={() => navigate("/games")}
            >
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-wellness-balance rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth shadow-soft">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-display">Stress Relief Games</CardTitle>
                <CardDescription className="text-base">
                  Play interactive games designed to reduce stress and promote relaxation through engaging activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-accent font-medium">
                  Play Games
                  <Target className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-muted hover:shadow-soft transition-smooth">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-display">Your Wellness Journey</CardTitle>
                    <CardDescription>
                      Track your progress and insights over time
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <LineChart className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Complete your first mood assessment to see your wellness metrics here.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;