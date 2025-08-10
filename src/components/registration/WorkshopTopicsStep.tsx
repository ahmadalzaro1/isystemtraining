
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FormData, WorkshopTopic, WorkshopCategory } from "@/types/registration";
import { cn } from "@/lib/utils";

interface WorkshopTopicsStepProps {
  data: Pick<FormData, "workshopTopics" | "otherTopics">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const WORKSHOP_CATEGORIES: { category: WorkshopCategory; title: string; topics: string[] }[] = [
  {
    category: "fundamentals",
    title: "🔹 Apple Device Fundamentals",
    topics: [
      "Mac Basics & System Preferences",
      "iPhone/iPad Setup & Customization",
      "Apple Watch Features & Optimization"
    ]
  },
  {
    category: "productivity",
    title: "🔹 Productivity & Workflows",
    topics: [
      "Mastering macOS & iOS Multitasking",
      "Apple Shortcuts & Automation",
      "Time Management & Focus Techniques",
      "Best Productivity Apps for Mac & iPhone"
    ]
  },
  {
    category: "creativity",
    title: "🔹 Creativity & Content Creation",
    topics: [
      "Photo Editing with Apple Photos & Third-Party Apps",
      "Video Editing with iMovie & Final Cut Pro",
      "Music Production with GarageBand & Logic Pro",
      "Digital Art & Apple Pencil for iPad"
    ]
  },
  {
    category: "security",
    title: "🔹 Digital Security & Privacy",
    topics: [
      "Securing Your Apple ID & iCloud",
      "Managing Passwords & Two-Factor Authentication",
      "Safe Browsing & Privacy on Safari",
      "Protecting Data from Cyber Threats"
    ]
  },
  {
    category: "cloud",
    title: "🔹 Cloud & Ecosystem Syncing",
    topics: [
      "iCloud Backup & File Management",
      "Seamless Handoff & Continuity Between Apple Devices",
      "Managing Family Sharing & Apple One"
    ]
  },
  {
    category: "ai",
    title: "🔹 AI & Smart Features",
    topics: [
      "Siri & AI-Powered Productivity",
      "AI in Photos, Notes & Apple Apps",
      "Voice Dictation & Accessibility Features"
    ]
  },
  {
    category: "business",
    title: "🔹 Business & Professional Use",
    topics: [
      "Apple for Business (Keynote, Pages, Numbers)",
      "Mastering Email & Calendar Efficiency",
      "Remote Work & Collaboration with Apple Devices",
      "Best Apple Tools for Entrepreneurs"
    ]
  },
  {
    category: "advanced",
    title: "🔹 Tech Enthusiasts & Advanced Users",
    topics: [
      "Customizing macOS with Terminal Commands",
      "Performance Optimization for Mac & iPhone",
      "Exploring Apple Beta Features & Developer Tools"
    ]
  },
  {
    category: "home",
    title: "🔹 Home & Smart Tech",
    topics: [
      "Smart Home Automation with HomeKit",
      "Apple TV & Streaming Best Practices",
      "Integrating Apple Devices with Non-Apple Tech"
    ]
  }
];

export const WorkshopTopicsStep = ({ data, onChange, className }: WorkshopTopicsStepProps) => {
  const handleTopicToggle = (category: WorkshopCategory, topic: string) => {
    const existingTopic = data.workshopTopics.find(t => t.topic === topic);
    let updatedTopics: WorkshopTopic[];
    
    if (existingTopic) {
      updatedTopics = data.workshopTopics.filter(t => t.topic !== topic);
    } else {
      updatedTopics = [
        ...data.workshopTopics,
        { category, topic, selected: true }
      ];
    }
    
    onChange({ workshopTopics: updatedTopics });
  };

  const isTopicSelected = (topic: string) => {
    return data.workshopTopics.some(t => t.topic === topic);
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <Label className="text-lg font-medium">
          What Apple topics interest you for future workshops?
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select all topics that interest you
        </p>
      </div>

      <div className="space-y-6">
        {WORKSHOP_CATEGORIES.map((category) => (
          <div key={category.category} className="space-y-4">
            <h3 className="font-medium">{category.title}</h3>
            <div className="grid grid-cols-1 gap-3 pl-4">
              {category.topics.map((topic) => (
                <Label
                  key={topic}
                  className="flex items-start gap-3 p-3 bg-surface2 border border-[hsl(var(--border))] rounded-xl shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus"
                >
                  <Checkbox
                    checked={isTopicSelected(topic)}
                    onCheckedChange={() => handleTopicToggle(category.category, topic)}
                  />
                  <span>{topic}</span>
                </Label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Label htmlFor="otherTopics">Missing something? Let us know what else you'd love to learn!</Label>
        <Textarea
          id="otherTopics"
          value={data.otherTopics || ""}
          onChange={(e) => onChange({ otherTopics: e.target.value })}
          placeholder="Tell us about other topics you're interested in..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
