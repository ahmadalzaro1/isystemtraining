import { Workshop } from "@/types/workshop";
import { addDays, addWeeks, startOfWeek } from "date-fns";

const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday

// Helper to distribute locations
const locations = ["iSystem Khalda", "iSystem Abdoun", "iSystem Mecca Street", "iSystem Swefieh", "iSystem City Mall", "Online"] as const;
const getLocation = (index: number) => locations[index % locations.length];

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
    instructor: "Ahmad Alzaro",
    location: getLocation(0)
  },
  {
    id: "2",
    name: "iPhone Camera: Portrait Mode + Professional Editing",
    date: new Date(addDays(thisWeekStart, 1)), // Monday
    time: "2:30 PM",
    description: "📸 Capture stunning portraits and learn professional editing techniques. Master depth control, lighting effects, and advanced camera features.",
    spotsRemaining: 3,
    skillLevel: "Advanced",
    category: "iPhone",
    instructor: "Layla Mansour",
    location: getLocation(1)
  },
  {
    id: "3",
    name: "iPhone Essentials: From Beginner to Confident User",
    date: new Date(addDays(thisWeekStart, 2)), // Tuesday
    time: "9:15 AM",
    description: "🚀 Perfect first iPhone workshop! Learn gestures, apps organization, privacy settings, and essential features for everyday use.",
    spotsRemaining: 15,
    skillLevel: "Beginner",
    category: "iPhone",
    instructor: "Noor Al-Zahra",
    location: getLocation(2)
  },
  {
    id: "4",
    name: "iPhone for Seniors: Simplified Guide & Large Text Setup",
    date: new Date(addDays(thisWeekStart, 3)), // Wednesday
    time: "11:00 AM",
    description: "📱 iPhone made simple! Large text, accessibility features, family sharing, and staying connected with loved ones.",
    spotsRemaining: 12,
    skillLevel: "Beginner",
    category: "iPhone",
    instructor: "Fatima Al-Rashid",
    location: getLocation(3)
  },
  {
    id: "5",
    name: "iPhone Photography: Composition & Light Mastery",
    date: new Date(addDays(thisWeekStart, 4)), // Thursday
    time: "3:45 PM",
    description: "📷 Take magazine-quality photos with your iPhone. Learn composition rules, lighting techniques, and editing workflows.",
    spotsRemaining: 6,
    skillLevel: "Intermediate",
    category: "iPhone",
    instructor: "Samir Khalil",
    location: getLocation(4)
  },
  {
    id: "6",
    name: "Apple Watch Health: Heart Rate & Fitness Tracking",
    date: new Date(addDays(thisWeekStart, 5)), // Friday
    time: "1:20 PM",
    description: "⌚ Transform your health with Apple Watch. Master workout tracking, heart rate zones, and health data insights.",
    spotsRemaining: 9,
    skillLevel: "Intermediate",
    category: "Apple Watch",
    instructor: "Dr. Yasmin Khoury",
    location: getLocation(5)
  },
  {
    id: "7",
    name: "Apple Watch Advanced: ECG, Blood Oxygen & Medical ID",
    date: new Date(addDays(thisWeekStart, 6)), // Saturday
    time: "10:30 AM",
    description: "🏥 Use Apple Watch for serious health monitoring. ECG readings, blood oxygen, fall detection, and emergency features.",
    spotsRemaining: 4,
    skillLevel: "Advanced",
    category: "Apple Watch",
    instructor: "Dr. Omar Farid",
    location: getLocation(0)
  },

  // Week 2
  {
    id: "8",
    name: "AI with Apple: Siri Shortcuts & Smart Automation",
    date: new Date(addDays(thisWeekStart, 7)), // Next Sunday
    time: "9:00 AM",
    description: "🤖 Create powerful AI automations with Siri Shortcuts. Voice commands, smart routines, and hands-free productivity.",
    spotsRemaining: 11,
    skillLevel: "Beginner",
    category: "AI",
    instructor: "Khalid Al-Mansoori",
    location: getLocation(1)
  },
  {
    id: "9",
    name: "Advanced AI: Custom Shortcuts & Complex Workflows",
    date: new Date(addDays(thisWeekStart, 8)), // Monday
    time: "4:15 PM",
    description: "⚡ Build sophisticated AI workflows. Complex automations, API integrations, and advanced Shortcuts programming.",
    spotsRemaining: 2,
    skillLevel: "Advanced",
    category: "AI",
    instructor: "Dr. Amira Hassan",
    location: getLocation(2)
  },
  {
    id: "10",
    name: "Digital Safety: Privacy, Passwords & Secure Sharing",
    date: new Date(addDays(thisWeekStart, 9)), // Tuesday
    time: "12:45 PM",
    description: "🔒 Protect your digital life. Password managers, two-factor authentication, privacy settings, and safe browsing.",
    spotsRemaining: 14,
    skillLevel: "Beginner",
    category: "Digital Safety",
    instructor: "Cybersecurity Expert Rania",
    location: getLocation(3)
  },
  {
    id: "11",
    name: "Advanced Security: VPNs, Encryption & Threat Protection",
    date: new Date(addDays(thisWeekStart, 10)), // Wednesday
    time: "2:00 PM",
    description: "🛡️ Enterprise-level security for personal use. VPNs, encrypted communications, and advanced threat protection.",
    spotsRemaining: 7,
    skillLevel: "Advanced",
    category: "Digital Safety",
    instructor: "Cybersecurity Expert Rania",
    location: getLocation(4)
  },
  {
    id: "12",
    name: "Creative Projects: GarageBand & iMovie Magic",
    date: new Date(addDays(thisWeekStart, 11)), // Thursday
    time: "11:30 AM",
    description: "🎬 Create professional content with built-in apps. Music production in GarageBand and video editing in iMovie.",
    spotsRemaining: 10,
    skillLevel: "Intermediate",
    category: "Creativity",
    instructor: "Creative Director Lina",
    location: getLocation(5)
  },
  {
    id: "13",
    name: "Advanced Creativity: Procreate & Professional Workflows",
    date: new Date(addDays(thisWeekStart, 12)), // Friday
    time: "3:00 PM",
    description: "🎨 Master digital art and design. Advanced Procreate techniques, creative workflows, and professional output.",
    spotsRemaining: 5,
    skillLevel: "Advanced",
    category: "Creativity",
    instructor: "Artist Majid Al-Farisi",
    location: getLocation(0)
  },

  // Week 3
  {
    id: "14",
    name: "Productivity Powerhouse: Apps, Workflows & Time Management",
    date: new Date(addDays(thisWeekStart, 14)), // Next Sunday
    time: "9:45 AM",
    description: "⚡ Transform how you work. Best productivity apps, workflow optimization, and time management strategies.",
    spotsRemaining: 13,
    skillLevel: "Beginner",
    category: "Productivity",
    instructor: "Productivity Coach Zara",
    location: getLocation(1)
  },
  {
    id: "15",
    name: "Advanced Productivity: Automation & Integration Systems",
    date: new Date(addDays(thisWeekStart, 15)), // Monday
    time: "1:15 PM",
    description: "🔄 Build automated productivity systems. App integrations, workflow automation, and seamless device synchronization.",
    spotsRemaining: 6,
    skillLevel: "Advanced",
    category: "Productivity",
    instructor: "Tech Strategist Kareem",
    location: getLocation(2)
  },
  {
    id: "16",
    name: "iCloud Mastery: Sync, Share & Backup Like a Pro",
    date: new Date(addDays(thisWeekStart, 16)), // Tuesday
    time: "10:15 AM",
    description: "☁️ Master Apple's cloud ecosystem. Seamless sync, family sharing, collaborative workflows, and bulletproof backups.",
    spotsRemaining: 8,
    skillLevel: "Intermediate",
    category: "iCloud",
    instructor: "Cloud Expert Dina",
    location: getLocation(3)
  },
  {
    id: "17",
    name: "Advanced iCloud: Enterprise Features & Security",
    date: new Date(addDays(thisWeekStart, 17)), // Wednesday
    time: "4:30 PM",
    description: "🏢 Professional iCloud usage. Advanced sharing, business features, security configurations, and enterprise workflows.",
    spotsRemaining: 1,
    skillLevel: "Advanced",
    category: "iCloud",
    instructor: "Enterprise Specialist Hani",
    location: getLocation(4)
  }
];