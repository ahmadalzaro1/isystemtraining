import React, { useState, useMemo, useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PersonalInfoStepV2 } from './steps/PersonalInfoStepV2';
import { ContactStepV2 } from './steps/ContactStepV2';
import { PreferencesStepV2 } from './steps/PreferencesStepV2';
import { ReviewStepV2 } from './steps/ReviewStepV2';
import { WizardNavigation } from './components/WizardNavigation';
import { ProgressIndicator } from './components/ProgressIndicator';
import { useAutoSave } from './hooks/useAutoSave';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced V2 schema with consolidated steps
const registrationSchemaV2 = z.object({
  // Personal Info (Step 1)
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  userType: z.enum(['first-time', 'switching', 'experienced'], {
    required_error: 'Please select your experience level',
  }),

  // Contact & Platform (Step 2)
  phone: z.string().min(1, 'Phone number is required').regex(/^07[789]\d{7}$/, 'Please enter a valid Jordanian mobile number (07XXXXXXXX)'),
  contactPreference: z.enum(['email', 'phone', 'sms', 'whatsapp']),
  receiveUpdates: z.boolean().default(true),

  // Preferences (Step 3)
  mainTasks: z.array(z.string()).min(1, 'Please select at least one task'),
  learningStyles: z.array(z.string()).min(1, 'Please select at least one learning style'),
  workshopTopics: z.array(z.object({
    category: z.string(),
    topic: z.string(),
    selected: z.boolean(),
  })),
  otherTopics: z.string().optional(),
  paidTrainingInterest: z.enum(['yes', 'no', 'maybe']),
});

type RegistrationFormDataV2 = z.infer<typeof registrationSchemaV2>;

interface RegistrationWizardV2Props {
  workshop: { id: string; title: string };
  onSubmit: (data: RegistrationFormDataV2 & { workshop_id: string }) => Promise<any>;
  onComplete: (data: any, registration?: any) => void;
}

const STEPS = [
  { id: 'personal', title: 'Personal Info', description: 'Tell us about yourself' },
  { id: 'contact', title: 'Contact & Platform', description: 'How to reach you' },
  { id: 'preferences', title: 'Preferences', description: 'Your learning interests' },
  { id: 'review', title: 'Review & Submit', description: 'Confirm your registration' },
];

export const RegistrationWizardV2: React.FC<RegistrationWizardV2Props> = ({
  workshop,
  onSubmit,
  onComplete,
}) => {
  usePerformanceMonitor('RegistrationWizardV2');
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegistrationFormDataV2>({
    resolver: zodResolver(registrationSchemaV2),
    defaultValues: {
      mainTasks: [],
      learningStyles: [],
      workshopTopics: [],
      receiveUpdates: true,
      paidTrainingInterest: 'maybe' as const,
    },
    mode: 'onChange', // Real-time validation
  });

  // Auto-save functionality
  const { saveData, loadData } = useAutoSave('registration-v2', workshop.id);
  
  React.useEffect(() => {
    const savedData = loadData();
    if (savedData) {
      form.reset(savedData);
    }
  }, [form, loadData]);

  React.useEffect(() => {
    const subscription = form.watch((data) => {
      saveData(data as RegistrationFormDataV2);
    });
    return () => subscription.unsubscribe();
  }, [form, saveData]);

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    return await form.trigger(fieldsToValidate);
  }, [currentStep, form]);

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length - 1) {
      startTransition(() => {
        setCurrentStep(prev => prev + 1);
      });
    }
  }, [validateCurrentStep, currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      startTransition(() => {
        setCurrentStep(prev => prev - 1);
      });
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async (data: RegistrationFormDataV2) => {
    setIsSubmitting(true);
    try {
      const registration = await onSubmit({ ...data, workshop_id: workshop.id });
      // Clear auto-saved data on successful submission
      localStorage.removeItem(`registration-v2-${workshop.id}`);
      onComplete(data, registration);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, workshop.id, onComplete]);

  const slideAnimation = useMemo(() => {
    if (prefersReducedMotion) return {};
    return {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { 
        duration: 0.3, 
        ease: 'easeInOut'
      },
    };
  }, [prefersReducedMotion]);

  const renderCurrentStep = () => {
    const stepProps = {
      form,
      data: form.watch(),
    };

    switch (currentStep) {
      case 0:
        return <PersonalInfoStepV2 {...stepProps} />;
      case 1:
        return <ContactStepV2 {...stepProps} />;
      case 2:
        return <PreferencesStepV2 {...stepProps} />;
      case 3:
        return <ReviewStepV2 {...stepProps} workshop={workshop} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Progress Header */}
      <div className="mb-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-ios-title1 font-sf-pro font-semibold text-text">
            {currentStepData.title}
          </h1>
          <p className="text-ios-body text-text-muted">
            {currentStepData.description}
          </p>
        </div>
        
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={STEPS.length}
          steps={STEPS}
        />
        
        <Progress 
          value={progress} 
          className="h-2 bg-surface-2 rounded-pill"
        />
      </div>

      {/* Main Form Card */}
      <Card className={cn(
        "relative overflow-hidden bg-surface border-0 rounded-3xl p-8",
        "shadow-elev-2 backdrop-blur-md",
        !prefersReducedMotion && "transition-all duration-300 hover:shadow-elev-3"
      )}>
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-aurora-soft opacity-30 pointer-events-none" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="relative">
            <AnimatePresence mode="wait">
              {prefersReducedMotion ? (
                <div key={currentStep} className="min-h-[400px]">
                  {renderCurrentStep()}
                </div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[400px]"
                >
                  {renderCurrentStep()}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </Card>

      {/* Navigation */}
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={STEPS.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={form.handleSubmit(handleSubmit)}
        isSubmitting={isSubmitting || isPending}
        isValid={form.formState.isValid}
      />
    </div>
  );
};

// Helper function to determine which fields to validate for each step
function getFieldsForStep(step: number): (keyof RegistrationFormDataV2)[] {
  switch (step) {
    case 0:
      return ['name', 'email', 'userType'];
    case 1:
      return ['phone', 'contactPreference'];
    case 2:
      return ['mainTasks', 'learningStyles', 'paidTrainingInterest'];
    case 3:
      return []; // Review step - all fields should be valid
    default:
      return [];
  }
}