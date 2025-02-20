
import { Workshop } from "@/types/workshop";
import { addDays, startOfWeek } from "date-fns";

// Get start of current week for reference
const thisWeekStart = startOfWeek(new Date());

export const mockWorkshops: Workshop[] = [
  {
    id: "1",
    name: "MacBook Mastery 101",
    date: addDays(thisWeekStart, 1),
    time: "10:00 AM",
    description: "Learn essential macOS shortcuts & optimizations for power users",
    spotsRemaining: 8,
    skillLevel: "Beginner",
    category: "Productivity"
  },
  {
    id: "2",
    name: "iPhone Pro Tips",
    date: addDays(thisWeekStart, 1),
    time: "2:00 PM",
    description: "Optimize your iPhone for maximum efficiency & security",
    spotsRemaining: 6,
    skillLevel: "Intermediate",
    category: "Productivity"
  },
  {
    id: "3",
    name: "Switching from Windows?",
    date: addDays(thisWeekStart, 2),
    time: "11:00 AM",
    description: "Making the transition to macOS smooth and painless",
    spotsRemaining: 10,
    skillLevel: "Intermediate",
    category: "Productivity"
  },
  {
    id: "4",
    name: "Privacy & Security",
    date: addDays(thisWeekStart, 2),
    time: "3:00 PM",
    description: "Protect your data like a pro on all Apple devices",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "Privacy & Security"
  },
  {
    id: "5",
    name: "Mastering iCloud",
    date: addDays(thisWeekStart, 3),
    time: "10:00 AM",
    description: "Sync, share, and back up with confidence across devices",
    spotsRemaining: 5,
    skillLevel: "Beginner",
    category: "Productivity"
  },
  {
    id: "6",
    name: "Business Productivity",
    date: addDays(thisWeekStart, 3),
    time: "2:00 PM",
    description: "Essential Apple tools and workflows for business success",
    spotsRemaining: 4,
    skillLevel: "Intermediate",
    category: "Business & Enterprise"
  },
  {
    id: "7",
    name: "Pro Apps Training",
    date: addDays(thisWeekStart, 4),
    time: "11:00 AM",
    description: "Get started with Final Cut Pro & Logic Pro",
    spotsRemaining: 6,
    skillLevel: "Advanced",
    category: "Creativity"
  },
  {
    id: "8",
    name: "Apple Ecosystem",
    date: addDays(thisWeekStart, 4),
    time: "3:00 PM",
    description: "Seamlessly integrate Mac, iPad, iPhone & Watch",
    spotsRemaining: 8,
    skillLevel: "Advanced",
    category: "Productivity"
  },
  {
    id: "9",
    name: "Maintenance Mastery",
    date: addDays(thisWeekStart, 5),
    time: "10:00 AM",
    description: "Keep your Apple devices running like new",
    spotsRemaining: 9,
    skillLevel: "Beginner",
    category: "Productivity"
  },
];
