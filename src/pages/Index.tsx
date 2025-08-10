import { useState, useEffect, useCallback, memo } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { FormData } from "@/types/registration";
import { WorkshopRegistration } from "@/services/registrationService";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { HomeButton } from '@/components/ui/home-button';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import HeroCanvas from '@/webgl/HeroCanvas';

const Index = memo(() => {
  usePerformanceMonitor('Index');
  const prefersReducedMotion = useReducedMotion();
  const [setHeroRef] = useIntersectionObserver({ threshold: 0.1 });
  const navigate = useNavigate();
  const auth = useAuth();
  const { user } = auth;
  const { triggerHaptic } = useHapticFeedback();
  
  const [step, setStep] = useState<"calendar" | "registration" | "success">("calendar");
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<FormData | null>(null);
  const [registration, setRegistration] = useState<WorkshopRegistration | null>(null);
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
    triggerHaptic('medium');
    
    toast("Workshop Selected", {
      description: `You've selected ${workshop.name} on ${workshop.date.toLocaleDateString()}`,
      position: "top-right",
      className: "z-[1000]"
    });
  }, [triggerHaptic]);

  const handleRegistrationComplete = useCallback((formData: FormData, registrationRecord?: WorkshopRegistration) => {
    setRegistrationData(formData);
    setRegistration(registrationRecord || null);
    setStep("success");
    triggerHaptic('success');
    toast("Registration Complete!", {
      description: "Check your email for confirmation details.",
    });
  }, [triggerHaptic]);

  const handleViewWorkshops = useCallback(() => {
    setStep("calendar");
    setSelectedWorkshop(null);
    setRegistrationData(null);
    setRegistration(null);
    triggerHaptic('light');
  }, [triggerHaptic]);

  const scrollToWorkshops = useCallback(() => {
    triggerHaptic('selection');
    
    const element = document.getElementById("workshops");
    if (element) {
      element.scrollIntoView({ 
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      
      toast("Scrolling to workshops", {
        description: "Finding available workshops for you",
        position: "bottom-center",
        duration: 2000
      });
    } else {
      // Fallback scroll
      window.scrollTo({
        top: window.innerHeight,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  }, [prefersReducedMotion, triggerHaptic]);

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))] relative overflow-hidden ios-scroll">
      <HeroCanvas />
      <div 
        className="hidden fixed inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
        role="presentation"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#F9F9F9] to-white">
          <div className="absolute inset-0 bg-aurora-soft" />
          {/* Dynamic animated lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-line"
              style={{
                width: '2px',
                height: `${120 + (i * 10)}px`,
                background: 'linear-gradient(180deg, rgba(0,122,255,0.1) 0%, rgba(0,122,255,0.05) 100%)',
                left: `${(i + 1) * 12.5}%`,
                top: `${10 + (i * 10)}%`,
                animationDelay: `${i * 0.5}s`,
                transform: `rotate(${-10 + (i * 2.5)}deg)`
              }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`b-${i}`}
              className="absolute animate-line"
              style={{
                width: '2px',
                height: `${130 + (i * 8)}px`,
                background: 'linear-gradient(180deg, rgba(0,122,255,0.1) 0%, rgba(0,122,255,0.05) 100%)',
                right: `${(i + 1) * 12.5}%`,
                bottom: `${15 + (i * 8)}%`,
                animationDelay: `${i * 0.5 + 0.25}s`,
                transform: `rotate(${5 + (i * 3)}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Subtle overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80" />
      </div>

      {/* Hero Section */}
      <section 
        ref={setHeroRef}
        className="section-gap container-page relative z-10 min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden ios-safe-area"
        aria-labelledby="hero-heading"
        role="banner"
      >
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Headline */}
          <h1 
            id="hero-heading"
            className="relative text-[24px] xs:text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-semibold apple-headline apple-text-shadow hover-glow px-2 leading-tight text-[hsl(var(--text-strong))]"
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
          <p className="text-[hsl(var(--text-muted))] text-base xs:text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto apple-subheadline hover-glow px-4 leading-relaxed text-measure">
            {subheadlineLetters.map((letter, index) => (
              <span
                key={index}
                className="stagger-letter inline-block text-[hsl(var(--text-strong))]"
                style={{ animationDelay: `${(headlineLetters.length * 0.03) + (index * 0.02)}s` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </p>

          {/* CTAs */}
          <div className="pt-6 px-4 relative z-30">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="glassPrimary"
                onClick={scrollToWorkshops}
                aria-label="Browse workshops"
              >
                Browse Workshops
              </Button>
              <Button
                variant="secondaryOutline"
                onClick={() => navigate(user ? '/my-registrations' : '/auth')}
                aria-label={user ? 'Go to my registrations' : 'Sign in to manage registrations'}
              >
                {user ? 'My Registrations' : 'Sign In'}
              </Button>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60 hover-glow ${
            prefersReducedMotion ? '' : 'animate-bounce'
          }`}
          aria-hidden="true"
          role="presentation"
        >
          <ChevronDown className="h-8 w-8 text-[hsl(var(--text-muted))]" />
        </div>
      </section>

      {/* Popular workshops preview */}
      <section className="section-gap container-page" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="text-[28px] leading-[32px] mb-4 text-[hsl(var(--text-strong))]">Popular workshops</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map WorkshopCard here if available */}
        </div>
        <div className="mt-6"><a className="underline underline-offset-2" href="/workshops">See all workshops</a></div>
      </section>

      {/* How it works */}
      <section className="section-gap container-page" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-[28px] leading-[32px] mb-6 text-[hsl(var(--text-strong))]">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6"><h3 className="text-[22px] leading-[28px] mb-2 text-[hsl(var(--text-strong))]">1. Choose</h3><p className="text-[hsl(var(--text-muted))]">Pick a topic and date that fits your schedule.</p></div>
          <div className="card p-6"><h3 className="text-[22px] leading-[28px] mb-2 text-[hsl(var(--text-strong))]">2. Build</h3><p className="text-[hsl(var(--text-muted))]">Learn by doing with a real project and guidance.</p></div>
          <div className="card p-6"><h3 className="text-[22px] leading-[28px] mb-2 text-[hsl(var(--text-strong))]">3. Apply</h3><p className="text-[hsl(var(--text-muted))]">Leave with skills and assets you can use immediately.</p></div>
        </div>
      </section>

      {/* Upcoming dates (dynamic) */}
      <section id="workshops" className="section-gap container-page" aria-labelledby="workshops-heading">
        <h2 id="workshops-heading" className="text-[28px] leading-[32px] mb-4 text-[hsl(var(--text-strong))]">Upcoming dates</h2>
        <div className="card p-0 overflow-hidden">
          {step === 'calendar' && (
            <WorkshopCalendar onSelect={handleWorkshopSelect} />
          )}
          {step === 'registration' && selectedWorkshop && (
            <RegistrationForm 
              workshop={selectedWorkshop}
              onComplete={handleRegistrationComplete} 
            />
          )}
          {step === 'success' && selectedWorkshop && registrationData && (
            <RegistrationSuccess
              workshop={selectedWorkshop}
              registrationData={registrationData}
              registration={registration}
              onViewWorkshops={handleViewWorkshops}
            />
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-gap-lg container-page">
        <div className="card p-8 text-center">
          <h2 className="text-[28px] leading-[32px] mb-3 text-[hsl(var(--text-strong))]">Start your next skill today</h2>
          <p className="text-[hsl(var(--text-muted))] mb-6">Spots are limited. Secure your seat now.</p>
          <a className="glass rounded-lg px-5 py-2.5 focus-ring" href="/workshops">Find my workshop</a>
        </div>
      </section>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
