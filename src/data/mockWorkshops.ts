
import { Workshop } from "@/types/workshop";
import { addDays, addWeeks, startOfWeek } from "date-fns";

const thisWeekStart = startOfWeek(new Date());

export const mockWorkshops: Workshop[] = [
  // Mac Category
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
    name: "Advanced Mac Automation & Scripting",
    date: addDays(thisWeekStart, 1),
    time: "2:00 PM",
    description: "💡 Learn to create powerful automation workflows and scripts to make your Mac work for you. Perfect for power users.",
    spotsRemaining: 6,
    skillLevel: "Advanced",
    category: "Mac",
    instructor: "Ahmad Alzaro"
  },

  // iPhone Category
  {
    id: "3",
    name: "iPhone Power User: Unlock 100% of Its Potential",
    date: addDays(thisWeekStart, 2),
    time: "3:00 PM",
    description: "💡 You paid for an iPhone… but are you using it like a pro? Learn secrets Apple won't tell you.",
    spotsRemaining: 7,
    skillLevel: "Beginner",
    category: "iPhone",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "4",
    name: "iPhone Photography Masterclass",
    date: addDays(thisWeekStart, 3),
    time: "10:00 AM",
    description: "💡 Transform your iPhone photography skills. Learn pro techniques, editing secrets, and how to create stunning visuals.",
    spotsRemaining: 5,
    skillLevel: "Intermediate",
    category: "iPhone",
    instructor: "Ahmad Alzaro"
  },

  // Apple Watch Category
  {
    id: "5",
    name: "Apple Watch Domination: Track & Automate Your Life",
    date: addDays(thisWeekStart, 4),
    time: "2:00 PM",
    description: "💡 Your Apple Watch is more than a step tracker. Learn how to automate, analyze, and execute like a high performer.",
    spotsRemaining: 4,
    skillLevel: "Intermediate",
    category: "Apple Watch",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "6",
    name: "Apple Watch Health & Fitness Pro",
    date: addDays(addWeeks(thisWeekStart, 1), 0),
    time: "11:00 AM",
    description: "💡 Master every health and fitness feature on your Apple Watch. Create custom workouts and optimize your wellness tracking.",
    spotsRemaining: 6,
    skillLevel: "Advanced",
    category: "Apple Watch",
    instructor: "Ahmad Alzaro"
  },

  // AI Category
  {
    id: "7",
    name: "AI & Apple: Work 10x Faster with AI Tools",
    date: addDays(addWeeks(thisWeekStart, 1), 1),
    time: "3:00 PM",
    description: "💡 Your Apple device + AI = unfair advantage. Use AI to write, edit, plan, and get things done at lightning speed.",
    spotsRemaining: 8,
    skillLevel: "Beginner",
    category: "AI",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "8",
    name: "AI Content Creation with Apple Tools",
    date: addDays(addWeeks(thisWeekStart, 1), 2),
    time: "2:00 PM",
    description: "💡 Combine AI tools with Apple's creative suite to produce content faster than ever. Perfect for content creators.",
    spotsRemaining: 4,
    skillLevel: "Advanced",
    category: "AI",
    instructor: "Ahmad Alzaro"
  },

  // Digital Safety Category
  {
    id: "9",
    name: "Digital Fort Knox: Bulletproof Your Apple Devices",
    date: addDays(addWeeks(thisWeekStart, 1), 3),
    time: "10:00 AM",
    description: "💡 Data leaks, spyware, cybercrime? 99% of people don't protect their devices correctly. Learn how to secure your digital life.",
    spotsRemaining: 7,
    skillLevel: "Intermediate",
    category: "Digital Safety",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "10",
    name: "Digital Privacy Master Class",
    date: addDays(addWeeks(thisWeekStart, 1), 4),
    time: "1:00 PM",
    description: "💡 Advanced techniques for protecting your digital life. Learn to secure all your Apple devices and online presence.",
    spotsRemaining: 5,
    skillLevel: "Advanced",
    category: "Digital Safety",
    instructor: "Ahmad Alzaro"
  },

  // Creativity Category
  {
    id: "11",
    name: "Creative Genius: Edit, Design & Create Like a Pro",
    date: addDays(addWeeks(thisWeekStart, 2), 0),
    time: "9:00 AM",
    description: "💡 Harness the power of Mac, iPad, & iPhone for elite-level design, video, and music production. No experience needed.",
    spotsRemaining: 6,
    skillLevel: "Beginner",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "12",
    name: "Professional Video Editing on Mac",
    date: addDays(addWeeks(thisWeekStart, 2), 1),
    time: "2:00 PM",
    description: "💡 Master Final Cut Pro and create professional-grade videos. Learn advanced editing techniques and workflows.",
    spotsRemaining: 4,
    skillLevel: "Advanced",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },

  // Productivity Category
  {
    id: "13",
    name: "Mac & iPhone Efficiency Hacks: 2x Your Productivity",
    date: addDays(addWeeks(thisWeekStart, 2), 2),
    time: "11:00 AM",
    description: "💡 Use Apple's built-in tools, automation, and time-saving hacks to crush your to-do list effortlessly.",
    spotsRemaining: 8,
    skillLevel: "Intermediate",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "14",
    name: "Advanced Productivity Systems for Apple Users",
    date: addDays(addWeeks(thisWeekStart, 2), 3),
    time: "1:00 PM",
    description: "💡 Create powerful productivity systems using Apple's ecosystem. Perfect for professionals and power users.",
    spotsRemaining: 5,
    skillLevel: "Advanced",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },

  // iCloud Category
  {
    id: "15