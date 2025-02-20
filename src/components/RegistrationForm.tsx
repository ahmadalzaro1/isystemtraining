
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExperienceStep } from "./registration/ExperienceStep";
import { PersonalInfoStep } from "./registration/PersonalInfoStep";
import { DevicesStep } from "./registration/DevicesStep";
import { OccupationStep } from "./registration/OccupationStep";
import { LearningInterestsStep } from "./registration/LearningInterestsStep";
import { RegistrationFormProps } from "@/types/registration";
import { useRegistrationSteps } from "@/hooks/useRegistrationSteps";

export const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const { step, formData, updateFormData, nextStep, previousStep } = useRegistrationSteps(onComplete);

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
      title: "Your Occupation",
      description: "Tell us about your professional background",
      content: (
        <OccupationStep
          value={formData.occupation}
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
    {
      title: "Learning Interests",
      description: "What would you like to learn about in future workshops?",
      content: (
        <LearningInterestsStep
          interests={formData.learningInterests}
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

      {/* Progress Steps */}
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

      <Card className="p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          {currentStep.content}
        </div>
      </Card>

      <div className="flex justify-between">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={previousStep}
            className="animate-fade-up"
          >
            Back
          </Button>
        )}
        <Button
          onClick={nextStep}
          className="ml-auto animate-fade-up"
        >
          {step === steps.length ? "Complete Registration" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default RegistrationForm;
