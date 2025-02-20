
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExperienceStep } from "./registration/ExperienceStep";
import { PersonalInfoStep } from "./registration/PersonalInfoStep";
import { DevicesStep } from "./registration/DevicesStep";
import { FormData, RegistrationFormProps } from "@/types/registration";

export const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    experience: "",
    name: "",
    email: "",
    phone: "",
    contactMethod: "",
    occupation: "",
    devices: [],
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const steps = [
    {
      title: "Experience Level",
      description: "Tell us about your experience with Apple products",
      content: (
        <ExperienceStep
          value={formData.experience}
          onChange={(value) => updateFormData({ experience: value })}
        />
      ),
    },
    {
      title: "Personal Information",
      description: "Enter your contact details",
      content: (
        <PersonalInfoStep
          data={formData}
          onChange={updateFormData}
        />
      ),
    },
    {
      title: "Your Devices",
      description: "Select the Apple devices you own",
      content: (
        <DevicesStep
          devices={formData.devices}
          onChange={updateFormData}
        />
      ),
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">
          {currentStep.title}
        </h2>
        <p className="text-gray-600">{currentStep.description}</p>
      </div>

      <div className="flex space-x-4 overflow-hidden">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index + 1 <= step ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <Card className="p-6">{currentStep.content}</Card>

      <div className="flex justify-between">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="animate-fade-up"
          >
            Back
          </Button>
        )}
        <Button
          onClick={() => {
            if (step < steps.length) {
              setStep((s) => s + 1);
            } else {
              onComplete(formData);
            }
          }}
          className="ml-auto animate-fade-up"
        >
          {step === steps.length ? "Complete Registration" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default RegistrationForm;
