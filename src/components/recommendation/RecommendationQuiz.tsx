
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

interface RecommendationQuizProps {
  onSubmit: (goal: string) => void;
}

const GOALS = [
  {
    value: "productivity",
    label: "Boost My Productivity",
    description: "Learn essential shortcuts and workflows",
  },
  {
    value: "creativity",
    label: "Express My Creativity",
    description: "Master creative apps and tools",
  },
  {
    value: "security",
    label: "Enhance Security",
    description: "Protect my data and privacy",
  },
  {
    value: "ecosystem",
    label: "Connect My Devices",
    description: "Seamlessly integrate all Apple products",
  },
  {
    value: "basics",
    label: "Learn the Basics",
    description: "Get comfortable with macOS",
  },
];

export const RecommendationQuiz = ({ onSubmit }: RecommendationQuizProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  return (
    <div className="space-y-6 animate-fade-up">
      <DialogHeader>
        <DialogTitle className="text-2xl font-medium tracking-tight">
          What's Your Goal?
        </DialogTitle>
        <DialogDescription className="text-base text-muted-foreground">
          Let us recommend the perfect workshop for you.
        </DialogDescription>
      </DialogHeader>

      <RadioGroup
        value={selectedGoal}
        onValueChange={setSelectedGoal}
        className="gap-3"
      >
        {GOALS.map((goal) => (
          <div key={goal.value} className="flex items-start space-x-3">
            <RadioGroupItem
              value={goal.value}
              id={goal.value}
              className="mt-1"
            />
            <Label
              htmlFor={goal.value}
              className="grid gap-1 cursor-pointer leading-none pt-1"
            >
              <span className="font-medium">{goal.label}</span>
              <span className="text-sm text-muted-foreground">
                {goal.description}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={() => onSubmit(selectedGoal)}
        className="w-full"
        disabled={!selectedGoal}
      >
        Find My Workshop
      </Button>
    </div>
  );
};
