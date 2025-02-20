
export type Workshop = {
  id: string;
  name: string;
  date: Date;
  time: string;
  description: string;
  spotsRemaining: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  category: "Mac" | "iPhone" | "Apple Watch" | "AI" | "Digital Safety" | "Creativity" | "Productivity" | "iCloud";
  instructor: string;
};

export type WorkshopFilters = {
  search: string;
  skillLevel: Workshop["skillLevel"] | "All";
  category: Workshop["category"] | "All";
};
