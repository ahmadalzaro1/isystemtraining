
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, TaskType } from "@/types/registration";
import { cn } from "@/lib/utils";

interface MainTasksStepProps {
  data: Pick<FormData, "mainTasks">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const TASKS = [
  { value: "email", label: "Emails & Communication", icon: "📧" },
  { value: "business", label: "Business & Productivity Apps", icon: "📊" },
  { value: "creative", label: "Creative Work (Video, Music, Design)", icon: "🎨" },
  { value: "coding", label: "Coding & Development", icon: "🖥️" },
  { value: "privacy", label: "Privacy & Security Management", icon: "🔐" },
  { value: "social", label: "Social Media & Content Creation", icon: "📱" },
  { value: "ai", label: "AI, Automation & Smart Features", icon: "🤖" },
] as const;

export const MainTasksStep = ({ data, onChange, className }: MainTasksStepProps) => {
  const handleTaskToggle = (task: TaskType) => {
    const updatedTasks = data.mainTasks.includes(task)
      ? data.mainTasks.filter(t => t !== task)
      : [...data.mainTasks, task];
    
    // Limit to top 3 tasks
    const limitedTasks = updatedTasks.slice(0, 3);
    onChange({ mainTasks: limitedTasks });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <Label className="text-lg font-medium">
          What are the top 3 tasks you do most on your Apple device?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TASKS.map((task) => (
            <Label
              key={task.value}
              className={cn(
                "flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                data.mainTasks.length >= 3 && !data.mainTasks.includes(task.value) && "opacity-50"
              )}
            >
              <Checkbox
                checked={data.mainTasks.includes(task.value)}
                onCheckedChange={() => handleTaskToggle(task.value)}
                disabled={data.mainTasks.length >= 3 && !data.mainTasks.includes(task.value)}
              />
              <div className="flex items-center gap-2">
                <span>{task.icon}</span>
                <span>{task.label}</span>
              </div>
            </Label>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Select up to 3 tasks that you perform most frequently
        </p>
      </div>
    </div>
  );
};
