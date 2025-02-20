
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData, ExperienceLevel } from "@/types/registration";
import { cn } from "@/lib/utils";

interface ExperienceStepProps {
  data: Pick<FormData, "experienceLevel">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; description: string }[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "I'm new to Apple devices and need help with basics",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "I know the basics but want to learn more advanced features",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "I'm experienced and looking to master advanced techniques",
  },
];

export const ExperienceStep = ({ data, onChange, className }: ExperienceStepProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <Label className="text-lg font-medium">
        What's your experience level with Apple devices?
      </Label>
      <RadioGroup
        value={data.experienceLevel}
        onValueChange={(value: ExperienceLevel) => onChange({ experienceLevel: value })}
        className="space-y-4"
      >
        {EXPERIENCE_LEVELS.map((level) => (
          <Label
            key={level.value}
            className="flex flex-col space-y-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value={level.value} />
              <span className="font-medium">{level.label}</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {level.description}
            </p>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
