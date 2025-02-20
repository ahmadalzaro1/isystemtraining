
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

// Workshop Topics
export type WorkshopTopic = 
  | "mac-basics" 
  | "ios-setup" 
  | "watch-features"
  | "multitasking" 
  | "shortcuts" 
  | "time-management"
  | "productivity-apps"
  | "photo-editing"
  | "video-editing"
  | "music-production"
  | "digital-art"
  | "security"
  | "passwords"
  | "safe-browsing"
  | "data-protection"
  | "icloud"
  | "handoff"
  | "family-sharing"
  | "siri"
  | "ai-apps"
  | "voice-dictation"
  | "business-apps"
  | "email-calendar"
  | "remote-work"
  | "business-tools"
  | "terminal"
  | "performance"
  | "beta-features"
  | "homekit"
  | "apple-tv"
  | "integration";

export interface FormData {
  // Basic Profile
  isFirstTime: boolean;
  devices: DeviceType[];
  experienceLevel: ExperienceLevel;
  
  // Platform & Experience
  platformSwitch: string;
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
  title: string;
  description: string;
  topic: WorkshopTopic;
  date: string;
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
