import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Curated question bank (7 questions shown per session from this pool)
const questionBank = [
  { id: 1, text: "How would you rate your overall mood today?", category: "emotional" },
  { id: 2, text: "How well did you sleep last night?", category: "sleep" },
  { id: 3, text: "How stressed do you feel right now?", category: "stress" },
  { id: 4, text: "How satisfied are you with your social connections?", category: "social" },
  { id: 5, text: "How would you rate your energy levels?", category: "physical" },
  { id: 6, text: "How balanced do you feel between work and personal life?", category: "balance" },
  { id: 7, text: "How well are you taking care of yourself?", category: "selfcare" },
  { id: 8, text: "How clear and focused is your thinking today?", category: "mental" },
  { id: 9, text: "How well do you handle challenges?", category: "resilience" },
  { id: 10, text: "How satisfied are you with your life overall?", category: "satisfaction" },
];

const scaleOptions = [
  { value: "1", label: "Very Poor" },
  { value: "2", label: "Poor" },
  { value: "3", label: "Fair" },
  { value: "4", label: "Good" },
  { value: "5", label: "Excellent" },
];

const MoodAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [selectedQuestions, setSelectedQuestions] = useState<typeof questionBank>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    selectRandomQuestions();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUserId(session.user.id);
  };

  const selectRandomQuestions = () => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 7));
  };

  const handleResponse = (value: string) => {
    setResponses({ ...responses, [selectedQuestions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Call AI edge function to analyze responses
      const { data, error } = await supabase.functions.invoke("analyze-mood", {
        body: { responses, questions: selectedQuestions },
      });

      if (error) throw error;

      // Save assessment to database
      const { error: dbError } = await supabase.from("mood_assessments").insert({
        user_id: userId,
        responses: responses,
        scores: data.scores,
        ai_insights: data.insights,
        overall_score: data.overallScore,
      });

      if (dbError) throw dbError;

      // Save wellness metrics
      await supabase.from("wellness_metrics").insert({
        assessment_id: data.assessmentId,
        user_id: userId,
        ...data.metrics,
      });

      toast({
        title: "Assessment Complete!",
        description: "Your wellness insights have been generated.",
      });

      navigate("/results", { state: { results: data } });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process assessment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;
  const canProceed = responses[selectedQuestions[currentQuestion]?.id];
  const isLastQuestion = currentQuestion === selectedQuestions.length - 1;

  if (selectedQuestions.length === 0) {
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
        <div className="absolute top-10 right-10 w-64 h-64 bg-wellness-calm/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
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
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Assessment</span>
            </div>
            <h1 className="text-4xl font-display font-bold">Mood Assessment</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {selectedQuestions.length}
            </p>
          </div>

          <Progress value={progress} className="h-2" />

          <Card className="shadow-glow border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl font-display">
                {selectedQuestions[currentQuestion]?.text}
              </CardTitle>
              <CardDescription>
                Choose the option that best describes how you feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={responses[selectedQuestions[currentQuestion]?.id] || ""}
                onValueChange={handleResponse}
              >
                <div className="space-y-3">
                  {scaleOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-smooth cursor-pointer"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {isLastQuestion ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed || loading}
                    className="flex-1 bg-gradient-wellness hover:opacity-90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Complete Assessment
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex-1 bg-primary hover:bg-primary-dark"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MoodAssessment;