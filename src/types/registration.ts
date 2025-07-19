
import { Workshop } from "./workshop";
import { WorkshopRegistration } from "@/services/registrationService";

export interface FormData {
  // User Type & Platform
  userType: "first-time" | "switching" | "experienced";
  platformSwitch?: "windows" | "android" | "other";

  // Main Tasks (array of strings)
  mainTasks: string[];

  // Learning Preferences
  learningStyles: string[];

  // Workshop Topics
  workshopTopics: string[];

  // Training Interest
  paidTrainingInterest: "yes" | "no" | "maybe";

  // Contact Details
  name: string;
  email: string;
  phone: string;
  contactPreference: "email" | "phone" | "sms";
  receiveUpdates: boolean;
}

export interface RegistrationFormProps {
  workshop: Workshop;
  onComplete: (data: FormData, registration?: WorkshopRegistration) => void;
}
