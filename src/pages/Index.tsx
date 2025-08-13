import { useState, useCallback, memo } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationWizardV2 } from "@/components/registration/v2/RegistrationWizardV2";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { toast } from "sonner";
import { FormData } from "@/types/registration";
import { WorkshopRegistration } from "@/services/registrationService";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import VanillaBgCanvas from '@/webgl/VanillaBgCanvas';
import { WorkshopsSectionV2 } from '@/components/workshops/WorkshopsSectionV2';
import { WorkshopsSectionMassiveV2 } from '@/components/workshops/WorkshopsSectionMassiveV2';
import { WorkshopsSectionV4 } from '@/components/workshops/WorkshopsSectionV4';
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { useQuery } from '@tanstack/react-query';
import { WorkshopService } from '@/services/workshopService';
import { WorkshopSkeleton } from '@/components/workshops/WorkshopSkeleton';

const Index = memo(() => {
  usePerformanceMonitor('Index');
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    user
  } = auth;
  const {
    triggerHaptic
  } = useHapticFeedback();
  const { workshopsV2, registrationV2 } = useFeatureFlags();
  const calendarVariant: 'v1' | 'v2' = workshopsV2 ? 'v2' : 'v1';
  
// Feature flag for massive workshops redesign
const useMassiveWorkshopsDesign = true;

// Load workshops with React Query
const { data: workshops = [], isLoading: isWorkshopsLoading, isError: isWorkshopsError, error: workshopsError, refetch } = useQuery({
  queryKey: ['workshops'],
  queryFn: WorkshopService.getWorkshops,
  staleTime: 60000,
  refetchOnWindowFocus: false,
});

const [step, setStep] = useState<"calendar" | "registration" | "success">("calendar");
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<FormData | null>(null);
  const [registration, setRegistration] = useState<WorkshopRegistration | null>(null);
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
      description: "Check your email for confirmation details."
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
  return <>
      <VanillaBgCanvas />
      <section className="fold container-page" style={{
      position: 'relative',
      zIndex: 1
    }}>
        <div>
          <h1 className="text-[40px] leading-[44px] mb-3 text-[hsl(var(--text-strong))]">Master your Apple devices with focused, hands-on workshops.</h1>
          <p className="text-[hsl(var(--text-muted))] lead mb-6">Small groups. Practical projects. Real results. Pick a date and start learning.</p>
          <div className="cta-row">
            <Button variant="glassPrimary" onClick={scrollToWorkshops} aria-label="Browse workshops">Browse Workshops</Button>
            <Button variant="secondaryOutline" onClick={() => navigate(user ? '/my-registrations' : '/auth')} aria-label={user ? 'Go to my registrations' : 'Sign in to manage registrations'}>
              {user ? 'My registrations' : 'Sign In'}
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming dates (dynamic) */}
      {useMassiveWorkshopsDesign ? (
        <>
          {step === 'calendar' && (
            isWorkshopsError ? (
              <WorkshopsSectionV2 title="Upcoming dates">
                <div className="p-6">
                  <p className="text-[hsl(var(--text-muted))] mb-2">We couldn't load workshops. Please try again.</p>
                  {workshopsError && (
                    <p className="text-sm text-[hsl(var(--text-muted))] mb-4">Details: {(workshopsError as Error).message}</p>
                  )}
                  <Button variant="secondaryOutline" onClick={() => refetch()}>Retry</Button>
                </div>
              </WorkshopsSectionV2>
            ) : isWorkshopsLoading ? (
              <WorkshopsSectionV2 title="Upcoming dates">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  <WorkshopSkeleton />
                  <WorkshopSkeleton />
                  <WorkshopSkeleton />
                </div>
              </WorkshopsSectionV2>
            ) : (
              <WorkshopsSectionV4 workshops={workshops} onSelect={handleWorkshopSelect} />
            )
          )}
          {step === 'registration' && selectedWorkshop && (
            <WorkshopsSectionV2>
              {registrationV2 ? (
                <RegistrationWizardV2 
                  workshop={selectedWorkshop} 
                  onSubmit={async (data) => {
                    const { RegistrationService } = await import("@/services/registrationService");
                    return RegistrationService.createRegistration({
                      workshop_id: data.workshop_id,
                      formData: data as any,
                      user_id: user?.id,
                    });
                  }}
                  onComplete={handleRegistrationComplete} 
                />
              ) : (
                <RegistrationForm workshop={selectedWorkshop} onComplete={handleRegistrationComplete} />
              )}
            </WorkshopsSectionV2>
          )}
          {step === 'success' && selectedWorkshop && registrationData && (
            <WorkshopsSectionV2>
              <RegistrationSuccess
                workshop={selectedWorkshop}
                registrationData={registrationData}
                registration={registration}
                onViewWorkshops={handleViewWorkshops}
              />
            </WorkshopsSectionV2>
          )}
        </>
      ) : (
        <WorkshopsSectionV2>
          {step === 'calendar' && <WorkshopCalendar onSelect={handleWorkshopSelect} variant={calendarVariant} />}
          {step === 'registration' && selectedWorkshop && (
            registrationV2 ? (
              <RegistrationWizardV2 
                workshop={selectedWorkshop} 
                onSubmit={async (data) => {
                  const { RegistrationService } = await import("@/services/registrationService");
                  return RegistrationService.createRegistration({
                    workshop_id: data.workshop_id,
                    formData: data as any,
                    user_id: user?.id,
                  });
                }}
                onComplete={handleRegistrationComplete} 
              />
            ) : (
              <RegistrationForm workshop={selectedWorkshop} onComplete={handleRegistrationComplete} />
            )
          )}
          {step === 'success' && selectedWorkshop && registrationData && (
            <RegistrationSuccess
              workshop={selectedWorkshop}
              registrationData={registrationData}
              registration={registration}
              onViewWorkshops={handleViewWorkshops}
            />
          )}
        </WorkshopsSectionV2>
      )}
    </>;
});
Index.displayName = 'Index';
export default Index;