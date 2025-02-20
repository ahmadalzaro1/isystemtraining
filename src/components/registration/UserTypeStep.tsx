
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData, UserType, PlatformType } from "@/types/registration";
import { cn } from "@/lib/utils";

interface UserTypeStepProps {
  data: Pick<FormData, "userType" | "platform">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const USER_TYPES = [
  { value: "first-time", label: "First-time Apple user", icon: "🆕" },
  { value: "existing", label: "No, I've always used Apple", icon: "🍏" },
  { value: "switching", label: "Switching from another platform", icon: "🔄" },
] as const;

const PLATFORMS = [
  { value: "windows", label: "Windows" },
  { value: "android", label: "Android" },
  { value: "linux", label: "Linux" },
  { value: "other", label: "Other" },
] as const;

export const UserTypeStep = ({ data, onChange, className }: UserTypeStepProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <Label className="text-lg font-medium">Are you new to Apple?</Label>
        <RadioGroup
          value={data.userType}
          onValueChange={(value: UserType) => {
            onChange({ 
              userType: value,
              // Clear platform if not switching
              platform: value === "switching" ? data.platform : undefined 
            });
          }}
          className="space-y-4"
        >
          {USER_TYPES.map((type) => (
            <Label
              key={type.value}
              className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value={type.value} />
              <div className="flex items-center gap-2">
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {data.userType === "switching" && (
        <div className="space-y-4">
          <Label className="text-lg font-medium">What are you switching from?</Label>
          <Select
            value={data.platform}
            onValueChange={(value: PlatformType) => onChange({ platform: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your current platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
