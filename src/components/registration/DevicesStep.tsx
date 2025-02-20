
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, DeviceType } from "@/types/registration";
import { cn } from "@/lib/utils";

interface DevicesStepProps {
  data: Pick<FormData, "devices">;
  onChange: (data: Partial<FormData>) => void;
  className?: string;
}

const DEVICES: { value: DeviceType; label: string; icon: string }[] = [
  { value: "Mac", label: "Mac", icon: "💻" },
  { value: "iPhone", label: "iPhone", icon: "📱" },
  { value: "iPad", label: "iPad", icon: "📱" },
  { value: "Apple Watch", label: "Apple Watch", icon: "⌚" },
  { value: "Apple TV", label: "Apple TV", icon: "📺" },
  { value: "AirPods", label: "AirPods", icon: "🎧" },
];

export const DevicesStep = ({ data, onChange, className }: DevicesStepProps) => {
  const handleDeviceToggle = (device: DeviceType) => {
    const updatedDevices = data.devices.includes(device)
      ? data.devices.filter(d => d !== device)
      : [...data.devices, device];
    onChange({ devices: updatedDevices });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Label className="text-lg font-medium">
        Which Apple devices do you own?
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {DEVICES.map((device) => (
          <Label
            key={device.value}
            className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Checkbox
              checked={data.devices.includes(device.value)}
              onCheckedChange={() => handleDeviceToggle(device.value)}
            />
            <div className="flex items-center gap-2">
              <span>{device.icon}</span>
              <span>{device.label}</span>
            </div>
          </Label>
        ))}
      </div>
    </div>
  );
};
