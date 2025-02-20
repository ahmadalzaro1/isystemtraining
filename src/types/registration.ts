
export type UserType = "first-time" | "existing" | "switching";
export type PlatformType = "windows" | "android" | "linux" | "other";
export type TaskType = 
  | "email" 
  | "business" 
  | "creative" 
  | "coding" 
  | "privacy" 
  | "social" 
  | "ai";
export type LearningStyle = 
  | "videos" 
  | "guides" 
  | "hands-on" 
  | "qa";
export type PaidInterest = "yes" | "maybe" | "no";

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
  // User Type & Platform
  userType: UserType;
  platform?: PlatformType;
  
  // Main Tasks
  mainTasks: TaskType[];
  
  // Learning Preferences
  learningStyles: LearningStyle[];
  
  // Training Interest
  paidTrainingInterest: PaidInterest;
  
  // Workshop Topics
  workshopTopics: WorkshopTopic[];
  otherTopics?: string;
  
  // Contact Details
  name: string;
  email: string;
  phone: string;
}

export interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
}
