
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
    className={`p-4 rounded-xl border cursor-pointer transition-all ${
      selected
        ? "border-primary bg-primary/5"
        : "hover:border-gray-300 hover:bg-gray-50"
    }`}
  >
    <div className="flex flex-col items-center space-y-2">
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {selected && <Check className="h-4 w-4 text-primary" />}
    </div>
  </div>
);
