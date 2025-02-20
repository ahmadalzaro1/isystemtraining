
// User Types
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

// Contact & Preferences
export type ContactPreference = "email" | "sms" | "whatsapp";
export type PaidInterest = "yes" | "maybe" | "no";

export interface FormData {
  // User Type & Platform
  userType: UserType;
  platformSwitch?: PlatformType;
  
  // Main Tasks
  mainTasks: TaskType[];
  
  // Learning Preferences
  learningStyles: LearningStyle[];
  
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
  workshop: any; // Adding the workshop prop to the interface
  onComplete: (data: FormData) => void;
}
