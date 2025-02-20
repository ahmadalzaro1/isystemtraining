
// User Types
export type UserType = "first-time" | "existing" | "switching";
export type PlatformType = "windows" | "android" | "linux" | "other";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type DeviceType = "Mac" | "iPhone" | "iPad" | "Apple Watch" | "Apple TV" | "AirPods";
export type TaskType = 
  | "email" 
  | "business" 
  | "creative" 
  | "coding" 
  | "privacy" 
  | "social" 
  | "ai";

// Learning Types
export type LearningStyle = "videos" | "guides" | "hands-on" | "qa";
export type LearningInterest = 
  | "basics" 
  | "productivity" 
  | "creativity" 
  | "security" 
  | "business" 
  | "ai" 
  | "icloud";
export type PrimaryUse = "work" | "study" | "creativity" | "personal" | "home";

// System & App Types
export type Frustration = 
  | "battery" 
  | "complexity" 
  | "syncing" 
  | "customization" 
  | "compatibility" 
  | "other";
export type AppleApp = 
  | "safari" 
  | "camera" 
  | "notes" 
  | "pro-apps" 
  | "ai-features" 
  | "apple-pay";

// Contact & Preferences
export type ContactPreference = "email" | "sms" | "whatsapp";
export type PaidInterest = "yes" | "maybe" | "no";
export type Occupation = 
  | "student"
  | "professional"
  | "entrepreneur"
  | "creative"
  | "developer"
  | "other";

// Workshop Topics
export type WorkshopTopic =
  | "basics"
  | "productivity"
  | "creativity"
  | "security"
  | "business"
  | "ai"
  | "icloud";

export interface FormData {
  // Basic Profile
  isFirstTime: boolean;
  devices: DeviceType[];
  experienceLevel: ExperienceLevel;
  occupation: Occupation;
  
  // Platform & Experience
  platformSwitch: PlatformType;
  confidenceLevel: number;
  mainFrustration: Frustration;
  frustrationDetail?: string;
  
  // Learning & Interests
  mainTasks: TaskType[];
  learningInterests: LearningInterest[];
  learningStyles: LearningStyle[];
  primaryUse: PrimaryUse;
  appsToLearn: AppleApp[];
  
  // Workshop & Training
  paidTrainingInterest: PaidInterest;
  workshopTopics: WorkshopTopic[];
  otherTopics?: string;
  
  // Contact Details
  name: string;
  email: string;
  phone: string;
  contactPreference: ContactPreference;
  receiveUpdates: boolean;
}

export interface Workshop {
  id: string;
  name: string;
  title: string;
  description: string;
  topic: WorkshopTopic;
  date: Date;
  time: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  location: string;
  instructor: string;
}

export interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
}
