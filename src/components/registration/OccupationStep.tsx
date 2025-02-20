
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FormData } from "@/types/registration";

interface OccupationStepProps {
  value: string;
  onChange: (data: Partial<FormData>) => void;
}

const OCCUPATIONS = [
  "Student",
  "Creative Professional",
  "Business Owner",
  "Developer",
  "Freelancer",
  "Corporate Employee",
  "Other",
];

export const OccupationStep = ({ value, onChange }: OccupationStepProps) => {
  const [showCustom, setShowCustom] = useState(value !== "" && !OCCUPATIONS.includes(value));

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="space-y-2">
        <Label>Select your occupation</Label>
        <Select
          value={OCCUPATIONS.includes(value) ? value : "Other"}
          onValueChange={(newValue) => {
            if (newValue === "Other") {
              setShowCustom(true);
              onChange({ occupation: "" });
            } else {
              setShowCustom(false);
              onChange({ occupation: newValue });
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your occupation" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {OCCUPATIONS.map((occupation) => (
                <SelectItem key={occupation} value={occupation}>
                  {occupation}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {showCustom && (
        <div className="space-y-2 animate-fade-up">
          <Label>Please specify your occupation</Label>
          <Input
            value={value}
            onChange={(e) => onChange({ occupation: e.target.value })}
            placeholder="Enter your occupation"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
