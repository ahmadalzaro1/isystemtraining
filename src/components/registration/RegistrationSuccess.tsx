
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, Share2 } from "lucide-react";
import { FormData } from "@/types/registration";
import { Workshop } from "@/types/workshop";

interface RegistrationSuccessProps {
  workshop: Workshop;
  registrationData: FormData;
  onViewWorkshops: () => void;
}

export const RegistrationSuccess = ({ 
  workshop, 
  registrationData, 
  onViewWorkshops 
}: RegistrationSuccessProps) => {
  const handleShareWorkshop = () => {
    // Generate a shareable message
    const message = `Join me at ${workshop.name} on ${workshop.date.toLocaleDateString()}! It's going to be amazing!`;
    
    // Check if the Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Join My Workshop!',
        text: message,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to clipboard copy if sharing fails
        copyToClipboard(message);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
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
      endTime: new Date(workshop.date.getTime() + 2 * 60 * 60 * 1000), // Assuming 2 hours duration
    };

    // Here you could integrate with specific calendar services
    // For now, we'll just show a success message
    toast.success("Added to calendar!", {
      description: "Check your calendar app for details",
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Registration Complete! 🎉</h2>
        <p className="text-muted-foreground">
          {registrationData.name}, you're all set for {workshop.name}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Your Registration Details</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Name</span>
            <span>{registrationData.name}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Email</span>
            <span>{registrationData.email}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Phone</span>
            <span>{registrationData.phone}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Preferred Contact</span>
            <span>{registrationData.contactPreference}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Workshop Details</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Date</span>
            <span>{workshop.date.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Time</span>
            <span>{workshop.time}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Category</span>
            <span>{workshop.category}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Skill Level</span>
            <span>{workshop.skillLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <Button 
          variant="outline" 
          onClick={addToCalendar}
          className="w-full gap-2"
        >
          <Calendar className="h-4 w-4" />
          Add to Calendar
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleShareWorkshop}
          className="w-full gap-2"
        >
          <Share2 className="h-4 w-4" />
          Invite a Friend
        </Button>

        <Button 
          onClick={onViewWorkshops}
          className="w-full"
        >
          Browse More Workshops
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Need help? Contact us at support@isystem.com</p>
      </div>
    </Card>
  );
};
