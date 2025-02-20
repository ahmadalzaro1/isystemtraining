
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData, UserType, PlatformType } from "@/types/registration";
import { cn } from "@/lib/utils";

interface UserTypeStepProps {
  data: Pick<FormData, "userType" | "platformSwitch">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const PLATFORMS: { value: PlatformType; label: string }[] = [
  { value: "windows", label: "Windows" },
  { value: "android", label: "Android" },
  { value: "linux", label: "Linux" },
  { value: "other", label: "Other" },
];

export const UserTypeStep = ({ data, onChange, className }: UserTypeStepProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <Label className="text-lg font-medium">Are you new to Apple?</Label>
        <RadioGroup
          value={data.userType}
          onValueChange={(value: UserType) => {
            const update: Partial<FormData> = { userType: value };
            if (value !== "switching") {
              update.platformSwitch = undefined;
            }
            onChange(update);
          }}
          className="space-y-4"
        >
          <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="first-time" />
            <div className="flex items-center gap-2">
              <span>🆕</span>
              <span>First-time Apple user</span>
            </div>
          </Label>
          <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="existing" />
            <div className="flex items-center gap-2">
              <span>🍏</span>
              <span>No, I've always used Apple</span>
            </div>
          </Label>
          <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="switching" />
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>Switching from another platform</span>
            </div>
          </Label>
        </RadioGroup>
      </div>

      {data.userType === "switching" && (
        <div className="space-y-4 animate-fadeIn">
          <Label className="text-lg font-medium">What are you switching from?</Label>
          <Select
            value={data.platformSwitch}
            onValueChange={(value: PlatformType) => onChange({ platformSwitch: value })}
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
