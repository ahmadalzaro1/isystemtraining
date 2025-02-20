
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, LearningInterest } from "@/types/registration";
import { cn } from "@/lib/utils";

interface LearningInterestsStepProps {
  data: Pick<FormData, "learningInterests">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const LEARNING_INTERESTS: { value: LearningInterest; label: string; icon: string }[] = [
  { value: "basics", label: "Apple Basics", icon: "📱" },
  { value: "productivity", label: "Productivity Tools", icon: "⚡" },
  { value: "creativity", label: "Creative Applications", icon: "🎨" },
  { value: "security", label: "Security & Privacy", icon: "🔒" },
  { value: "business", label: "Business Tools", icon: "💼" },
  { value: "ai", label: "AI & Automation", icon: "🤖" },
  { value: "icloud", label: "iCloud & Sync", icon: "☁️" },
];

export const LearningInterestsStep = ({ data, onChange, className }: LearningInterestsStepProps) => {
  const handleInterestToggle = (interest: LearningInterest) => {
    const updatedInterests = data.learningInterests.includes(interest)
      ? data.learningInterests.filter(i => i !== interest)
      : [...data.learningInterests, interest];
    onChange({ learningInterests: updatedInterests });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Label className="text-lg font-medium">
        What would you like to learn about?
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEARNING_INTERESTS.map((interest) => (
          <Label
            key={interest.value}
            className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Checkbox
              checked={data.learningInterests.includes(interest.value)}
              onCheckedChange={() => handleInterestToggle(interest.value)}
            />
            <div className="flex items-center gap-2">
              <span>{interest.icon}</span>
              <span>{interest.label}</span>
            </div>
          </Label>
        ))}
      </div>
    </div>
  );
};
