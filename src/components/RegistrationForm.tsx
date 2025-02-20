
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExperienceStep } from "./registration/ExperienceStep";
import { PersonalInfoStep } from "./registration/PersonalInfoStep";
import { DevicesStep } from "./registration/DevicesStep";
import { OccupationStep } from "./registration/OccupationStep";
import { LearningInterestsStep } from "./registration/LearningInterestsStep";
import { RegistrationFormProps } from "@/types/registration";
import { useRegistrationSteps } from "@/hooks/useRegistrationSteps";

const REGISTRATION_STEPS = [
  {
    id: 'experience',
    title: "Experience Level",
    description: "Tell us about your experience with Apple products",
    Component: ExperienceStep,
  },
  {
    id: 'personal',
    title: "Personal Information",
    description: "Enter your contact details",
    Component: PersonalInfoStep,
  },
  {
    id: 'occupation',
    title: "Your Occupation",
    description: "Tell us about your professional background",
    Component: OccupationStep,
  },
  {
    id: 'devices',
    title: "Your Devices",
    description: "Select the Apple devices you own",
    Component: DevicesStep,
    showIf: (experience: string) => experience !== "first-time",
  },
  {
    id: 'interests',
    title: "Learning Interests",
    description: "What would you like to learn about in future workshops?",
    Component: LearningInterestsStep,
  },
];

export const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const { step, formData, updateFormData, nextStep, previousStep } = useRegistrationSteps(onComplete);

  const activeSteps = REGISTRATION_STEPS.filter(stepConfig => 
    !stepConfig.showIf || stepConfig.showIf(formData.experience)
  );

  const currentStep = activeSteps[step - 1];

  const renderStepContent = () => {
    const { Component, id } = currentStep;
    
    switch (id) {
      case 'experience':
        return (
          <Component 
            value={formData.experience} 
            onChange={(value: string) => updateFormData({ experience: value })} 
          />
        );
      
      case 'personal':
        return (
          <Component 
            data={formData} 
            onChange={updateFormData} 
          />
        );
      
      case 'occupation':
        return (
          <Component 
            value={formData.occupation} 
            onChange={(value: string) => updateFormData({ occupation: value })} 
          />
        );
      
      case 'devices':
        return (
          <Component 
            devices={formData.devices} 
            onChange={(data: Partial<{ devices: string[] }>) => updateFormData(data)} 
          />
        );
      
      case 'interests':
        return (
          <Component 
            interests={formData.learningInterests} 
            onChange={(data: Partial<{ learningInterests: string[] }>) => updateFormData(data)} 
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4 sm:px-6 md:space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight">
          {currentStep.title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {currentStep.description}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex space-x-2 sm:space-x-4 overflow-hidden">
        {activeSteps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index + 1 <= step ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <Card className="p-4 sm:p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          {renderStepContent()}
        </div>
      </Card>

      <div className="flex justify-between gap-4 pb-8">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={previousStep}
            className="flex-1 sm:flex-none animate-fade-up"
          >
            Back
          </Button>
        )}
        <Button
          onClick={nextStep}
          className={`flex-1 sm:flex-none animate-fade-up ${
            step === 1 ? "w-full" : "ml-auto"
          }`}
        >
          {step === activeSteps.length ? "Complete Registration" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default RegistrationForm;
