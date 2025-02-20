
import { Card } from "@/components/ui/card";
import { RegistrationFormProps, FormData } from "@/types/registration";
import { useRegistrationSteps } from "@/hooks/useRegistrationSteps";
import { useState } from "react";
import { REGISTRATION_STEPS } from "./config/steps";
import { StepHeader } from "./StepHeader";
import { RegistrationProgress } from "./RegistrationProgress";
import { RegistrationNavigation } from "./RegistrationNavigation";

export const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const { step, formData, updateFormData, nextStep, previousStep } = useRegistrationSteps(onComplete);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeSteps = REGISTRATION_STEPS.filter(stepConfig => 
    !stepConfig.showIf || stepConfig.showIf(formData.experience)
  );

  const currentStepIndex = Math.min(step - 1, activeSteps.length - 1);
  const currentStep = activeSteps[currentStepIndex];

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
      <div className="w-full max-w-[390px] mx-auto px-4">
        <Card className="apple-card p-4">
          <p className="text-center text-red-600 apple-body">
            Error loading registration form. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    const { id, Component } = currentStep;
    const stepClassName = `space-y-4 slide-in ${
      isTransitioning ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
    }`;
    
    const commonProps = {
      onChange: updateFormData,
      className: stepClassName,
    };

    switch (id) {
      case 'experience':
        return <Component value={formData.experience} {...commonProps} />;
      case 'personal':
        return <Component data={formData} {...commonProps} />;
      case 'occupation':
        return <Component value={formData.occupation} {...commonProps} />;
      case 'devices':
        return <Component devices={formData.devices} {...commonProps} />;
      case 'interests':
        return <Component interests={formData.learningInterests} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto space-y-5 px-4">
      <div className="space-y-5">
        <StepHeader 
          title={currentStep.title}
          description={currentStep.description}
          isTransitioning={isTransitioning}
        />
        <RegistrationProgress 
          currentStepIndex={currentStepIndex}
          totalSteps={activeSteps.length}
          isTransitioning={isTransitioning}
        />
      </div>

      <Card className="apple-card p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
        <div className="relative">
          {renderStepContent()}
        </div>
      </Card>

      <RegistrationNavigation 
        currentStep={step}
        totalSteps={activeSteps.length}
        onNext={() => handleTransition('next')}
        onPrevious={() => handleTransition('previous')}
      />

      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 ios-blur" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      </div>
    </div>
  );
};

export default RegistrationForm;
