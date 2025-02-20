
import { useState } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ThemeToggle />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight to-cosmic opacity-90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute inset-0 bg-glow-grid-gradient opacity-20" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative px-4 space-y-12 text-center max-w-5xl mx-auto">
          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight animate-fade-up">
              <span className="block text-gradient">
                Master Your Apple Devices
              </span>
              <span className="block text-3xl md:text-5xl lg:text-6xl mt-4 text-glass/80">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-silver/80 max-w-3xl mx-auto animate-fade-up [animation-delay:0.3s]">
              Unlock your device's full potential with exclusive iSystem Training Workshops 
              designed to transform the way you work and create.
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-up [animation-delay:0.5s]">
            <button
              onClick={scrollToWorkshops}
              className="button-glow group relative px-8 py-6 text-lg rounded-full bg-gradient-to-r from-neon/20 to-aurora/20 hover:from-neon/30 hover:to-aurora/30 text-white shadow-neon hover:shadow-aurora transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Available Workshops
                <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
              </span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <ChevronDown className="h-8 w-8 text-glass" />
          </div>
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
