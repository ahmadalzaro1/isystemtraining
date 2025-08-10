
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Calendar, Share2, Bell, Check, ChevronRight, Mail, MessageSquare } from "lucide-react";
import { FormData } from "@/types/registration";
import { Workshop } from "@/types/workshop";
import { WorkshopRegistration } from "@/services/registrationService";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { RegistrationConfirmation } from "./RegistrationConfirmation";
import { useNavigate } from "react-router-dom";

interface RegistrationSuccessProps {
  workshop: Workshop;
  registrationData: FormData;
  registration?: WorkshopRegistration;
  onViewWorkshops: () => void;
}

export const RegistrationSuccess = ({ 
  workshop, 
  registrationData, 
  registration,
  onViewWorkshops 
}: RegistrationSuccessProps) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [smsReminders, setSmsReminders] = useState(false);

  useEffect(() => {
    // Animate progress bar on mount
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleShareWorkshop = () => {
    const message = `Join me at ${workshop.name} on ${workshop.date.toLocaleDateString()}! It's going to be amazing!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join My Workshop!',
        text: message,
        url: window.location.href,
      }).catch(() => copyToClipboard(message));
    } else {
      copyToClipboard(message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Invitation copied to clipboard!", {
        description: "Share it with your friends!",
      });
    }).catch(() => {
      toast.error("Couldn't copy invitation", {
        description: "Please try again",
      });
    });
  };

  const addToCalendar = () => {
    const event = {
      title: workshop.name,
      description: workshop.description,
      location: "Online",
      startTime: workshop.date,
      endTime: new Date(workshop.date.getTime() + 2 * 60 * 60 * 1000),
    };

    toast.success("Added to calendar!", {
      description: "Check your calendar app for details",
    });
  };

  const toggleSmsReminders = () => {
    setSmsReminders(!smsReminders);
    toast.success(
      !smsReminders ? "SMS reminders enabled" : "SMS reminders disabled",
      { description: "Your preference has been saved" }
    );
  };

  const handleViewMyRegistrations = () => {
    navigate('/my-registrations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-up-scale">
        {/* Success Animation */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 animate-scale-in">
            <Check className="w-8 h-8 text-green-500 animate-checkmark" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 animate-text-assemble">
            You're all set, {registrationData.name}! 🎉
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your journey to mastering Apple devices starts here
          </p>
          <Progress value={progress} className="w-full max-w-md" />
          
          {registration && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Confirmation Code:</strong> 
                <span className="font-mono ml-2">{registration.confirmation_code}</span>
              </p>
            </div>
          )}
        </div>

        {/* Registration Confirmation Details */}
        {registration && (
          <RegistrationConfirmation 
            registration={registration} 
            workshop={workshop} 
          />
        )}

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Workshop Details Card */}
          <Card className="glass-morphism p-6 hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4">Workshop Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Workshop</span>
                <span className="font-medium">{workshop.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{workshop.date.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{workshop.time}</span>
              </div>
              <Button 
                variant="secondaryOutline" 
                onClick={addToCalendar}
                className="w-full hover-glow"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
          </Card>

          {/* Next Steps Card */}
          <Card className="glass-morphism p-6">
            <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">
                  Confirmation sent to {registrationData.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>SMS Reminders</span>
                </div>
                <Switch
                  checked={smsReminders}
                  onCheckedChange={toggleSmsReminders}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Share Section */}
        <Card className="glass-morphism p-6">
          <h2 className="text-2xl font-semibold mb-4">Share with Friends</h2>
          <p className="text-muted-foreground mb-4">
            Know someone who'd love this session? Invite them to join!
          </p>
            <div className="flex gap-4">
              <Button variant="secondaryOutline" onClick={handleShareWorkshop} className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                iMessage
              </Button>
              <Button variant="secondaryOutline" onClick={handleShareWorkshop} className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Share Link
              </Button>
            </div>
        </Card>

        {/* What to Expect */}
        <Card className="glass-morphism p-6">
          <h2 className="text-2xl font-semibold mb-4">What to Expect</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Interactive learning sessions with expert instructors</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Hands-on practice with Apple devices</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Exclusive learning resources and materials</span>
            </li>
          </ul>
        </Card>

        {/* Footer Actions */}
        <div className="flex flex-col gap-4 items-center pt-8">
          <div className="flex gap-4 w-full max-w-md">
            <Button onClick={handleViewMyRegistrations} variant="primaryMinimal" className="flex-1">
              View My Registrations
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="secondaryOutline" onClick={onViewWorkshops} className="flex-1">
              Browse More Workshops
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Need help? Contact us at support@isystem.com
          </p>

          {/* Animated Logo */}
          <div className="animate-float mt-8">
            <img 
              src="/placeholder.svg" 
              alt="iSystem" 
              className="h-8 opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
