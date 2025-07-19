
import { Card } from "@/components/ui/card";
import { RegistrationFormProps, FormData } from "@/types/registration";
import { useRegistrationSteps } from "@/hooks/useRegistrationSteps";
import { useState, memo, useMemo } from "react";
import { REGISTRATION_STEPS } from "./registration/config/steps";
import { StepHeader } from "./registration/StepHeader";
import { RegistrationProgress } from "./registration/RegistrationProgress";
import { RegistrationNavigation } from "./registration/RegistrationNavigation";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RegistrationService } from "@/services/registrationService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const RegistrationForm = memo(({ workshop, onComplete }: RegistrationFormProps) => {
  usePerformanceMonitor('RegistrationForm');
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  
  const handleRegistrationComplete = async (formData: FormData) => {
    try {
      const registration = await RegistrationService.createRegistration({
        workshop_id: workshop.id,
        formData,
        user_id: user?.id,
      });

      console.log('Registration created:', registration);
      
      toast.success("Registration successful!", {
        description: `Confirmation code: ${registration.confirmation_code}`,
      });

      onComplete(formData, registration);
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error("Registration failed", {
        description: "Please try again or contact support.",
      });
    }
  };

  const { step, formData, updateFormData, nextStep, previousStep } = useRegistrationSteps(handleRegistrationComplete);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentStepIndex = Math.min(step - 1, REGISTRATION_STEPS.length - 1);
  const currentStep = useMemo(() => REGISTRATION_STEPS[currentStepIndex], [currentStepIndex]);

  const handleTransition = async (direction: 'next' | 'previous') => {
    if (!prefersReducedMotion) {
      setIsTransitioning(true);
    }
    
    if (direction === 'next') {
      nextStep();
    } else {
      previousStep();
    }
    
    if (!prefersReducedMotion) {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  if (!currentStep) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 px-4 sm:px-6 md:space-y-8">
        <Card className="p-4 sm:p-6">
          <p className="text-center text-destructive" role="alert">
            Error loading registration form. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  const { Component } = currentStep;
  const stepClassName = useMemo(() => {
    const baseClasses = "space-y-4";
    if (prefersReducedMotion) {
      return baseClasses;
    }
    return `${baseClasses} animate-fade-up transition-all duration-300 ${
      isTransitioning ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
    }`;
  }, [isTransitioning, prefersReducedMotion]);

  return (
    <section 
      className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-6"
      aria-labelledby="registration-title"
      role="main"
    >
      <header className="space-y-4">
        <StepHeader 
          title={currentStep.title}
          description={currentStep.description}
          isTransitioning={isTransitioning}
        />
        <RegistrationProgress 
          currentStepIndex={currentStepIndex}
          totalSteps={REGISTRATION_STEPS.length}
          isTransitioning={isTransitioning}
        />
      </header>

      <Card 
        className={`p-4 sm:p-6 relative overflow-hidden ${
          prefersReducedMotion ? '' : 'transition-all duration-300 hover:shadow-lg'
        }`}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" aria-hidden="true" />
        <div className="relative">
          <Component 
            data={formData}
            onChange={updateFormData}
            className={stepClassName}
          />
        </div>
      </Card>

      <RegistrationNavigation 
        currentStep={step}
        totalSteps={REGISTRATION_STEPS.length}
        onNext={() => handleTransition('next')}
        onPrevious={() => handleTransition('previous')}
      />

      {!prefersReducedMotion && (
        <div 
          className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
        </div>
      )}
    </section>
  );
});

RegistrationForm.displayName = 'RegistrationForm';

export default RegistrationForm;
