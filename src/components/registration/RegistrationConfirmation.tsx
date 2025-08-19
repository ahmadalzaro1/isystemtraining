
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkshopRegistration } from "@/services/registrationService";
import { Workshop } from "@/types/workshop";
import { Calendar, Clock, MapPin, Mail, User, QrCode } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface RegistrationConfirmationProps {
  registration: WorkshopRegistration;
  workshop: Workshop;
}

export const RegistrationConfirmation = ({ 
  registration, 
  workshop 
}: RegistrationConfirmationProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-[hsl(var(--text-strong))]" />
          </div>
          <CardTitle className="text-2xl text-green-700">Registration Confirmed!</CardTitle>
          <Badge className="mx-auto bg-green-100 text-green-700 border-green-200">
            Confirmation Code: {registration.confirmation_code}
          </Badge>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{workshop.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{workshop.date.toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Workshop Date</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{formatTime(workshop.time)}</p>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Online Workshop</p>
                  <p className="text-sm text-muted-foreground">Join link will be sent 24h before</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{workshop.instructor}</p>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {registration.guest_email || 'Registered User'}
                  </p>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="space-y-1 text-sm text-[hsl(var(--text-strong))]">
              <li>• A confirmation email has been sent to your email address</li>
              <li>• You'll receive workshop materials 24 hours before the session</li>
              <li>• Join link and meeting details will be shared 1 hour before start time</li>
              <li>• Save your confirmation code: <span className="font-mono font-semibold">{registration.confirmation_code}</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
