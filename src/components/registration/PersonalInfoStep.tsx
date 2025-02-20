
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@/types/registration";
import { useState } from "react";

interface PersonalInfoStepProps {
  data: Pick<FormData, "name" | "email" | "phone" | "contactMethod">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  contactMethod?: string;
}

export const PersonalInfoStep = ({ data, onChange, className }: PersonalInfoStepProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters and spaces';
        return undefined;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
        return undefined;

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        // Jordanian phone number validation (7/9 digits after the country code)
        if (!/^((\+962|00962|0)?)(7|9)([0-9]{7})$/.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid Jordanian phone number';
        }
        return undefined;

      case 'contactMethod':
        if (!value) return 'Please select a contact method';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof ValidationErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, data[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof ValidationErrors, value: string) => {
    onChange({ [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  return (
    <div className={`space-y-4 animate-fade-up ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center justify-between">
          <span>Full Name</span>
          {touched.name && errors.name && (
            <span className="text-xs text-destructive">{errors.name}</span>
          )}
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={`w-full ${touched.name && errors.name ? 'border-destructive' : ''}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center justify-between">
          <span>Email</span>
          {touched.email && errors.email && (
            <span className="text-xs text-destructive">{errors.email}</span>
          )}
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`w-full ${touched.email && errors.email ? 'border-destructive' : ''}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center justify-between">
          <span>Phone Number</span>
          {touched.phone && errors.phone && (
            <span className="text-xs text-destructive">{errors.phone}</span>
          )}
        </Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          className={`w-full ${touched.phone && errors.phone ? 'border-destructive' : ''}`}
          placeholder="e.g., 0790000000"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center justify-between">
          <span>Preferred Contact Method</span>
          {touched.contactMethod && errors.contactMethod && (
            <span className="text-xs text-destructive">{errors.contactMethod}</span>
          )}
        </Label>
        <RadioGroup
          value={data.contactMethod}
          onValueChange={(value) => handleChange('contactMethod', value)}
          className="flex gap-4"
          onBlur={() => handleBlur('contactMethod')}
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
};
