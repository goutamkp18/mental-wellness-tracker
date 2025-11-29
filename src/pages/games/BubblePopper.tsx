import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  popped: boolean;
}

const BubblePopper = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);

  const colors = [
    "bg-blue-400",
    "bg-cyan-400",
    "bg-teal-400",
    "bg-green-400",
    "bg-purple-400",
    "bg-pink-400",
  ];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        addBubble();
      }, 800);
      return () => clearInterval(interval);
    }
  }, [gameActive]);

  const addBubble = () => {
    const newBubble: Bubble = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      size: Math.random() * 40 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      popped: false,
    };

    setBubbles((prev) => [...prev, newBubble].slice(-15));
  };

  const popBubble = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setScore((s) => s + 10);

    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 300);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/games")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>

          <div className="flex gap-6 text-sm font-medium">
            <div>
              Score: <span className="text-primary text-lg">{score}</span>
            </div>
            <div>
              Time: <span className="text-primary text-lg">{timeLeft}s</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-display font-bold mb-2">Bubble Popper Pro</h1>
            <p className="text-muted-foreground">Pop as many bubbles as you can!</p>
          </div>

          {!gameActive && timeLeft === 60 && (
            <Card className="max-w-md mx-auto shadow-glow">
              <CardContent className="pt-6 space-y-4 text-center">
                <p className="text-lg">Ready to pop some bubbles and release stress?</p>
                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                  size="lg"
                >
                  Start Game
                </Button>
              </CardContent>
            </Card>
          )}

          {!gameActive && timeLeft === 0 && (
            <Card className="max-w-md mx-auto shadow-glow">
              <CardContent className="pt-6 space-y-4 text-center">
                <h2 className="text-2xl font-display font-bold">Game Over!</h2>
                <p className="text-3xl font-bold text-primary">{score} points</p>
                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                  size="lg"
                >
                  Play Again
                </Button>
              </CardContent>
            </Card>
          )}

          {gameActive && (
            <div className="relative h-[600px] bg-white/50 dark:bg-black/20 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-glow">
              {bubbles.map((bubble) => (
                <div
                  key={bubble.id}
                  className={`absolute rounded-full cursor-pointer transition-all duration-300 ${
                    bubble.color
                  } ${
                    bubble.popped ? "scale-0 opacity-0" : "scale-100 opacity-70"
                  } hover:opacity-100 hover:scale-110 shadow-lg animate-float`}
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    animationDuration: `${Math.random() * 2 + 2}s`,
                  }}
                  onClick={() => popBubble(bubble.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BubblePopper;