
import { useState } from "react";
import { FormData } from "@/types/registration";
import { toast } from "sonner";

const validatePersonalInfo = (data: FormData): boolean => {
  // Name validation
  if (!data.name.trim() || data.name.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(data.name.trim())) {
    toast.error("Please enter a valid name");
    return false;
  }

  // Email validation
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    toast.error("Please enter a valid email address");
    return false;
  }

  // Jordanian phone number validation
  if (!data.phone.trim() || !/^((\+962|00962|0)?)(7|9)([0-9]{7})$/.test(data.phone.replace(/\s/g, ''))) {
    toast.error("Please enter a valid Jordanian phone number");
    return false;
  }

  // Contact method validation
  if (!data.contactMethod) {
    toast.error("Please select a preferred contact method");
    return false;
  }

  return true;
};

const validateExperience = (data: FormData): boolean => {
  if (!data.experience) {
    toast.error("Please select your experience level");
    return false;
  }
  return true;
};

const validateOccupation = (data: FormData): boolean => {
  if (!data.occupation) {
    toast.error("Please select your occupation");
    return false;
  }
  return true;
};

const validateDevices = (data: FormData): boolean => {
  if (!data.devices.length) {
    toast.error("Please select at least one device");
    return false;
  }
  return true;
};

const validateInterests = (data: FormData): boolean => {
  if (!data.learningInterests.length) {
    toast.error("Please select at least one learning interest");
    return false;
  }
  return true;
};

export const useRegistrationSteps = (onComplete: (data: FormData) => void) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    experience: "",
    name: "",
    email: "",
    phone: "",
    contactMethod: "",
    occupation: "",
    devices: [],
    learningInterests: [],
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 1:
        return validateExperience(formData);
      case 2:
        return validatePersonalInfo(formData);
      case 3:
        return validateOccupation(formData);
      case 4:
        return validateDevices(formData);
      case 5:
        return validateInterests(formData);
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
