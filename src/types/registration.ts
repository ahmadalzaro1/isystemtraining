
import { Workshop } from "./workshop";
import { WorkshopRegistration } from "@/services/registrationService";

// Type definitions
export type UserType = "first-time" | "switching" | "experienced";
export type PlatformType = "windows" | "android" | "linux" | "other";
export type TaskType = "email" | "communication" | "productivity" | "creative" | "coding" | "privacy" | "social" | "ai" | "creativity" | "entertainment" | "business" | "education";
export type LearningStyle = "videos" | "guides" | "hands-on" | "qa";
export type ContactPreference = "email" | "phone" | "sms" | "whatsapp";
export type PaidInterest = "yes" | "no" | "maybe";
export interface WorkshopTopic {
  category: WorkshopCategory;
  topic: string;
  selected: boolean;
}

export type WorkshopCategory = "fundamentals" | "productivity" | "creativity" | "creative" | "security" | "cloud" | "ai" | "home" | "essentials" | "advanced" | "business" | "digital-art";

export interface FormData {
  // User Type & Platform
  userType: UserType;
  platformSwitch?: PlatformType;

  // Main Tasks (array of strings)
  mainTasks: string[];

  // Learning Preferences
  learningStyles: string[];

  // Workshop Topics
  workshopTopics: WorkshopTopic[];
  otherTopics?: string;

  // Training Interest
  paidTrainingInterest: PaidInterest;

  // Contact Details
  name: string;
  email: string;
  phone: string;
  contactPreference: ContactPreference;
  receiveUpdates: boolean;
}

export interface RegistrationFormProps {
  workshop: Workshop;
  onComplete: (data: FormData, registration?: WorkshopRegistration) => void;
}
