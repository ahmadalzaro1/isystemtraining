import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Calendar, Mail, QrCode, Share2, Clock } from "lucide-react";
import { format } from "date-fns";
import { Workshop } from "@/types/registration";

interface RegistrationSuccessProps {
  workshop: Workshop;
  onViewWorkshops: () => void;
}

export const RegistrationSuccess = ({ workshop, onViewWorkshops }: RegistrationSuccessProps) => {
  const [friendEmail, setFriendEmail] = useState("");

  const handleAddToCalendar = (type: 'google' | 'apple') => {
    // Format the event details
    const eventDetails = {
      text: workshop.name,
      dates: workshop.date.toISOString(),
      details: workshop.description,
      location: workshop.location,
    };

    // Create calendar URLs (these are simplified examples)
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventDetails.text
    )}&dates=${eventDetails.dates}&details=${encodeURIComponent(
      eventDetails.details
    )}&location=${encodeURIComponent(eventDetails.location)}`;

    const appleUrl = `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(
      eventDetails.text
    )}.ics`;

    // Open calendar in new window
    window.open(type === 'google' ? googleUrl : appleUrl, '_blank');
    
    toast.success("Calendar invite created!", {
      description: "Check your calendar app to confirm the event.",
    });
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail) return;

    // This would typically connect to a backend service
    toast.success("Invitation sent!", {
      description: `We've sent an invitation to ${friendEmail}`,
    });
    setFriendEmail("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <QrCode className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-primary">
          You're All Set!
        </h1>
        <p className="text-xl text-gray-600">
          Get ready for an amazing learning experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Add to Calendar</h3>
              <p className="text-sm text-gray-600 mb-3">
                Don't miss the workshop on {format(workshop.date, "MMMM d, yyyy")} at{" "}
                {workshop.time}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToCalendar('google')}
                >
                  Google Calendar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToCalendar('apple')}
                >
                  Apple Calendar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Newsletter Subscription</h3>
              <p className="text-sm text-gray-600">
                You're now subscribed to our weekly newsletter featuring Apple tips,
                app recommendations, and updates
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Invite a Friend</h3>
              <p className="text-sm text-gray-600 mb-3">
                Know someone who might be interested? Invite them to join!
              </p>
              <form onSubmit={handleInviteFriend} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Send Invite</Button>
              </form>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Workshop Details</h3>
              <div className="space-y-2 mt-3">
                <p className="text-lg font-medium">{workshop.name}</p>
                <p className="text-gray-600">{workshop.description}</p>
                <p className="text-sm text-gray-500">
                  {format(workshop.date, "EEEE, MMMM d, yyyy")} at {workshop.time}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={onViewWorkshops}
              >
                View More Workshops
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
