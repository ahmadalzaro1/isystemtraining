
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/registration";

interface PersonalInfoStepProps {
  data: Pick<FormData, "name" | "email" | "phone">;
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
  </div>
);
