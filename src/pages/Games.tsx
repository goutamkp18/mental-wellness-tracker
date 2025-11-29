import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Circle, Flower2, Sparkles } from "lucide-react";

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: "bubble-popper",
      name: "Bubble Popper Pro",
      description: "Pop bubbles to release stress with satisfying feedback and power-ups",
      icon: Circle,
      color: "from-blue-400 to-cyan-400",
      route: "/games/bubble-popper",
    },
    {
      id: "zen-garden",
      name: "Zen Garden",
      description: "Create peaceful sand patterns with realistic physics and calming effects",
      icon: Flower2,
      color: "from-green-400 to-emerald-400",
      route: "/games/zen-garden",
    },
    {
      id: "particle",
      name: "Particle Meditation",
      description: "Watch and interact with mesmerizing particle effects for deep relaxation",
      icon: Sparkles,
      color: "from-purple-400 to-pink-400",
      route: "/games/particle-meditation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-wellness-energy/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-wellness-balance/20 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <header className="relative border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Stress Relief Games
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose a game to help you relax, reduce stress, and find your calm
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <Card
                  key={game.id}
                  className="group hover:shadow-glow transition-smooth cursor-pointer border-primary/20 hover:border-primary/40"
                  onClick={() => navigate(game.route)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth shadow-soft`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-display">{game.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-primary/10 transition-smooth"
                    >
                      Play Now
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-smooth" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-muted bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground space-y-2">
                <p className="font-medium">💡 Pro Tip</p>
                <p>
                  Play for 5-10 minutes when feeling stressed. Track your stress levels before and after to see the improvement!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Games;