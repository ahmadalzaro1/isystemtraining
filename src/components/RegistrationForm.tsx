
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Smartphone, Laptop, Desktop, Watch, Headphones } from "lucide-react";

interface RegistrationFormProps {
  onComplete: (data: any) => void;
}

export const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    experience: "",
    name: "",
    email: "",
    phone: "",
    contactMethod: "",
    occupation: "",
    devices: [],
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const steps = [
    {
      title: "Experience Level",
      description: "Tell us about your experience with Apple products",
      content: (
        <div className="space-y-4 animate-fade-up">
          <RadioGroup
            onValueChange={(value) => updateFormData({ experience: value })}
            className="space-y-4"
          >
            <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="first-time" />
              <span>I'm a first-time Apple user</span>
            </Label>
            <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="new-device" />
              <span>New to this specific Apple device</span>
            </Label>
            <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="switching" />
              <span>Switching from Android or Windows</span>
            </Label>
          </RadioGroup>
        </div>
      ),
    },
    {
      title: "Personal Information",
      description: "Enter your contact details",
      content: (
        <div className="space-y-4 animate-fade-up">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Your Devices",
      description: "Select the Apple devices you own",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-up">
          <DeviceOption
            icon={<Smartphone className="h-6 w-6" />}
            label="iPhone"
            selected={formData.devices.includes("iPhone")}
            onClick={() => {
              const devices = formData.devices.includes("iPhone")
                ? formData.devices.filter((d) => d !== "iPhone")
                : [...formData.devices, "iPhone"];
              updateFormData({ devices });
            }}
          />
          <DeviceOption
            icon={<Laptop className="h-6 w-6" />}
            label="MacBook"
            selected={formData.devices.includes("MacBook")}
            onClick={() => {
              const devices = formData.devices.includes("MacBook")
                ? formData.devices.filter((d) => d !== "MacBook")
                : [...formData.devices, "MacBook"];
              updateFormData({ devices });
            }}
          />
          <DeviceOption
            icon={<Desktop className="h-6 w-6" />}
            label="iMac"
            selected={formData.devices.includes("iMac")}
            onClick={() => {
              const devices = formData.devices.includes("iMac")
                ? formData.devices.filter((d) => d !== "iMac")
                : [...formData.devices, "iMac"];
              updateFormData({ devices });
            }}
          />
          <DeviceOption
            icon={<Watch className="h-6 w-6" />}
            label="Apple Watch"
            selected={formData.devices.includes("Apple Watch")}
            onClick={() => {
              const devices = formData.devices.includes("Apple Watch")
                ? formData.devices.filter((d) => d !== "Apple Watch")
                : [...formData.devices, "Apple Watch"];
              updateFormData({ devices });
            }}
          />
          <DeviceOption
            icon={<Headphones className="h-6 w-6" />}
            label="AirPods"
            selected={formData.devices.includes("AirPods")}
            onClick={() => {
              const devices = formData.devices.includes("AirPods")
                ? formData.devices.filter((d) => d !== "AirPods")
                : [...formData.devices, "AirPods"];
              updateFormData({ devices });
            }}
          />
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">
          {currentStep.title}
        </h2>
        <p className="text-gray-600">{currentStep.description}</p>
      </div>

      <div className="flex space-x-4 overflow-hidden">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index + 1 <= step ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <Card className="p-6">{currentStep.content}</Card>

      <div className="flex justify-between">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="animate-fade-up"
          >
            Back
          </Button>
        )}
        <Button
          onClick={() => {
            if (step < steps.length) {
              setStep((s) => s + 1);
            } else {
              onComplete(formData);
            }
          }}
          className="ml-auto animate-fade-up"
        >
          {step === steps.length ? "Complete Registration" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

const DeviceOption = ({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
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
