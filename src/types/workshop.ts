
export type Workshop = {
  id: string;
  name: string;
  date: Date;
  time: string;
  description: string;
  spotsRemaining: number;
  maxCapacity: number;
  registrationsCount: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  category: "Mac" | "iPhone" | "Apple Watch" | "AI" | "Digital Safety" | "Creativity" | "Productivity" | "iCloud" | "Digital Art on iPad";
  instructor: string;
  location: "iSystem Khalda" | "iSystem Abdoun" | "iSystem Mecca Street" | "iSystem Swefieh" | "iSystem City Mall" | "Mecca Mall - SmartTech" | "Online";
};

export type WorkshopFilters = {
  search: string;
  skillLevel: Workshop["skillLevel"] | "All";
  category: Workshop["category"] | "All";
  location: Workshop["location"] | "All";
};
