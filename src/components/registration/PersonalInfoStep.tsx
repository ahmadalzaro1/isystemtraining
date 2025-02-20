
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@/types/registration";

interface PersonalInfoStepProps {
  data: Pick<FormData, "name" | "email" | "phone" | "contactMethod">;
  onChange: (data: Partial<FormData>) => void;
}

export const PersonalInfoStep = ({ data, onChange }: PersonalInfoStepProps) => (
  <div className="space-y-4 animate-fade-up">
    <div className="space-y-2">
      <Label htmlFor="name">Full Name</Label>
      <Input
        id="name"
        value={data.name}
        onChange={(e) => onChange({ name: e.target.value })}
        className="w-full"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
        className="w-full"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <Input
        id="phone"
        type="tel"
        value={data.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
        className="w-full"
      />
    </div>
    <div className="space-y-2">
      <Label>Preferred Contact Method</Label>
      <RadioGroup
        value={data.contactMethod}
        onValueChange={(value) => onChange({ contactMethod: value })}
        className="flex gap-4"
      >
        {["WhatsApp", "SMS", "Email"].map((method) => (
          <Label
            key={method}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <RadioGroupItem value={method.toLowerCase()} />
            <span>{method}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  </div>
);
