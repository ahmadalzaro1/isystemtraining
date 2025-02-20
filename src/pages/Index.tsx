
import { useState, useEffect } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const FloatingLogo = ({ icon, className }: { icon: string; className: string }) => (
  <div className={`absolute glass-morphism p-4 rounded-2xl animate-float ${className}`}>
    <img src={icon} alt="App Icon" className="w-12 h-12 opacity-30" />
  </div>
);

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
    <div className="min-h-screen bg-background apple-gradient-bg relative overflow-hidden">
      <ThemeToggle />
      
      {/* Floating App Icons */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingLogo 
          icon="/logos/safari.png" 
          className="top-[15%] left-[10%] animation-delay-100" 
        />
        <FloatingLogo 
          icon="/logos/messages.png" 
          className="top-[30%] right-[15%] animation-delay-200" 
        />
        <FloatingLogo 
          icon="/logos/photos.png" 
          className="bottom-[20%] left-[20%] animation-delay-300" 
        />
        <FloatingLogo 
          icon="/logos/facetime.png" 
          className="top-[45%] left-[25%] animation-delay-400" 
        />
        <FloatingLogo 
          icon="/logos/notes.png" 
          className="bottom-[35%] right-[10%] animation-delay-500" 
        />
        <FloatingLogo 
          icon="/logos/maps.png" 
          className="top-[20%] right-[30%] animation-delay-600" 
        />
      </div>
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Headline */}
          <h1 className="relative text-[#1D1D1F] text-4xl md:text-6xl lg:text-7xl font-semibold apple-headline apple-text-shadow hover-glow">
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
          <p className="text-[#6E6E73] text-xl md:text-2xl max-w-3xl mx-auto apple-subheadline hover-glow">
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
          <div className="pt-8">
            <button
              onClick={scrollToWorkshops}
              className="apple-button group relative flex items-center gap-3 mx-auto"
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
