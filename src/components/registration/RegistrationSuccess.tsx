
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Registration Complete! 🎉</CardTitle>
        <CardDescription className="text-lg">
          Welcome aboard, {registrationData.name}! You're all set for {workshop.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Registration Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Your Registration Details</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
              <span className="font-medium">Name</span>
              <span>{registrationData.name}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
              <span className="font-medium">Email</span>
              <span>{registrationData.email}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
              <span className="font-medium">Phone</span>
              <span>{registrationData.phone}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
              <span className="font-medium">Contact Preference</span>
              <span className="capitalize">{registrationData.contactPreference}</span>
            </div>
          </div>
        </div>

        {/* Workshop Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Workshop Information</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
              <span className="font-medium">Date</span>
              <span>{workshop.date.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
              <span className="font-medium">Time</span>
              <span>{workshop.time}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
              <span className="font-medium">Category</span>
              <span className="capitalize">{workshop.category}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-lg">
              <span className="font-medium">Skill Level</span>
              <span className="capitalize">{workshop.skillLevel}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="grid w-full gap-4">
          <Button 
            variant="outline" 
            onClick={addToCalendar}
            className="w-full"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleShareWorkshop}
            className="w-full"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share with Friends
          </Button>

          <Button 
            onClick={onViewWorkshops}
            className="w-full"
          >
            Browse More Workshops
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Need help? Contact us at support@isystem.com
        </p>
      </CardFooter>
    </Card>
  );
};
