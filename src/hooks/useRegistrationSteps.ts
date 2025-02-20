
import { useState } from "react";
import { FormData } from "@/types/registration";
import { toast } from "sonner";

const validateBasicProfile = (data: FormData): boolean => {
  if (typeof data.isFirstTime !== 'boolean') {
    toast.error("Please indicate if you're a first-time Apple user");
    return false;
  }
  if (!data.experienceLevel) {
    toast.error("Please select your experience level");
    return false;
  }
  if (!data.devices.length && !data.isFirstTime) {
    toast.error("Please select at least one device");
    return false;
  }
  return true;
};

const validatePlatform = (data: FormData): boolean => {
  if (!data.platformSwitch) {
    toast.error("Please indicate if you're switching from another platform");
    return false;
  }
  return true;
};

const validateLearning = (data: FormData): boolean => {
  if (!data.learningInterests.length) {
    toast.error("Please select at least one learning interest");
    return false;
  }
  if (!data.primaryUse) {
    toast.error("Please select your primary use case");
    return false;
  }
  return true;
};

const validateConfidence = (data: FormData): boolean => {
  if (!data.confidenceLevel) {
    toast.error("Please indicate your confidence level");
    return false;
  }
  if (!data.mainFrustration) {
    toast.error("Please select your main frustration");
    return false;
  }
  if (!data.appsToLearn.length) {
    toast.error("Please select at least one app you'd like to learn more about");
    return false;
  }
  return true;
};

const validateContact = (data: FormData): boolean => {
  if (!data.name.trim() || data.name.length < 2) {
    toast.error("Please enter your name");
    return false;
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    toast.error("Please enter a valid email address");
    return false;
  }
  if (!data.phone.trim() || !/^((\+962|00962|0)?)(7|9)([0-9]{7})$/.test(data.phone.replace(/\s/g, ''))) {
    toast.error("Please enter a valid Jordanian phone number");
    return false;
  }
  if (!data.contactPreference) {
    toast.error("Please select your preferred contact method");
    return false;
  }
  return true;
};

export const useRegistrationSteps = (onComplete: (data: FormData) => void) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    isFirstTime: false,
    devices: [],
    experienceLevel: "beginner",
    platformSwitch: "always-apple",
    learningInterests: [],
    primaryUse: "personal",
    confidenceLevel: 3,
    mainFrustration: "complexity",
    appsToLearn: [],
    name: "",
    email: "",
    phone: "",
    receiveUpdates: true,
    contactPreference: "email",
    paidTrainingInterest: "maybe",
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 1:
        return validateBasicProfile(formData);
      case 2:
        return validatePlatform(formData);
      case 3:
        return validateLearning(formData);
      case 4:
        return validateConfidence(formData);
      case 5:
        return validateContact(formData);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (step < 5) {
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
