
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData, PlatformType } from "@/types/registration";
import { cn } from "@/lib/utils";

interface PlatformStepProps {
  data: Pick<FormData, "platformSwitch">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const PLATFORMS: { value: PlatformType; label: string; icon: string }[] = [
  { value: "windows", label: "Windows → Mac", icon: "💻" },
  { value: "android", label: "Android → iPhone", icon: "📱" },
  { value: "linux", label: "Linux → Mac", icon: "🐧" },
  { value: "other", label: "Other Platform", icon: "🔄" },
];

export const PlatformStep = ({ data, onChange, className }: PlatformStepProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <Label className="text-lg font-medium">Are you switching from another platform?</Label>
      <RadioGroup
        value={data.platformSwitch}
        onValueChange={(value: PlatformType) => onChange({ platformSwitch: value })}
        className="space-y-4"
      >
        {PLATFORMS.map((platform) => (
          <Label
            key={platform.value}
            className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <RadioGroupItem value={platform.value} />
            <div className="flex items-center gap-2">
              <span>{platform.icon}</span>
              <span>{platform.label}</span>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
