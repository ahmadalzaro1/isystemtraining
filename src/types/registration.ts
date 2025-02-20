
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type Platform = "windows" | "android" | "pc" | "always-apple";
export type PrimaryUse = "work" | "study" | "creativity" | "personal" | "home";
export type DeviceType = "Mac" | "iPhone" | "iPad" | "Apple Watch" | "Apple TV" | "AirPods";
export type LearningInterest = 
  | "basics" 
  | "productivity" 
  | "creativity" 
  | "security" 
  | "business" 
  | "ai" 
  | "icloud";
export type AppleApp = 
  | "safari" 
  | "camera" 
  | "notes" 
  | "pro-apps" 
  | "ai-features" 
  | "apple-pay";
export type Frustration = 
  | "battery" 
  | "complexity" 
  | "syncing" 
  | "customization" 
  | "compatibility" 
  | "other";
export type ContactPreference = "email" | "sms" | "whatsapp";
export type PaidInterest = "yes" | "maybe" | "no";

export interface FormData {
  // Basic Profile
  isFirstTime: boolean;
  devices: DeviceType[];
  experienceLevel: ExperienceLevel;
  
  // Platform Switch
  platformSwitch: Platform;
  
  // Learning Needs
  learningInterests: LearningInterest[];
  primaryUse: PrimaryUse;
  
  // Confidence & Pain Points
  confidenceLevel: number;
  mainFrustration: Frustration;
  frustrationDetail?: string;
  appsToLearn: AppleApp[];
  
  // Contact & Engagement
  name: string;
  email: string;
  phone: string;
  receiveUpdates: boolean;
  contactPreference: ContactPreference;
  paidTrainingInterest: PaidInterest;
}

export interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
}
