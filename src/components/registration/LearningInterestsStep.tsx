
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FormData } from "@/types/registration";

interface LearningInterestsStepProps {
  interests: string[];
  onChange: (data: Partial<FormData>) => void;
}

const LEARNING_TOPICS = [
  "Optimizing macOS for Productivity",
  "Mastering iCloud & Apple Services",
  "Pro Apps (Final Cut Pro, Logic Pro, etc.)",
  "Privacy & Security Features",
  "Apple Ecosystem Integration",
];

export const LearningInterestsStep = ({ interests, onChange }: LearningInterestsStepProps) => {
  const [customInterest, setCustomInterest] = useState("");

  const handleInterestToggle = (interest: string) => {
    const updatedInterests = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    onChange({ learningInterests: updatedInterests });
  };

  const handleAddCustomInterest = () => {
    if (customInterest && !interests.includes(customInterest)) {
      onChange({ learningInterests: [...interests, customInterest] });
      setCustomInterest("");
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-4">
        {LEARNING_TOPICS.map((topic) => (
          <label
            key={topic}
            className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Checkbox
              checked={interests.includes(topic)}
              onCheckedChange={() => handleInterestToggle(topic)}
            />
            <span className="text-sm">{topic}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Add other interests</Label>
        <div className="flex gap-2">
          <Input
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            placeholder="Enter another learning interest"
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddCustomInterest();
              }
            }}
          />
          <button
            onClick={handleAddCustomInterest}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {interests.length > 0 && (
        <div className="space-y-2">
          <Label>Your selected interests:</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
              >
                {interest}
                <button
                  onClick={() => handleInterestToggle(interest)}
                  className="hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
