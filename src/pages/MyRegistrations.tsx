
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRegistrations, useGuestRegistrations, useConfirmationLookup } from "@/hooks/useRegistrations";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, MapPin, User, Mail, Phone, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkshops } from "@/data/mockWorkshops";
import { WorkshopRegistration } from "@/services/registrationService";

const RegistrationCard = ({ registration }: { registration: WorkshopRegistration }) => {
  const workshop = mockWorkshops.find(w => w.id === registration.workshop_id);
  
  if (!workshop) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <p className="text-muted-foreground">Workshop not found</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{workshop.name}</CardTitle>
            <Badge className={`mt-2 ${getStatusColor(registration.status)}`}>
              {registration.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Confirmation: <span className="font-mono">{registration.confirmation_code}</span></p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{workshop.date.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{workshop.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Online Workshop</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Level:</span> {workshop.skillLevel}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Category:</span> {workshop.category}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Registered:</span> {new Date(registration.registration_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GuestLookup = () => {
  const [email, setEmail] = useState("");
  const { registrations, isLoading } = useGuestRegistrations(email);
  const { registration, confirmationCode, setConfirmationCode, isLoading: isLookupLoading } = useConfirmationLookup();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Lookup Your Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Email Address</label>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <Separator />
          
          <div>
            <label className="text-sm font-medium mb-2 block">Or Confirmation Code</label>
            <Input
              placeholder="Enter your confirmation code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading && <p className="text-center text-muted-foreground">Loading...</p>}
      {isLookupLoading && <p className="text-center text-muted-foreground">Looking up registration...</p>}

      {registration && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Found Registration</h3>
          <RegistrationCard registration={registration} />
        </div>
      )}

      {email && registrations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Registrations ({registrations.length})</h3>
          {registrations.map((registration) => (
            <RegistrationCard key={registration.id} registration={registration} />
          ))}
        </div>
      )}

      {email && !isLoading && registrations.length === 0 && email.length > 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No registrations found for this email address.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const MyRegistrations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { registrations, isLoading } = useRegistrations();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">My Workshop Registrations</h1>
        </div>

        {user ? (
          <div>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading your registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">You haven't registered for any workshops yet.</p>
                  <Button onClick={() => navigate('/')}>
                    Browse Available Workshops
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Your Registrations ({registrations.length})</h2>
                  {registrations.map((registration) => (
                    <RegistrationCard key={registration.id} registration={registration} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <GuestLookup />
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
