import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { WorkshopService } from "@/services/workshopService";
import { RegistrationWizardV2 } from "@/components/registration/v2/RegistrationWizardV2";
import { RegistrationForm } from "@/components/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { useAuth } from "@/contexts/AuthContext";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { FormData } from "@/types/registration";
import { WorkshopRegistration } from "@/services/registrationService";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegistrationPage() {
  const { workshopId } = useParams<{ workshopId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { registrationV2 } = useFeatureFlags();
  
  const [step, setStep] = useState<"registration" | "success">("registration");
  const [registrationData, setRegistrationData] = useState<FormData | null>(null);
  const [registration, setRegistration] = useState<WorkshopRegistration | null>(null);

  // Fetch workshop data
  const { data: workshops = [], isLoading, isError, error } = useQuery({
    queryKey: ['workshops'],
    queryFn: WorkshopService.getWorkshops,
    staleTime: 60000,
  });

  const workshop = workshops.find(w => w.id === workshopId);

  const handleRegistrationComplete = useCallback((formData: FormData, registrationRecord?: WorkshopRegistration) => {
    setRegistrationData(formData);
    setRegistration(registrationRecord || null);
    setStep("success");
    toast("Registration Complete!", {
      description: "Check your email for confirmation details."
    });
  }, []);

  const handleViewWorkshops = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--surface))] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card className="p-8">
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-12 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !workshop) {
    return (
      <div className="min-h-screen bg-[hsl(var(--surface))] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="secondaryOutline" 
            onClick={handleGoBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workshops
          </Button>
          
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-semibold text-[hsl(var(--text-strong))] mb-4">
              Workshop Not Found
            </h1>
            <p className="text-[hsl(var(--text-muted))] mb-6">
              {isError ? `Error: ${(error as Error)?.message}` : "The requested workshop could not be found."}
            </p>
            <Button variant="primaryPill" onClick={handleGoBack}>
              Browse Available Workshops
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {step === "registration" && (
          <>
            <Button 
              variant="secondaryOutline" 
              onClick={handleGoBack}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workshops
            </Button>
            
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-[hsl(var(--text-strong))] mb-2">
                Register for Workshop
              </h1>
              <div className="text-[hsl(var(--text-muted))]">
                <p className="text-lg">{workshop.name}</p>
                <p className="text-sm">
                  {workshop.date.toLocaleDateString()} • {workshop.time} • {workshop.skillLevel}
                </p>
              </div>
            </div>

            {registrationV2 ? (
              <RegistrationWizardV2 
                workshop={{ id: workshop.id, title: workshop.name }} 
                onSubmit={async (data) => {
                  const { RegistrationService } = await import("@/services/registrationService");
                  return RegistrationService.createRegistration({
                    workshop_id: data.workshop_id,
                    formData: data.formData,
                    user_id: user?.id,
                  });
                }}
                onComplete={handleRegistrationComplete} 
              />
            ) : (
              <RegistrationForm 
                workshop={workshop} 
                onComplete={handleRegistrationComplete} 
              />
            )}
          </>
        )}

        {step === "success" && registrationData && (
          <RegistrationSuccess
            workshop={workshop}
            registrationData={registrationData}
            registration={registration}
            onViewWorkshops={handleViewWorkshops}
          />
        )}
      </div>
    </div>
  );
}