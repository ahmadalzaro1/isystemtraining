import { useCallback, memo, useEffect, useState } from "react";
import { WorkshopCalendar } from "@/components/WorkshopCalendar";
import { toast } from "sonner";
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

  // Animation state for intro sequence
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
// Feature flag for massive workshops redesign
const useMassiveWorkshopsDesign = true;

// Load workshops with React Query
const { data: workshops = [], isLoading: isWorkshopsLoading, isError: isWorkshopsError, error: workshopsError, refetch } = useQuery({
  queryKey: ['workshops'],
  queryFn: WorkshopService.getWorkshops,
  staleTime: 60000,
  refetchOnWindowFocus: false,
});

  const handleWorkshopSelect = useCallback((workshop: any) => {
    navigate(`/registration/${workshop.id}`);
    triggerHaptic('medium');
  }, [navigate, triggerHaptic]);
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
          <h1 className={`text-[40px] leading-[44px] mb-3 text-[hsl(var(--text-strong))] transition-all duration-700 ease-out transform ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          } ${prefersReducedMotion ? '' : 'delay-150'}`}>
            Master your Apple devices with focused, hands-on workshops.
          </h1>
          <p className={`text-[hsl(var(--text-muted))] lead mb-6 transition-all duration-700 ease-out transform ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          } ${prefersReducedMotion ? '' : 'delay-300'}`}>
            Small groups. Practical projects. Real results. Pick a date and start learning.
          </p>
          <div className={`cta-row transition-all duration-700 ease-out transform ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          } ${prefersReducedMotion ? '' : 'delay-500'}`}>
            <Button 
              variant="glassPrimary" 
              onClick={scrollToWorkshops} 
              aria-label="Browse workshops"
              className={`transform transition-all duration-300 ${
                isVisible 
                  ? 'scale-100' 
                  : 'scale-95'
              } ${prefersReducedMotion ? '' : 'hover:scale-105'}`}
            >
              Browse Workshops
            </Button>
            {auth.isAdmin ? (
              <Button 
                variant="primaryPill" 
                onClick={() => navigate('/admin')} 
                aria-label="Go to Admin Dashboard"
                className={`transform transition-all duration-300 ${
                  isVisible 
                    ? 'scale-100' 
                    : 'scale-95'
                } ${prefersReducedMotion ? '' : 'hover:scale-105 delay-75'}`}
              >
                View Registrations (Admin)
              </Button>
            ) : user ? (
              <Button 
                variant="secondaryOutline" 
                onClick={() => navigate('/my-registrations')} 
                aria-label="Go to my registrations"
                className={`transform transition-all duration-300 ${
                  isVisible 
                    ? 'scale-100' 
                    : 'scale-95'
                } ${prefersReducedMotion ? '' : 'hover:scale-105 delay-75'}`}
              >
                My registrations
              </Button>
            ) : (
              <Button 
                variant="secondaryOutline" 
                onClick={() => navigate('/auth')} 
                aria-label="Admin Login"
                className={`transform transition-all duration-300 ${
                  isVisible 
                    ? 'scale-100' 
                    : 'scale-95'
                } ${prefersReducedMotion ? '' : 'hover:scale-105 delay-75'}`}
              >
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming dates (dynamic) */}
      <div className={`transition-all duration-900 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12'
      } ${prefersReducedMotion ? '' : 'delay-700'}`}>
        {useMassiveWorkshopsDesign ? (
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
        ) : (
          <WorkshopsSectionV2>
            <WorkshopCalendar onSelect={handleWorkshopSelect} variant={calendarVariant} />
          </WorkshopsSectionV2>
        )}
      </div>
    </>;
});
Index.displayName = 'Index';
export default Index;