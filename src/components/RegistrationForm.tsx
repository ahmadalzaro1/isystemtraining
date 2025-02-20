
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExperienceStep } from "./registration/ExperienceStep";
import { PersonalInfoStep } from "./registration/PersonalInfoStep";
import { DevicesStep } from "./registration/DevicesStep";
import { OccupationStep } from "./registration/OccupationStep";
import { LearningInterestsStep } from "./registration/LearningInterestsStep";
import { RegistrationFormProps, FormData } from "@/types/registration";
import { useRegistrationSteps } from "@/hooks/useRegistrationSteps";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type StepComponent = {
  id: string;
  title: string;
  description: string;
  Component: React.ComponentType<any>;
  showIf?: (experience: string) => boolean;
};

const REGISTRATION_STEPS: StepComponent[] = [
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
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeSteps = REGISTRATION_STEPS.filter(stepConfig => 
    !stepConfig.showIf || stepConfig.showIf(formData.experience)
  );

  const currentStepIndex = Math.min(step - 1, activeSteps.length - 1);
  const currentStep = activeSteps[currentStepIndex];

  useEffect(() => {
    setProgress((currentStepIndex / (activeSteps.length - 1)) * 100);
  }, [currentStepIndex, activeSteps.length]);

  const handleTransition = async (direction: 'next' | 'previous') => {
    setIsTransitioning(true);
    if (direction === 'next') {
      nextStep();
    } else {
      previousStep();
    }
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (!currentStep) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 px-4 sm:px-6 md:space-y-8">
        <Card className="p-4 sm:p-6">
          <p className="text-center text-red-600">
            Error loading registration form. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    const { id } = currentStep;
    const stepClassName = `space-y-4 animate-fade-up transition-all duration-300 ${
      isTransitioning ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
    }`;
    
    switch (id) {
      case 'experience':
        return (
          <ExperienceStep 
            value={formData.experience}
            onChange={updateFormData}
            className={stepClassName}
          />
        );
      case 'personal':
        return (
          <PersonalInfoStep 
            data={formData}
            onChange={updateFormData}
          />
        );
      case 'occupation':
        return (
          <OccupationStep 
            value={formData.occupation}
            onChange={updateFormData}
            className={stepClassName}
          />
        );
      case 'devices':
        return (
          <DevicesStep 
            devices={formData.devices}
            onChange={updateFormData}
          />
        );
      case 'interests':
        return (
          <LearningInterestsStep 
            interests={formData.learningInterests}
            onChange={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4 sm:px-6 md:space-y-8">
      <div className="space-y-4">
        <div className={`space-y-2 text-center sm:text-left transition-all duration-300 ${
          isTransitioning ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight">
            {currentStep.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {currentStep.description}
          </p>
        </div>

        <Progress 
          value={progress} 
          className="h-1 bg-gray-100 transition-all duration-500"
        />
      </div>

      <div className="flex space-x-2 sm:space-x-4 overflow-hidden">
        {activeSteps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              index <= currentStepIndex ? "bg-primary scale-100" : "bg-gray-200 scale-95"
            }`}
          />
        ))}
      </div>

      <Card className="p-4 sm:p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
        <div className="relative registration-step">
          {renderStepContent()}
        </div>
      </Card>

      <div className="flex justify-between gap-4 pb-8">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => handleTransition('previous')}
            className="flex-1 sm:flex-none animate-fade-up transition-all duration-300 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Back
          </Button>
        )}
        <Button
          onClick={() => handleTransition('next')}
          className={`flex-1 sm:flex-none animate-fade-up transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
            step === 1 ? "w-full" : "ml-auto"
          }`}
        >
          {step === activeSteps.length ? "Complete Registration" : "Continue"}
        </Button>
      </div>

      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      </div>
    </div>
  );
};

export default RegistrationForm;
