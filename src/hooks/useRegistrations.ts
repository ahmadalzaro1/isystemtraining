
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RegistrationService, WorkshopRegistration } from "@/services/registrationService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useRegistrations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: registrations, isLoading, error } = useQuery({
    queryKey: ['registrations', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      return await RegistrationService.getUserRegistrations(user.id);
    },
    enabled: !!user?.id,
  });

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

export const useGuestRegistrations = (email: string, confirmationCode?: string) => {
  const { data: registrations, isLoading, error } = useQuery({
    queryKey: ['guest-registrations', email, confirmationCode],
    queryFn: () => {
      if (!email || !confirmationCode) return Promise.resolve([]);
      return RegistrationService.getGuestRegistrations(email, confirmationCode);
    },
    enabled: !!email && !!confirmationCode,
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
