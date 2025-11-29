import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Target, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-calm overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-wellness-calm/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-wellness-balance/10 rounded-full blur-3xl" />
      </div>

      <header className="relative container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-wellness rounded-2xl flex items-center justify-center shadow-soft">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">MindWell</h1>
              <p className="text-xs text-muted-foreground">Mental Wellness Platform</p>
            </div>
          </div>
          <Button onClick={() => navigate("/auth")} variant="outline" size="lg">
            Sign In
          </Button>
        </div>
      </header>

      <main className="relative container mx-auto px-4">
        <div className="max-w-6xl mx-auto pt-20 pb-32">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Mental Wellness</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight max-w-4xl mx-auto animate-fade-in">
              Transform Your
              <span className="block bg-gradient-wellness bg-clip-text text-transparent">
                Mental Wellness Journey
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              Discover personalized insights, interactive stress-relief games, and AI-powered assessments to support your mental health.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="bg-gradient-wellness hover:opacity-90 transition-smooth text-lg px-8 py-6 shadow-glow"
              >
                Get Started Free
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-glow transition-smooth hover:border-primary/30">
              <div className="w-14 h-14 bg-gradient-wellness rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth shadow-soft">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">AI Mood Assessment</h3>
              <p className="text-muted-foreground">
                Get personalized insights across 10 wellness dimensions with our advanced AI analysis.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-glow transition-smooth hover:border-accent/30">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-wellness-balance rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth shadow-soft">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Stress Relief Games</h3>
              <p className="text-muted-foreground">
                Play interactive games scientifically designed to reduce stress and promote relaxation.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-glow transition-smooth hover:border-wellness-energy/30">
              <div className="w-14 h-14 bg-gradient-to-br from-wellness-energy to-wellness-balance rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth shadow-soft">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your wellness journey with detailed analytics and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 MindWell. Supporting your mental wellness journey.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;