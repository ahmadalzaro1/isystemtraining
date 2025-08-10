
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, LearningStyle } from "@/types/registration";
import { cn } from "@/lib/utils";

interface LearningStylesStepProps {
  data: Pick<FormData, "learningStyles">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const LEARNING_STYLES: { value: LearningStyle; label: string; icon: string }[] = [
  { value: "videos", label: "Watching Videos", icon: "🎥" },
  { value: "guides", label: "Reading Guides", icon: "📖" },
  { value: "hands-on", label: "Hands-On Training", icon: "🏋" },
  { value: "qa", label: "Q&A Sessions", icon: "💬" },
];

export const LearningStylesStep = ({ data, onChange, className }: LearningStylesStepProps) => {
  const handleStyleToggle = (style: LearningStyle) => {
    const updatedStyles = data.learningStyles.includes(style)
      ? data.learningStyles.filter(s => s !== style)
      : [...data.learningStyles, style];
    onChange({ learningStyles: updatedStyles });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <Label className="text-lg font-medium">
          How do you prefer to learn new Apple features?
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select all learning styles that work best for you
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEARNING_STYLES.map((style) => (
          <Label
            key={style.value}
            className="flex items-start gap-3 p-4 bg-surface2 border border-[hsl(var(--border))] rounded-xl shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus"
          >
            <Checkbox
              checked={data.learningStyles.includes(style.value)}
              onCheckedChange={() => handleStyleToggle(style.value)}
            />
            <div className="flex items-center gap-2">
              <span>{style.icon}</span>
              <span>{style.label}</span>
              <span className="text-sm text-muted-foreground">
                {style.value === "videos" && "(Step-by-step tutorials)"}
                {style.value === "guides" && "(Structured explanations)"}
                {style.value === "hands-on" && "(Live demos & practice)"}
                {style.value === "qa" && "(Ask an expert directly)"}
              </span>
            </div>
          </Label>
        ))}
      </div>
    </div>
  );
};
