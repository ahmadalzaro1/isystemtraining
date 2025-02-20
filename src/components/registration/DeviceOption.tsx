
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
    className={`p-4 rounded-xl border cursor-pointer transition-all group ${
      selected
        ? "border-primary bg-primary/5 ring-2 ring-primary/20 ring-offset-2"
        : "hover:border-gray-300 hover:bg-gray-50"
    }`}
  >
    <div className="flex flex-col items-center space-y-2">
      <div className={`transition-transform group-hover:scale-110 ${selected ? "scale-110" : ""}`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {selected && (
        <div className="animate-fade-up">
          <Check className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  </div>
);
