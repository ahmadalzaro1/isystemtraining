
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormData, Frustration, AppleApp } from "@/types/registration";
import { cn } from "@/lib/utils";

interface ConfidenceStepProps {
  data: Pick<FormData, "confidenceLevel" | "mainFrustration" | "frustrationDetail" | "appsToLearn">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const FRUSTRATIONS: { value: Frustration; label: string; icon: string }[] = [
  { value: "battery", label: "Battery Life", icon: "❌" },
  { value: "complexity", label: "Too Many Features", icon: "❌" },
  { value: "syncing", label: "Syncing Issues", icon: "❌" },
  { value: "customization", label: "Customization & Settings", icon: "❌" },
  { value: "compatibility", label: "Software Compatibility", icon: "❌" },
  { value: "other", label: "Other", icon: "❌" },
];

const APPS_TO_LEARN: { value: AppleApp; label: string; icon: string }[] = [
  { value: "safari", label: "Safari & Web Browsing", icon: "🌐" },
  { value: "camera", label: "Camera & Photo Editing", icon: "📸" },
  { value: "notes", label: "Apple Notes & Productivity", icon: "✍️" },
  { value: "pro-apps", label: "Final Cut Pro, Logic Pro", icon: "🖥️" },
  { value: "ai-features", label: "AI Features (Siri, ML)", icon: "🤖" },
  { value: "apple-pay", label: "Apple Pay & Financial", icon: "🏦" },
];

export const ConfidenceStep = ({ data, onChange, className }: ConfidenceStepProps) => {
  const handleAppToggle = (app: AppleApp) => {
    const updatedApps = data.appsToLearn.includes(app)
      ? data.appsToLearn.filter(a => a !== app)
      : [...data.appsToLearn, app];
    onChange({ appsToLearn: updatedApps });
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-4">
        <Label className="text-lg font-medium">How confident do you feel using Apple devices?</Label>
        <input
          type="range"
          min="1"
          max="5"
          value={data.confidenceLevel}
          onChange={(e) => onChange({ confidenceLevel: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Not Confident</span>
          <span>Very Confident</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">What's your biggest frustration with your Apple device?</Label>
        <RadioGroup
          value={data.mainFrustration}
          onValueChange={(value: Frustration) => onChange({ mainFrustration: value })}
          className="space-y-3"
        >
          {FRUSTRATIONS.map((frustration) => (
            <Label
              key={frustration.value}
              className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value={frustration.value} />
              <div className="flex items-center gap-2">
                <span>{frustration.icon}</span>
                <span>{frustration.label}</span>
              </div>
            </Label>
          ))}
        </RadioGroup>
        {data.mainFrustration === "other" && (
          <Input
            placeholder="Please specify your frustration..."
            value={data.frustrationDetail || ""}
            onChange={(e) => onChange({ frustrationDetail: e.target.value })}
          />
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">What Apple apps or features do you wish you understood better?</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {APPS_TO_LEARN.map((app) => (
            <Label
              key={app.value}
              className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={data.appsToLearn.includes(app.value)}
                onCheckedChange={() => handleAppToggle(app.value)}
              />
              <div className="flex items-center gap-2">
                <span>{app.icon}</span>
                <span>{app.label}</span>
              </div>
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
};
