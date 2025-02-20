
import { useState } from "react";
import { FormData } from "@/types/registration";

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

  const nextStep = () => {
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      onComplete(formData);
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
