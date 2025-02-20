import { useState } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Index = () => {
  const [step, setStep] = useState<"calendar" | "registration" | "success">(
    "calendar"
  );
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);

  const handleWorkshopSelect = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setStep("registration");
    toast("Workshop Selected", {
      description: `You've selected ${workshop.name} on ${workshop.date.toLocaleDateString()}`,
    });
  };

  const handleRegistrationComplete = (formData: any) => {
    setStep("success");
    toast("Registration Complete!", {
      description: "Check your email for confirmation details.",
    });
  };

  const scrollToWorkshops = () => {
    document.getElementById("workshops")?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-up">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-primary">
            Master Your Apple Devices
            <br />
            <span className="text-primary/80">Like Never Before</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-medium text-primary/70 mt-4">
            Exclusive iSystem Training Workshops – Learn, Optimize, Master
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-6">
            Our weekly workshops help you unlock the full potential of your Apple devices. 
            Choose a session and start your journey to Apple mastery.
          </p>
          
          <div className="mt-12">
            <Button
              size="lg"
              onClick={scrollToWorkshops}
              className="group text-lg px-8 py-6 h-auto"
            >
              View Available Workshops
              <ChevronDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
            </Button>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary/30" />
        </div>
      </div>

      {/* Workshops Section */}
      <div id="workshops" className="container py-12 px-4 sm:px-6 lg:px-8">
        {step === "calendar" && (
          <WorkshopCalendar onSelect={handleWorkshopSelect} />
        )}
        
        {step === "registration" && (
          <RegistrationForm onComplete={handleRegistrationComplete} />
        )}
        
        {step === "success" && selectedWorkshop && (
          <RegistrationSuccess
            workshop={selectedWorkshop}
            onViewWorkshops={() => setStep("calendar")}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
