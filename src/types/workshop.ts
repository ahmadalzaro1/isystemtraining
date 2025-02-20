
export type Workshop = {
  id: string;
  name: string;
  date: Date;
  time: string;
  description: string;
  spotsRemaining: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  category: "Productivity" | "Creativity" | "Privacy & Security" | "Business & Enterprise";
};

export type WorkshopFilters = {
  search: string;
  skillLevel: Workshop["skillLevel"] | "All";
  category: Workshop["category"] | "All";
};
