
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@/types/registration";

interface ExperienceStepProps {
  value: string;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

export const ExperienceStep = ({ value, onChange, className }: ExperienceStepProps) => (
  <div className={className}>
    <RadioGroup
      value={value}
      onValueChange={(newValue) => onChange({ experience: newValue })}
      className="space-y-4"
    >
      <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <RadioGroupItem value="first-time" />
        <span>I'm a first-time Apple user</span>
      </Label>
      <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <RadioGroupItem value="new-device" />
        <span>New to this specific Apple device</span>
      </Label>
      <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <RadioGroupItem value="switching" />
        <span>Switching from Android or Windows</span>
      </Label>
    </RadioGroup>
  </div>
);
