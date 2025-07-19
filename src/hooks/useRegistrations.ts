
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RegistrationService, WorkshopRegistration } from "@/services/registrationService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useRegistrations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  console.log('useRegistrations - user:', user);
  console.log('useRegistrations - user.id:', user?.id);

  const { data: registrations, isLoading, error } = useQuery({
    queryKey: ['registrations', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('useRegistrations - No user ID, returning empty array');
        return [];
      }
      console.log('useRegistrations - Fetching for user ID:', user.id);
      try {
        const result = await RegistrationService.getUserRegistrations(user.id);
        console.log('useRegistrations - Result:', result);
        return result;
      } catch (error) {
        console.error('useRegistrations - Error:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  console.log('useRegistrations - Final state:', { registrations, isLoading, error });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      RegistrationService.updateRegistrationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      toast.success("Registration updated successfully");
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error("Failed to update registration");
    },
  });

  return {
    registrations: registrations || [],
    isLoading,
    error,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
};

export const useGuestRegistrations = (email: string) => {
  const { data: registrations, isLoading, error } = useQuery({
    queryKey: ['guest-registrations', email],
    queryFn: () => email ? RegistrationService.getGuestRegistrations(email) : Promise.resolve([]),
    enabled: !!email,
  });

  return {
    registrations: registrations || [],
    isLoading,
    error,
  };
};

export const useConfirmationLookup = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  
  const { data: registration, isLoading, error } = useQuery({
    queryKey: ['registration-lookup', confirmationCode],
    queryFn: () => confirmationCode ? RegistrationService.getRegistrationByConfirmationCode(confirmationCode) : Promise.resolve(null),
    enabled: !!confirmationCode && confirmationCode.length >= 6,
  });

  return {
    registration,
    isLoading,
    error,
    confirmationCode,
    setConfirmationCode,
  };
};
