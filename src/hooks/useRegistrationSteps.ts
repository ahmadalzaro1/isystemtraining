
import { useState } from "react";
import { FormData } from "@/types/registration";
import { toast } from "sonner";

const validateUserType = (data: FormData): boolean => {
  if (!data.userType) {
    toast.error("Please select your user type");
    return false;
  }
  if (data.userType === "switching" && !data.platform) {
    toast.error("Please select the platform you're switching from");
    return false;
  }
  return true;
};

const validateMainTasks = (data: FormData): boolean => {
  if (!data.mainTasks.length) {
    toast.error("Please select at least one main task");
    return false;
  }
  if (data.mainTasks.length > 3) {
    toast.error("Please select no more than 3 main tasks");
    return false;
  }
  return true;
};

const validateLearningPreferences = (data: FormData): boolean => {
  if (!data.learningStyles.length) {
    toast.error("Please select at least one learning style");
    return false;
  }
  return true;
};

const validateTopics = (data: FormData): boolean => {
  if (!data.workshopTopics.length) {
    toast.error("Please select at least one workshop topic");
    return false;
  }
  return true;
};

export const useRegistrationSteps = (onComplete: (data: FormData) => void) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    userType: "first-time",
    mainTasks: [],
    learningStyles: [],
    paidTrainingInterest: "maybe",
    workshopTopics: [],
    name: "",
    email: "",
    phone: "",
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 1:
        return validateUserType(formData);
      case 2:
        return validateMainTasks(formData);
      case 3:
        return validateLearningPreferences(formData);
      case 4:
        return validateTopics(formData);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (step < 4) {
        setStep((s) => s + 1);
      } else {
        onComplete(formData);
      }
    }
  };

  const previousStep = () => {
    setStep((s) => s - 1);
  };

  return {
    step,
    formData,
    updateFormData,
    nextStep,
    previousStep,
  };
};
