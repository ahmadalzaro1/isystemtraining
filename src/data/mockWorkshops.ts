
import { Workshop } from "@/types/workshop";
import { addDays, addWeeks, startOfWeek } from "date-fns";

// Get start of current week for reference
const thisWeekStart = startOfWeek(new Date());

export const mockWorkshops: Workshop[] = [
  // Current Week
  {
    id: "1",
    name: "MacBook Mastery 101",
    date: addDays(thisWeekStart, 0), // Sunday
    time: "10:00 AM",
    description: "Learn essential macOS shortcuts & optimizations for power users",
    spotsRemaining: 8,
    skillLevel: "Beginner",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "2",
    name: "iPhone Pro Tips",
    date: addDays(thisWeekStart, 2), // Tuesday
    time: "2:00 PM",
    description: "Optimize your iPhone for maximum efficiency & security",
    spotsRemaining: 6,
    skillLevel: "Intermediate",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "3",
    name: "Privacy & Security",
    date: addDays(thisWeekStart, 4), // Thursday
    time: "3:00 PM",
    description: "Protect your data like a pro on all Apple devices",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "Privacy & Security",
    instructor: "Ahmad Alzaro"
  },

  // Next Week
  {
    id: "4",
    name: "Mastering iCloud",
    date: addDays(addWeeks(thisWeekStart, 1), 0), // Sunday
    time: "10:00 AM",
    description: "Sync, share, and back up with confidence across devices",
    spotsRemaining: 5,
    skillLevel: "Beginner",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "5",
    name: "Business Productivity",
    date: addDays(addWeeks(thisWeekStart, 1), 2), // Tuesday
    time: "2:00 PM",
    description: "Essential Apple tools and workflows for business success",
    spotsRemaining: 4,
    skillLevel: "Intermediate",
    category: "Business & Enterprise",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "6",
    name: "Pro Apps Training",
    date: addDays(addWeeks(thisWeekStart, 1), 4), // Thursday
    time: "11:00 AM",
    description: "Get started with Final Cut Pro & Logic Pro",
    spotsRemaining: 6,
    skillLevel: "Advanced",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },

  // Week 3
  {
    id: "7",
    name: "Apple Ecosystem",
    date: addDays(addWeeks(thisWeekStart, 2), 0), // Sunday
    time: "3:00 PM",
    description: "Seamlessly integrate Mac, iPad, iPhone & Watch",
    spotsRemaining: 8,
    skillLevel: "Advanced",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "8",
    name: "Maintenance Mastery",
    date: addDays(addWeeks(thisWeekStart, 2), 2), // Tuesday
    time: "10:00 AM",
    description: "Keep your Apple devices running like new",
    spotsRemaining: 9,
    skillLevel: "Beginner",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "9",
    name: "Creative Pro Workshop",
    date: addDays(addWeeks(thisWeekStart, 2), 4), // Thursday
    time: "2:00 PM",
    description: "Master creative workflows on your Mac",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },

  // Week 4
  {
    id: "10",
    name: "Enterprise Security",
    date: addDays(addWeeks(thisWeekStart, 3), 0), // Sunday
    time: "11:00 AM",
    description: "Advanced security practices for business environments",
    spotsRemaining: 5,
    skillLevel: "Advanced",
    category: "Privacy & Security",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "11",
    name: "iOS Development",
    date: addDays(addWeeks(thisWeekStart, 3), 2), // Tuesday
    time: "1:00 PM",
    description: "Introduction to iOS app development",
    spotsRemaining: 4,
    skillLevel: "Intermediate",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "12",
    name: "Mac for Business",
    date: addDays(addWeeks(thisWeekStart, 3), 4), // Thursday
    time: "3:00 PM",
    description: "Optimize your Mac for professional workflows",
    spotsRemaining: 6,
    skillLevel: "Intermediate",
    category: "Business & Enterprise",
    instructor: "Ahmad Alzaro"
  }
];
