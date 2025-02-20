
import { Button } from "@/components/ui/button";
import { Workshop } from "@/types/workshop";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle, RefreshCw } from "lucide-react";

interface RecommendationResultProps {
  workshop: Workshop;
  onTryAgain: () => void;
  onSelect: (workshop: Workshop) => void;
}

export const RecommendationResult = ({
  workshop,
  onTryAgain,
  onSelect,
}: RecommendationResultProps) => {
  const getKeyTakeaways = (description: string): string[] => {
    // Generate 3 key takeaways based on the workshop description
    return [
      "Master essential workflows and shortcuts",
      "Learn time-saving productivity techniques",
      "Get personalized guidance from Apple experts",
    ];
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <DialogHeader>
        <DialogTitle className="text-2xl font-medium tracking-tight text-primary">
          Perfect Match Found!
        </DialogTitle>
        <DialogDescription className="text-base">
          Based on your goals, we recommend:
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">{workshop.name}</h3>
        <p className="text-muted-foreground">{workshop.description}</p>

        <div className="space-y-3 my-6">
          <h4 className="font-medium">Why This Workshop?</h4>
          <ul className="space-y-2">
            {getKeyTakeaways(workshop.description).map((takeaway, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onTryAgain}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={() => onSelect(workshop)}
          className="flex-1"
        >
          Select This Workshop
        </Button>
      </div>
    </div>
  );
};
