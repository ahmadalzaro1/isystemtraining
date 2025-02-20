
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Workshop } from "@/types/workshop";
import { RecommendationQuiz } from "./RecommendationQuiz";
import { RecommendationResult } from "./RecommendationResult";
import { LightBulb } from "lucide-react";

interface WorkshopRecommenderProps {
  workshops: Workshop[];
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopRecommender = ({ workshops, onSelect }: WorkshopRecommenderProps) => {
  const [step, setStep] = useState<"quiz" | "result">("quiz");
  const [recommendedWorkshop, setRecommendedWorkshop] = useState<Workshop | null>(null);

  const handleAnswerSubmit = (goal: string) => {
    // Simple recommendation logic based on user's goal
    const workshopMap = {
      "productivity": "MacBook Mastery 101",
      "creativity": "Pro Apps Training",
      "security": "Privacy & Security",
      "ecosystem": "Apple Ecosystem",
      "basics": "Switching from Windows?",
    };

    const recommended = workshops.find(w => w.name === workshopMap[goal as keyof typeof workshopMap]) || workshops[0];
    setRecommendedWorkshop(recommended);
    setStep("result");
  };

  const handleReset = () => {
    setStep("quiz");
    setRecommendedWorkshop(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="glass-card w-full sm:w-auto animate-fade-up flex items-center gap-2"
        >
          <LightBulb className="w-4 h-4" />
          Not Sure Which Workshop to Attend?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-morphism">
        {step === "quiz" ? (
          <RecommendationQuiz onSubmit={handleAnswerSubmit} />
        ) : (
          <RecommendationResult
            workshop={recommendedWorkshop!}
            onTryAgain={handleReset}
            onSelect={onSelect}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
