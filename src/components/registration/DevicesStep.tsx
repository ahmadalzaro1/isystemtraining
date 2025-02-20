
import { Smartphone, Laptop, Monitor, Watch, Headphones } from "lucide-react";
import { DeviceOption } from "./DeviceOption";
import { FormData } from "@/types/registration";

interface DevicesStepProps {
  devices: string[];
  onChange: (data: Partial<FormData>) => void;
}

export const DevicesStep = ({ devices, onChange }: DevicesStepProps) => {
  const handleDeviceToggle = (device: string) => {
    const updatedDevices = devices.includes(device)
      ? devices.filter((d) => d !== device)
      : [...devices, device];
    onChange({ devices: updatedDevices });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-up">
      <DeviceOption
        icon={<Smartphone className="h-6 w-6" />}
        label="iPhone"
        selected={devices.includes("iPhone")}
        onClick={() => handleDeviceToggle("iPhone")}
      />
      <DeviceOption
        icon={<Laptop className="h-6 w-6" />}
        label="MacBook"
        selected={devices.includes("MacBook")}
        onClick={() => handleDeviceToggle("MacBook")}
      />
      <DeviceOption
        icon={<Monitor className="h-6 w-6" />}
        label="iMac"
        selected={devices.includes("iMac")}
        onClick={() => handleDeviceToggle("iMac")}
      />
      <DeviceOption
        icon={<Watch className="h-6 w-6" />}
        label="Apple Watch"
        selected={devices.includes("Apple Watch")}
        onClick={() => handleDeviceToggle("Apple Watch")}
      />
      <DeviceOption
        icon={<Headphones className="h-6 w-6" />}
        label="AirPods"
        selected={devices.includes("AirPods")}
        onClick={() => handleDeviceToggle("AirPods")}
      />
    </div>
  );
};
