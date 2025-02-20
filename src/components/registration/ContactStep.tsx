
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, ContactPreference, PaidInterest } from "@/types/registration";
import { cn } from "@/lib/utils";

interface ContactStepProps {
  data: Pick<FormData, "name" | "email" | "phone" | "receiveUpdates" | "contactPreference" | "paidTrainingInterest">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const CONTACT_PREFERENCES: { value: ContactPreference; label: string; icon: string }[] = [
  { value: "email", label: "Email", icon: "📩" },
  { value: "sms", label: "SMS", icon: "📲" },
  { value: "whatsapp", label: "WhatsApp", icon: "📱" },
];

const PAID_INTEREST: { value: PaidInterest; label: string }[] = [
  { value: "yes", label: "Yes, definitely" },
  { value: "maybe", label: "Maybe, if it's worth it" },
  { value: "no", label: "No, I just want free training" },
];

export const ContactStep = ({ data, onChange, className }: ContactStepProps) => {
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
          placeholder="Enter your Jordanian phone number"
        />
      </div>

      <div className="space-y-4">
        <Label>How would you like to receive updates?</Label>
        <RadioGroup
          value={data.contactPreference}
          onValueChange={(value: ContactPreference) => onChange({ contactPreference: value })}
          className="space-y-3"
        >
          {CONTACT_PREFERENCES.map((pref) => (
            <Label
              key={pref.value}
              className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value={pref.value} />
              <div className="flex items-center gap-2">
                <span>{pref.icon}</span>
                <span>{pref.label}</span>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center space-x-2">
          <Checkbox
            checked={data.receiveUpdates}
            onCheckedChange={(checked) => onChange({ receiveUpdates: checked as boolean })}
          />
          <span>I'd like to receive exclusive iSystem updates, tips & invites</span>
        </Label>
      </div>

      <div className="space-y-4">
        <Label>Would you be interested in advanced, paid Apple training?</Label>
        <RadioGroup
          value={data.paidTrainingInterest}
          onValueChange={(value: PaidInterest) => onChange({ paidTrainingInterest: value })}
          className="space-y-3"
        >
          {PAID_INTEREST.map((option) => (
            <Label
              key={option.value}
              className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value={option.value} />
              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
