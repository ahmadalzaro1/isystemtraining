
import { useState, useEffect, useCallback, memo } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FormData } from "@/types/registration";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Index = memo(() => {
  usePerformanceMonitor('Index');
  const prefersReducedMotion = useReducedMotion();
  const [setHeroRef, heroEntry] = useIntersectionObserver({ threshold: 0.1 });
  
  const [step, setStep] = useState<"calendar" | "registration" | "success">("calendar");
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<FormData | null>(null);
  const [headlineLetters, setHeadlineLetters] = useState<string[]>([]);
  const [subheadlineLetters, setSubheadlineLetters] = useState<string[]>([]);

  useEffect(() => {
    const headline = "Master Your Apple Devices Like Never Before";
    const subheadline = "Unlock your device's full potential with exclusive iSystem Training Workshops designed to transform the way you work and create.";
    
    setHeadlineLetters(headline.split(''));
    setSubheadlineLetters(subheadline.split(''));
  }, []);

  const handleWorkshopSelect = useCallback((workshop: any) => {
    setSelectedWorkshop(workshop);
    setStep("registration");
    toast("Workshop Selected", {
      description: `You've selected ${workshop.name} on ${workshop.date.toLocaleDateString()}`,
      position: "top-right",
      className: "z-[1000]"
    });
  }, []);

  const handleRegistrationComplete = useCallback((formData: FormData) => {
    setRegistrationData(formData);
    setStep("success");
    toast("Registration Complete!", {
      description: "Check your email for confirmation details.",
    });
  }, []);

  const handleViewWorkshops = useCallback(() => {
    setStep("calendar");
    setSelectedWorkshop(null);
    setRegistrationData(null);
  }, []);

  const scrollToWorkshops = useCallback(() => {
    const element = document.getElementById("workshops");
    if (element) {
      element.scrollIntoView({ 
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    }
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] relative overflow-hidden">
      {/* Dynamic Lines Background */}
      <div 
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
        role="presentation"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#F9F9F9] to-white">
          {/* Dynamic animated lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-line"
              style={{
                width: '2px',
                height: `${Math.random() * 150 + 100}px`,
                background: 'linear-gradient(180deg, rgba(0,122,255,0.1) 0%, rgba(0,122,255,0.05) 100%)',
                left: `${(i + 1) * 12.5}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                transform: `rotate(${Math.random() * 45 - 22.5}deg)`
              }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`b-${i}`}
              className="absolute animate-line"
              style={{
                width: '2px',
                height: `${Math.random() * 150 + 100}px`,
                background: 'linear-gradient(180deg, rgba(0,122,255,0.1) 0%, rgba(0,122,255,0.05) 100%)',
                right: `${(i + 1) * 12.5}%`,
                bottom: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5 + 0.25}s`,
                transform: `rotate(${Math.random() * 45 - 22.5}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Subtle overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80" />
      </div>

      <ThemeToggle />
      
      {/* Hero Section */}
      <section 
        ref={setHeroRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
        aria-labelledby="hero-heading"
        role="banner"
      >
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Headline */}
          <h1 
            id="hero-heading"
            className="relative text-[24px] xs:text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-semibold apple-headline apple-text-shadow hover-glow px-2 leading-tight"
          >
            {headlineLetters.map((letter, index) => (
              <span
                key={index}
                className={prefersReducedMotion ? "inline-block" : "stagger-letter inline-block"}
                style={{ 
                  animationDelay: prefersReducedMotion ? "0s" : `${index * 0.03}s` 
                }}
                aria-hidden="true"
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
                animationDelay: prefersReducedMotion ? "0s" : `${(headlineLetters.length + subheadlineLetters.length) * 0.02}s` 
              }}
              aria-label="Navigate to available workshops section"
            >
              <span className="relative z-10">View Available Workshops</span>
              <ChevronDown 
                className={`h-5 w-5 relative z-10 ${
                  prefersReducedMotion ? "" : "transition-all duration-300 group-hover:translate-y-1"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60 hover-glow ${
            prefersReducedMotion ? "" : "animate-bounce"
          }`}
          aria-hidden="true"
          role="presentation"
        >
          <ChevronDown className="h-8 w-8 text-[#6E6E73]" />
        </div>
      </section>

      {/* Workshops Section */}
      <main 
        id="workshops" 
        className="container relative z-10 py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl bg-white/80 backdrop-blur-sm rounded-t-3xl shadow-lg"
        role="main"
        aria-labelledby="workshops-heading"
      >
        {step === "calendar" && (
          <WorkshopCalendar onSelect={handleWorkshopSelect} />
        )}
        
        {step === "registration" && selectedWorkshop && (
          <RegistrationForm 
            workshop={selectedWorkshop}
            onComplete={handleRegistrationComplete} 
          />
        )}
        
        {step === "success" && selectedWorkshop && registrationData && (
          <RegistrationSuccess
            workshop={selectedWorkshop}
            registrationData={registrationData}
            onViewWorkshops={handleViewWorkshops}
          />
        )}
      </main>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
