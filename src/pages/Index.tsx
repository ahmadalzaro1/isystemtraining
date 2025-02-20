
import { useState, useEffect } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [step, setStep] = useState<"calendar" | "registration" | "success">("calendar");
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [headlineLetters, setHeadlineLetters] = useState<string[]>([]);
  const [subheadlineLetters, setSubheadlineLetters] = useState<string[]>([]);

  useEffect(() => {
    const headline = "Master Your Apple Devices Like Never Before";
    const subheadline = "Unlock your device's full potential with exclusive iSystem Training Workshops designed to transform the way you work and create.";
    
    setHeadlineLetters(headline.split(''));
    setSubheadlineLetters(subheadline.split(''));
  }, []);

  const handleWorkshopSelect = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setStep("registration");
    toast("Workshop Selected", {
      description: `You've selected ${workshop.name} on ${workshop.date.toLocaleDateString()}`,
      position: "top-right",
      className: "z-[1000]"
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* New Background Design */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#FAFAFA]">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 opacity-40"
               style={{
                 backgroundImage: `
                   radial-gradient(at 40% 20%, rgba(247, 249, 251, 1) 0px, transparent 50%),
                   radial-gradient(at 80% 0%, rgba(242, 245, 250, 1) 0px, transparent 50%),
                   radial-gradient(at 0% 50%, rgba(245, 248, 250, 1) 0px, transparent 50%),
                   radial-gradient(at 80% 50%, rgba(240, 244, 248, 1) 0px, transparent 50%),
                   radial-gradient(at 0% 100%, rgba(243, 246, 249, 1) 0px, transparent 50%),
                   radial-gradient(at 80% 100%, rgba(246, 248, 250, 1) 0px, transparent 50%),
                   radial-gradient(at 0% 0%, rgba(244, 247, 250, 1) 0px, transparent 50%)
                 `
               }}
          />
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.015]"
               style={{
                 backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                 linear-gradient(to bottom, #000 1px, transparent 1px)`,
                 backgroundSize: '14px 14px'
               }}
          />
        </div>
      </div>

      <ThemeToggle />
      
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Headline */}
          <h1 className="relative text-[24px] xs:text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-semibold apple-headline apple-text-shadow hover-glow px-2 leading-tight">
            {headlineLetters.map((letter, index) => (
              <span
                key={index}
                className="stagger-letter inline-block"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>
          
          {/* Subheadline */}
          <p className="text-[#6E6E73] text-base xs:text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto apple-subheadline hover-glow px-4 leading-relaxed">
            {subheadlineLetters.map((letter, index) => (
              <span
                key={index}
                className="stagger-letter inline-block"
                style={{ animationDelay: `${(headlineLetters.length * 0.03) + (index * 0.02)}s` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </p>

          {/* CTA Button */}
          <div className="pt-8 px-4">
            <button
              onClick={scrollToWorkshops}
              className="apple-button group relative flex items-center gap-3 mx-auto text-base sm:text-lg"
              style={{ 
                animationDelay: `${(headlineLetters.length + subheadlineLetters.length) * 0.02}s` 
              }}
            >
              <span className="relative z-10">View Available Workshops</span>
              <ChevronDown 
                className="h-5 w-5 transition-all duration-300 group-hover:translate-y-1 relative z-10" 
              />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60 hover-glow">
          <ChevronDown className="h-8 w-8 text-[#6E6E73]" />
        </div>
      </div>

      {/* Workshops Section */}
      <div id="workshops" className="container relative z-10 py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl bg-white/80 backdrop-blur-sm rounded-t-3xl shadow-lg">
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
