
import { Check } from "lucide-react";

interface DeviceOptionProps {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const DeviceOption = ({
  icon,
  label,
  selected,
  onClick,
}: DeviceOptionProps) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl bg-surface2 border border-[hsl(var(--border))] shadow-elev-1 hover:shadow-elev-2 transition duration-ios ease-ios focus-visible:shadow-focus group ${
      selected
        ? "border-[hsl(var(--accent-a))] bg-[hsl(var(--accent-a))/0.08] ring-2 ring-[hsl(var(--accent-a))/0.24] ring-offset-2"
        : ""
    }`}
  >
    <div className="flex flex-col items-center space-y-2">
      <div className={`transition-transform group-hover:scale-110 ${selected ? "scale-110" : ""}`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {selected && (
        <div className="animate-fade-up">
          <Check className="h-4 w-4 text-[hsl(var(--accent-a))]" />
        </div>
      )}
    </div>
  </div>
);
