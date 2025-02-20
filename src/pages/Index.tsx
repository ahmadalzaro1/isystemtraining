
import { useState } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [step, setStep] = useState<"calendar" | "registration" | "success">(
    "calendar"
  );
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const { toast } = useToast();

  const handleWorkshopSelect = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setStep("registration");
    toast({
      title: "Workshop Selected",
      description: `You've selected ${workshop.name} on ${workshop.date.toLocaleDateString()}`,
    });
  };

  const handleRegistrationComplete = (formData: any) => {
    setStep("success");
    toast({
      title: "Registration Complete!",
      description: "Check your email for confirmation details.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        {step === "calendar" && (
          <WorkshopCalendar onSelect={handleWorkshopSelect} />
        )}
        
        {step === "registration" && (
          <RegistrationForm onComplete={handleRegistrationComplete} />
        )}
        
        {step === "success" && (
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="text-4xl font-medium tracking-tight">
              Registration Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for registering for {selectedWorkshop?.name}
            </p>
            <p className="text-gray-500">
              Check your email for confirmation details and next steps.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
