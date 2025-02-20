
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ExperienceStepProps {
  value: string;
  onChange: (value: string) => void;
}

export const ExperienceStep = ({ value, onChange }: ExperienceStepProps) => (
  <div className="space-y-4 animate-fade-up">
    <RadioGroup
      value={value}
      onValueChange={onChange}
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
