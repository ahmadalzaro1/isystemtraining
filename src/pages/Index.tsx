
import { useState } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [step, setStep] = useState<"calendar" | "registration" | "success">("calendar");
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
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Content */}
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="relative text-[#1D1D1F] text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight group">
            <span className="inline-block animate-text-assemble overflow-hidden">
              <span className="inline-block">Master</span>
            </span>{" "}
            <span className="inline-block animate-text-assemble animation-delay-100 overflow-hidden">
              <span className="inline-block">Your</span>
            </span>{" "}
            <span className="inline-block animate-text-assemble animation-delay-200 overflow-hidden">
              <span className="inline-block">Apple</span>
            </span>{" "}
            <span className="inline-block animate-text-assemble animation-delay-300 overflow-hidden">
              <span className="inline-block">Devices</span>
            </span>
            <span className="block text-[#6E6E73] text-2xl md:text-3xl lg:text-4xl mt-4 font-normal animate-text-assemble animation-delay-400">
              <span className="inline-block">Like Never Before</span>
            </span>
            <div className="absolute inset-0 -z-10 animate-glow-fade opacity-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
          </h1>
          
          <p className="text-[#6E6E73] text-xl md:text-2xl max-w-3xl mx-auto animate-fade-up animation-delay-500">
            Unlock your device's full potential with exclusive iSystem Training Workshops 
            designed to transform the way you work and create.
          </p>

          <div className="pt-8 animate-fade-up animation-delay-600">
            <button
              onClick={scrollToWorkshops}
              className="apple-button group flex items-center gap-2 mx-auto"
            >
              View Available Workshops
              <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-[#6E6E73]" />
        </div>
      </div>

      {/* Workshops Section */}
      <div id="workshops" className="container py-16 px-4 sm:px-6 lg:px-8">
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
