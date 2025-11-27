import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { WaitlistService } from "@/services/waitlistService";
import { Workshop } from "@/types/workshop";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  phone: z.string().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistDialogProps {
  workshop: Workshop;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WaitlistDialog = ({ workshop, open, onOpenChange }: WaitlistDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation completes
    setTimeout(() => {
      setIsSuccess(false);
      setQueuePosition(null);
      reset();
    }, 300);
  };

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);

    try {
      const result = await WaitlistService.addToWaitlist(
        workshop.id,
        data.email,
        data.name,
        data.phone
      );

      setQueuePosition(result.queuePosition);
      setIsSuccess(true);

      toast.success("Added to waitlist!", {
        description: `You're #${result.queuePosition} on the waitlist. We'll email you when a spot opens.`,
      });
    } catch (error) {
      console.error('Waitlist error:', error);
      toast.error("Failed to join waitlist", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] lgx-card border-[hsl(var(--border))]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-a))] focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {!isSuccess ? (
          <>
            <DialogHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--accent-a))] to-[hsl(var(--accent-b))] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-semibold text-center text-[hsl(var(--text-strong))]">
                Workshop Full
              </DialogTitle>
              <p className="text-base text-center text-[hsl(var(--text-muted))] leading-relaxed">
                <span className="font-medium text-[hsl(var(--text-strong))]">{workshop.name}</span>
                <br />
                is currently at capacity.
              </p>
              <p className="text-sm text-center text-[hsl(var(--text-muted))]">
                Join the waitlist to be notified when a spot opens up.
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(var(--text-strong))]">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border))]"
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-[hsl(var(--text-muted))]">
                  Name (optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  {...register("name")}
                  className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border))]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[hsl(var(--text-muted))]">
                  Phone (optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+962 7XX XXX XXX"
                  {...register("phone")}
                  className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border))]"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[hsl(var(--accent-a))] to-[hsl(var(--accent-b))] hover:opacity-90 text-white font-medium rounded-full h-12 transition-all duration-200 motion-reduce:transition-none"
              >
                {isSubmitting ? (
                  "Joining..."
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 py-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-in zoom-in duration-300">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-[hsl(var(--text-strong))]">
                You're on the list!
              </h3>
              {queuePosition && (
                <p className="text-lg text-[hsl(var(--text-muted))]">
                  You're <span className="font-semibold text-[hsl(var(--accent-a))]">#{queuePosition}</span> on the waitlist
                </p>
              )}
              <p className="text-sm text-[hsl(var(--text-muted))] max-w-sm mx-auto">
                We'll send you an email as soon as a spot opens up for this workshop.
              </p>
            </div>

            <Button
              onClick={handleClose}
              variant="outline"
              className="rounded-full px-8"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
