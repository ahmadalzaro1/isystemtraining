
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, LearningInterest, PrimaryUse } from "@/types/registration";
import { cn } from "@/lib/utils";

interface LearningNeedsStepProps {
  data: Pick<FormData, "learningInterests" | "primaryUse">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const LEARNING_INTERESTS: { value: LearningInterest; label: string; icon: string }[] = [
  { value: "basics", label: "Mac & iOS Basics", icon: "📂" },
  { value: "productivity", label: "Productivity & Automation", icon: "🚀" },
  { value: "creativity", label: "Creativity & Content Creation", icon: "🎨" },
  { value: "security", label: "Security & Digital Privacy", icon: "🔐" },
  { value: "business", label: "Business & Professional Use", icon: "📈" },
  { value: "ai", label: "AI & Smart Features", icon: "🤖" },
  { value: "icloud", label: "iCloud & Syncing", icon: "☁️" },
];

const PRIMARY_USES: { value: PrimaryUse; label: string; icon: string }[] = [
  { value: "work", label: "Work / Business", icon: "💼" },
  { value: "study", label: "Studying / Research", icon: "🎓" },
  { value: "creativity", label: "Creativity / Design", icon: "🎨" },
  { value: "personal", label: "Personal use", icon: "📱" },
  { value: "home", label: "Home & Family Management", icon: "🏡" },
];

export const LearningNeedsStep = ({ data, onChange, className }: LearningNeedsStepProps) => {
  const handleInterestToggle = (interest: LearningInterest) => {
    const updatedInterests = data.learningInterests.includes(interest)
      ? data.learningInterests.filter(i => i !== interest)
      : [...data.learningInterests, interest];
    onChange({ learningInterests: updatedInterests });
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-4">
        <Label className="text-lg font-medium">What do you want to learn the most?</Label>
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
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span>{interest.icon}</span>
                  <span>{interest.label}</span>
                </div>
              </div>
            </Label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">What is your primary use for Apple devices?</Label>
        <RadioGroup
          value={data.primaryUse}
          onValueChange={(value: PrimaryUse) => onChange({ primaryUse: value })}
          className="space-y-3"
        >
          {PRIMARY_USES.map((use) => (
            <Label
              key={use.value}
              className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value={use.value} />
              <div className="flex items-center gap-2">
                <span>{use.icon}</span>
                <span>{use.label}</span>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
