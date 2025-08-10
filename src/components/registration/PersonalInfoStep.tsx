
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData, ContactPreference } from "@/types/registration";
import { cn } from "@/lib/utils";

interface PersonalInfoStepProps {
  data: Pick<FormData, "name" | "email" | "phone" | "contactPreference">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const CONTACT_PREFERENCES: { value: ContactPreference; label: string; icon: string }[] = [
  { value: "email", label: "Email", icon: "📧" },
  { value: "sms", label: "SMS", icon: "📱" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
];

export const PersonalInfoStep = ({ data, onChange, className }: PersonalInfoStepProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="Enter your email address"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="space-y-4">
        <Label>Preferred Contact Method</Label>
        <RadioGroup
          value={data.contactPreference}
          onValueChange={(value: ContactPreference) => onChange({ contactPreference: value })}
          className="space-y-3"
        >
          {CONTACT_PREFERENCES.map((method) => (
            <Label
              key={method.value}
              className="flex items-center gap-3 p-4 bg-surface2 border border-[hsl(var(--border))] rounded-xl shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus"
            >
              <RadioGroupItem value={method.value} />
              <div className="flex items-center gap-2">
                <span>{method.icon}</span>
                <span>{method.label}</span>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
