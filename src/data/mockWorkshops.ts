
import { Workshop } from "@/types/workshop";
import { addDays, addWeeks, startOfWeek } from "date-fns";

const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday

export const mockWorkshops: Workshop[] = [
  // Week 1
  {
    id: "1",
    name: "Mac Mastery: Unlock Hidden Shortcuts & Pro Features",
    date: new Date(addDays(thisWeekStart, 0)), // Sunday
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
    date: new Date(addDays(thisWeekStart, 2)), // Tuesday
    time: "2:00 PM",
    description: "💡 Learn to create powerful automation workflows and scripts to make your Mac work for you. Perfect for power users.",
    spotsRemaining: 6,
    skillLevel: "Advanced",
    category: "Mac",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "3",
    name: "iPhone Power User: Unlock 100% of Its Potential",
    date: new Date(addDays(thisWeekStart, 4)), // Thursday
    time: "3:00 PM",
    description: "💡 You paid for an iPhone… but are you using it like a pro? Learn secrets Apple won't tell you.",
    spotsRemaining: 7,
    skillLevel: "Beginner",
    category: "iPhone",
    instructor: "Ahmad Alzaro"
  },

  // Week 2
  {
    id: "4",
    name: "iPhone Photography Masterclass",
    date: new Date(addDays(addWeeks(thisWeekStart, 1), 0)), // Next Sunday
    time: "10:00 AM",
    description: "💡 Transform your iPhone photography skills. Learn pro techniques, editing secrets, and how to create stunning visuals.",
    spotsRemaining: 5,
    skillLevel: "Intermediate",
    category: "iPhone",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "5",
    name: "Apple Watch Domination: Track & Automate Your Life",
    date: new Date(addDays(addWeeks(thisWeekStart, 1), 2)), // Next Tuesday
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
    date: new Date(addDays(addWeeks(thisWeekStart, 1), 4)), // Next Thursday
    time: "11:00 AM",
    description: "💡 Master every health and fitness feature on your Apple Watch. Create custom workouts and optimize your wellness tracking.",
    spotsRemaining: 6,
    skillLevel: "Advanced",
    category: "Apple Watch",
    instructor: "Ahmad Alzaro"
  },

  // Week 3
  {
    id: "7",
    name: "AI ChatGPT Integration with Apple Devices",
    date: new Date(addDays(addWeeks(thisWeekStart, 2), 0)), // Week 3 Sunday
    time: "3:00 PM",
    description: "💡 Learn how to integrate ChatGPT and other AI tools with your Apple devices for enhanced productivity and creativity.",
    spotsRemaining: 8,
    skillLevel: "Beginner",
    category: "AI",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "8",
    name: "AI-Powered Siri Shortcuts Mastery",
    date: new Date(addDays(addWeeks(thisWeekStart, 2), 2)), // Week 3 Tuesday
    time: "2:00 PM",
    description: "💡 Create advanced Siri shortcuts using AI to automate complex tasks across all your Apple devices.",
    spotsRemaining: 4,
    skillLevel: "Advanced",
    category: "AI",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "9",
    name: "Digital Privacy & Security Fundamentals",
    date: new Date(addDays(addWeeks(thisWeekStart, 2), 4)), // Week 3 Thursday
    time: "10:00 AM",
    description: "💡 Learn essential privacy settings and security features to protect your Apple devices from threats.",
    spotsRemaining: 7,
    skillLevel: "Beginner",
    category: "Digital Safety",
    instructor: "Ahmad Alzaro"
  },

  // Week 4
  {
    id: "10",
    name: "Advanced Security Protocols for Apple Devices",
    date: new Date(addDays(addWeeks(thisWeekStart, 3), 0)), // Week 4 Sunday
    time: "1:00 PM",
    description: "💡 Master advanced security features, encryption, and threat prevention for all your Apple devices.",
    spotsRemaining: 5,
    skillLevel: "Advanced",
    category: "Digital Safety",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "11",
    name: "Final Cut Pro X: Video Editing Mastery",
    date: new Date(addDays(addWeeks(thisWeekStart, 3), 2)), // Week 4 Tuesday
    time: "9:00 AM",
    description: "💡 Learn professional video editing techniques using Final Cut Pro X on your Mac.",
    spotsRemaining: 6,
    skillLevel: "Intermediate",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "12",
    name: "Creative Suite: Logic Pro & GarageBand",
    date: new Date(addDays(addWeeks(thisWeekStart, 3), 4)), // Week 4 Thursday
    time: "2:00 PM",
    description: "💡 Create professional music and audio productions using Apple's creative suite.",
    spotsRemaining: 4,
    skillLevel: "Advanced",
    category: "Creativity",
    instructor: "Ahmad Alzaro"
  },

  // Week 5
  {
    id: "13",
    name: "Ultimate Task Management with Apple Apps",
    date: new Date(addDays(addWeeks(thisWeekStart, 4), 0)), // Week 5 Sunday
    time: "11:00 AM",
    description: "💡 Master Reminders, Calendar, and Notes apps to create a seamless productivity system.",
    spotsRemaining: 8,
    skillLevel: "Beginner",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "14",
    name: "Advanced Workflow Automation",
    date: new Date(addDays(addWeeks(thisWeekStart, 4), 2)), // Week 5 Tuesday
    time: "1:00 PM",
    description: "💡 Create powerful automation workflows across all your Apple devices using Shortcuts and third-party apps.",
    spotsRemaining: 5,
    skillLevel: "Advanced",
    category: "Productivity",
    instructor: "Ahmad Alzaro"
  },
  {
    id: "15",
    name: "iCloud Storage Management & Optimization",
    date: new Date(addDays(addWeeks(thisWeekStart, 4), 4)), // Week 5 Thursday
    time: "2:00 PM",
    description: "💡 Learn to effectively manage and optimize your iCloud storage across all devices.",
    spotsRemaining: 6,
    skillLevel: "Intermediate",
    category: "iCloud",
    instructor: "Ahmad Alzaro"
  },

  // Week 6
  {
    id: "16",
    name: "iCloud Advanced Security & Family Sharing",
    date: new Date(addDays(addWeeks(thisWeekStart, 5), 0)), // Week 6 Sunday
    time: "10:00 AM",
    description: "💡 Master iCloud security features and learn to manage Family Sharing effectively.",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "iCloud",
    instructor: "Ahmad Alzaro"
  }
];
