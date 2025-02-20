
import { Workshop } from "@/types/workshop";
import { addDays, addWeeks, startOfWeek } from "date-fns";

// Get start of current week for reference
const thisWeekStart = startOfWeek(new Date());

export const mockWorkshops: Workshop[] = [
  // Current Week
  {
    id: "1",
    name: "Mac Mastery: Unlock Hidden Shortcuts & Pro Features",
    date: addDays(thisWeekStart, 0),
    time: "10:00 AM",
    description: "💡 Turn your Mac into a productivity powerhouse with expert-only features. Master essential shortcuts and workflows that 90% of users ignore.",
    spotsRemaining: 8,
    skillLevel: "Intermediate",
    category: "Mac",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "2",
    name: "iPhone Power User: Unlock 100% of Its Potential",
    date: addDays(thisWeekStart, 2),
    time: "2:00 PM",
    description: "💡 You paid for an iPhone… but are you using it like a pro? Learn secrets Apple won't tell you and maximize your device's capabilities.",
    spotsRemaining: 6,
    skillLevel: "Intermediate",
    category: "iPhone",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "3",
    name: "Digital Fort Knox: Bulletproof Your Apple Devices",
    date: addDays(thisWeekStart, 4),
    time: "3:00 PM",
    description: "💡 Data leaks, spyware, cybercrime? 99% of people don't protect their devices correctly. Learn how to secure your digital life.",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "Digital Safety",
    instructor: "Ahmad Alzaro"
  },

  // Next Week
  {
    id: "4",
    name: "iCloud Unlocked: Secure, Sync & Supercharge",
    date: addDays(addWeeks(thisWeekStart, 1), 0),
    time: "10:00 AM",
    description: "💡 Stop losing files. Stop running out of storage. Learn how to fully integrate iCloud across all devices and optimize your workflow.",
    spotsRemaining: 5,
    skillLevel: "Beginner",
    category: "iCloud",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "5",
    name: "AI & Apple: Work 10x Faster with AI Tools",
    date: addDays(addWeeks(thisWeekStart, 1), 2),
    time: "2:00 PM",
    description: "💡 Your Apple device + AI = unfair advantage. Use AI to write, edit, plan, and get things done at lightning speed.",
    spotsRemaining: 4,
    skillLevel: "Intermediate",
    category: "AI",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "6",
    name: "Creative Genius: Edit, Design & Create Like a Pro",
    date: addDays(addWeeks(thisWeekStart, 1), 4),
    time: "11:00 AM",
    description: "💡 Harness the power of Mac, iPad, & iPhone for elite-level design, video, and music production. No experience needed.",
    spotsRemaining: 6,
    skillLevel: "Beginner",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },

  // Week 3
  {
    id: "7",
    name: "Apple Watch Domination: Track & Automate Your Life",
    date: addDays(addWeeks(thisWeekStart, 2), 0),
    time: "3:00 PM",
    description: "💡 Your Apple Watch is more than a step tracker. Learn how to automate, analyze, and execute like a high performer.",
    spotsRemaining: 8,
    skillLevel: "Intermediate",
    category: "Apple Watch",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "8",
    name: "Mac & iPhone Efficiency Hacks: 2x Your Productivity",
    date: addDays(addWeeks(thisWeekStart, 2), 2),
    time: "10:00 AM",
    description: "💡 Use Apple's built-in tools, automation, and time-saving hacks to crush your to-do list effortlessly.",
    spotsRemaining: 9,
    skillLevel: "Advanced",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "9",
    name: "Creative Pro: Advanced Design & Media Production",
    date: addDays(addWeeks(thisWeekStart, 2), 4),
    time: "2:00 PM",
    description: "💡 Take your creative skills to the next level with professional techniques for design, video, and audio production.",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  }
];
