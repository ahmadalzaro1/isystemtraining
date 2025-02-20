
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
export type WorkshopCategory =
  | "fundamentals"
  | "productivity"
  | "creativity"
  | "security"
  | "cloud"
  | "ai"
  | "business"
  | "advanced"
  | "home";

export type WorkshopTopic = {
  category: WorkshopCategory;
  topic: string;
  selected: boolean;
};

// System & App Types
export type Frustration = 
  | "battery" 
  | "complexity" 
  | "syncing" 
  | "customization" 
  | "compatibility" 
  | "other";

// Contact & Preferences
export type ContactPreference = "email" | "sms" | "whatsapp";
export type PaidInterest = "yes" | "maybe" | "no";

export interface FormData {
  // User Type
  userType: UserType;
  platformSwitch?: PlatformType;
  
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
  contactPreference: ContactPreference;
  receiveUpdates: boolean;
}

export interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
}
