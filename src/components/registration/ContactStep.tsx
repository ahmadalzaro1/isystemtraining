
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, ContactPreference, PaidInterest } from "@/types/registration";
import { cn } from "@/lib/utils";
import { validateEmail, validatePhone, validateName } from "@/utils/inputValidation";
import { useState } from "react";

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof FormData, value: any) => {
    onChange({ [field]: value });
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Validate on change
    let validation;
    switch (field) {
      case 'name':
        validation = validateName(value, 'Full name');
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'phone':
        validation = validatePhone(value);
        break;
    }
    
    if (validation && !validation.isValid && value.trim()) {
      setValidationErrors(prev => ({ ...prev, [field]: validation.error! }));
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="Enter your full name"
          className={validationErrors.name ? 'border-red-500' : ''}
        />
        {validationErrors.name && (
          <p className="text-sm text-red-600">{validationErrors.name}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          placeholder="Enter your email address"
          className={validationErrors.email ? 'border-red-500' : ''}
        />
        {validationErrors.email && (
          <p className="text-sm text-red-600">{validationErrors.email}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
          placeholder="Enter your Jordanian phone number (e.g., 07XXXXXXXX)"
          className={validationErrors.phone ? 'border-red-500' : ''}
        />
        {validationErrors.phone && (
          <p className="text-sm text-red-600">{validationErrors.phone}</p>
        )}
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
              className="flex items-center gap-3 p-4 bg-surface2 border border-[hsl(var(--border))] rounded-xl shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus"
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
              className="flex items-center gap-3 p-4 bg-surface2 border border-[hsl(var(--border))] rounded-xl shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus"
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
