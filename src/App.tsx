import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MoodAssessment from "./pages/MoodAssessment";
import AssessmentResults from "./pages/AssessmentResults";
import Games from "./pages/Games";
import BubblePopper from "./pages/games/BubblePopper";
import ZenGarden from "./pages/games/ZenGarden";
import ParticleMeditation from "./pages/games/ParticleMeditation";
import ColorTherapy from "./pages/games/ColorTherapy";
import TherapyTools from "./pages/TherapyTools";
import Journal from "./pages/therapy/Journal";
import BreathingExercise from "./pages/therapy/BreathingExercise";
import MusicTherapy from "./pages/therapy/MusicTherapy";
import YogaTherapy from "./pages/therapy/YogaTherapy";
import SupportGroups from "./pages/SupportGroups";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood-assessment" element={<MoodAssessment />} />
          <Route path="/results" element={<AssessmentResults />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/bubble-popper" element={<BubblePopper />} />
          <Route path="/games/zen-garden" element={<ZenGarden />} />
          <Route path="/games/particle-meditation" element={<ParticleMeditation />} />
          <Route path="/games/color-therapy" element={<ColorTherapy />} />
          <Route path="/therapy" element={<TherapyTools />} />
          <Route path="/therapy/journal" element={<Journal />} />
          <Route path="/therapy/breathing" element={<BreathingExercise />} />
          <Route path="/therapy/music" element={<MusicTherapy />} />
          <Route path="/therapy/yoga" element={<YogaTherapy />} />
          <Route path="/support-groups" element={<SupportGroups />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
