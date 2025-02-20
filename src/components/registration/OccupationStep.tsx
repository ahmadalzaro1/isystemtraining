
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData, Occupation } from "@/types/registration";
import { cn } from "@/lib/utils";

interface OccupationStepProps {
  data: Pick<FormData, "occupation">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const OCCUPATIONS: { value: Occupation; label: string; icon: string }[] = [
  { value: "student", label: "Student", icon: "🎓" },
  { value: "professional", label: "Professional", icon: "💼" },
  { value: "entrepreneur", label: "Entrepreneur", icon: "🚀" },
  { value: "creative", label: "Creative", icon: "🎨" },
  { value: "developer", label: "Developer", icon: "💻" },
  { value: "other", label: "Other", icon: "✨" },
];

export const OccupationStep = ({ data, onChange, className }: OccupationStepProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <Label className="text-lg font-medium">What best describes your occupation?</Label>
      <RadioGroup
        value={data.occupation}
        onValueChange={(value: Occupation) => onChange({ occupation: value })}
        className="space-y-3"
      >
        {OCCUPATIONS.map((occupation) => (
          <Label
            key={occupation.value}
            className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <RadioGroupItem value={occupation.value} />
            <div className="flex items-center gap-2">
              <span>{occupation.icon}</span>
              <span>{occupation.label}</span>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
