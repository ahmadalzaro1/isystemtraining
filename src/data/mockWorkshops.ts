
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
    date: addDays(thisWeekStart, 1),
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
    date: addDays(thisWeekStart, 2),
    time: "3:00 PM",
    description: "💡 Data leaks, spyware, cybercrime? 99% of people don't protect their devices correctly. Learn how to secure your digital life.",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "Digital Safety",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "4",
    name: "iCloud Unlocked: Secure, Sync & Supercharge",
    date: addDays(thisWeekStart, 3),
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
    date: addDays(thisWeekStart, 4),
    time: "2:00 PM",
    description: "💡 Your Apple device + AI = unfair advantage. Use AI to write, edit, plan, and get things done at lightning speed.",
    spotsRemaining: 4,
    skillLevel: "Intermediate",
    category: "AI",
    instructor: "Ahmad Alzaro"
  },

  // Next Week
  {
    id: "6",
    name: "Creative Genius: Edit, Design & Create Like a Pro",
    date: addDays(addWeeks(thisWeekStart, 1), 0),
    time: "11:00 AM",
    description: "💡 Harness the power of Mac, iPad, & iPhone for elite-level design, video, and music production. No experience needed.",
    spotsRemaining: 6,
    skillLevel: "Beginner",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "7",
    name: "Apple Watch Domination: Track & Automate Your Life",
    date: addDays(addWeeks(thisWeekStart, 1), 1),
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
    date: addDays(addWeeks(thisWeekStart, 1), 2),
    time: "10:00 AM",
    description: "💡 Use Apple's built-in tools, automation, and time-saving hacks to crush your to-do list effortlessly.",
    spotsRemaining: 9,
    skillLevel: "Advanced",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "9",
    name: "Advanced Mac Automation & Scripting",
    date: addDays(addWeeks(thisWeekStart, 1), 3),
    time: "2:00 PM",
    description: "💡 Learn to create powerful automation workflows and scripts to make your Mac work for you. Perfect for power users.",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "Mac",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "10",
    name: "iPhone Photography Masterclass",
    date: addDays(addWeeks(thisWeekStart, 1), 4),
    time: "1:00 PM",
    description: "💡 Transform your iPhone photography skills. Learn pro techniques, editing secrets, and how to create stunning visuals.",
    spotsRemaining: 5,
    skillLevel: "Intermediate",
    category: "iPhone",
    instructor: "Ahmad Alzaro"
  },

  // Week 3
  {
    id: "11",
    name: "Apple Watch Health & Fitness Pro",
    date: addDays(addWeeks(thisWeekStart, 2), 0),
    time: "9:00 AM",
    description: "💡 Master every health and fitness feature on your Apple Watch. Create custom workouts and optimize your wellness tracking.",
    spotsRemaining: 6,
    skillLevel: "Intermediate",
    category: "Apple Watch",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "12",
    name: "AI Content Creation with Apple Tools",
    date: addDays(addWeeks(thisWeekStart, 2), 1),
    time: "2:00 PM",
    description: "💡 Combine AI tools with Apple's creative suite to produce content faster than ever. Perfect for content creators.",
    spotsRemaining: 4,
    skillLevel: "Advanced",
    category: "AI",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "13",
    name: "Digital Privacy Master Class",
    date: addDays(addWeeks(thisWeekStart, 2), 2),
    time: "11:00 AM",
    description: "💡 Advanced techniques for protecting your digital life. Learn to secure all your Apple devices and online presence.",
    spotsRemaining: 8,
    skillLevel: "Advanced",
    category: "Digital Safety",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "14",
    name: "Professional Video Editing on Mac",
    date: addDays(addWeeks(thisWeekStart, 2), 3),
    time: "1:00 PM",
    description: "💡 Master Final Cut Pro and create professional-grade videos. Learn advanced editing techniques and workflows.",
    spotsRemaining: 5,
    skillLevel: "Advanced",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "15",
    name: "Ultimate iCloud Management",
    date: addDays(addWeeks(thisWeekStart, 2), 4),
    time: "10:00 AM",
    description: "💡 Become an iCloud power user. Master backup strategies, sharing features, and advanced storage optimization.",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "iCloud",
    instructor: "Ahmad Alzaro"
  }
];
