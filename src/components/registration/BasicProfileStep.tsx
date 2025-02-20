
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, DeviceType, ExperienceLevel } from "@/types/registration";
import { cn } from "@/lib/utils";

interface BasicProfileStepProps {
  data: Pick<FormData, "isFirstTime" | "devices" | "experienceLevel">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const DEVICES: { value: DeviceType; label: string }[] = [
  { value: "Mac", label: "Mac" },
  { value: "iPhone", label: "iPhone" },
  { value: "iPad", label: "iPad" },
  { value: "Apple Watch", label: "Apple Watch" },
  { value: "Apple TV", label: "Apple TV" },
  { value: "AirPods", label: "AirPods" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; icon: string; description: string }[] = [
  {
    value: "beginner",
    label: "Beginner",
    icon: "🟢",
    description: "I'm new & still figuring things out"
  },
  {
    value: "intermediate",
    label: "Intermediate",
    icon: "🟡",
    description: "I know the basics but want to learn pro tips"
  },
  {
    value: "advanced",
    label: "Advanced",
    icon: "🔴",
    description: "I want to master advanced workflows & hidden features"
  },
];

export const BasicProfileStep = ({ data, onChange, className }: BasicProfileStepProps) => {
  const handleDeviceToggle = (device: DeviceType) => {
    const updatedDevices = data.devices.includes(device)
      ? data.devices.filter(d => d !== device)
      : [...data.devices, device];
    onChange({ devices: updatedDevices });
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* First-time user question */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">Are you a first-time Apple user?</Label>
        <RadioGroup
          value={data.isFirstTime ? "yes" : "no"}
          onValueChange={(value) => onChange({ isFirstTime: value === "yes" })}
          className="flex gap-4"
        >
          <Label className="flex items-center space-x-2 cursor-pointer">
            <RadioGroupItem value="yes" />
            <span>Yes</span>
          </Label>
          <Label className="flex items-center space-x-2 cursor-pointer">
            <RadioGroupItem value="no" />
            <span>No</span>
          </Label>
        </RadioGroup>
      </div>

      {/* Device selection */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">What Apple devices do you currently own?</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DEVICES.map((device) => (
            <Label
              key={device.value}
              className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={data.devices.includes(device.value)}
                onCheckedChange={() => handleDeviceToggle(device.value)}
              />
              <span>{device.label}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Experience level */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">What best describes your experience with Apple devices?</Label>
        <RadioGroup
          value={data.experienceLevel}
          onValueChange={(value: ExperienceLevel) => onChange({ experienceLevel: value })}
          className="space-y-4"
        >
          {EXPERIENCE_LEVELS.map((level) => (
            <Label
              key={level.value}
              className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value={level.value} />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span>{level.icon}</span>
                  <span className="font-medium">{level.label}:</span>
                </div>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
