
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { WorkshopRegistration } from "@/services/registrationService";
import { cn } from "@/lib/utils";

interface RegistrationHeroProps {
  registrations: WorkshopRegistration[];
  userName?: string;
}

export const RegistrationHero = ({ registrations, userName }: RegistrationHeroProps) => {
  const confirmedCount = registrations.filter(r => r.status === 'confirmed').length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const totalCount = registrations.length;

  const upcomingRegistrations = registrations.filter(r => {
    const registrationDate = new Date(r.registration_date);
    return registrationDate > new Date() && r.status === 'confirmed';
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 rounded-3xl" 
           style={{ animation: 'gradientShift 15s ease infinite' }} />
      
      <Card className="relative border-0 bg-white/60 backdrop-blur-xl shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}{userName ? `, ${userName}` : ''}
              </h1>
              <p className="text-gray-600 text-lg">
                {totalCount === 0 
                  ? "Ready to start your learning journey?"
                  : `You have ${totalCount} workshop${totalCount === 1 ? '' : 's'} registered`
                }
              </p>
            </div>

            {/* Stats Grid */}
            {totalCount > 0 && (
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2",
                    "bg-emerald-100 text-emerald-700"
                  )}>
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{confirmedCount}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Confirmed</div>
                </div>

                <div className="text-center">
                  <div className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2",
                    "bg-amber-100 text-amber-700"
                  )}>
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Pending</div>
                </div>

                <div className="text-center">
                  <div className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2",
                    "bg-blue-100 text-blue-700"
                  )}>
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{upcomingRegistrations.length}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Upcoming</div>
                </div>
              </div>
            )}
          </div>

          {/* Next Workshop Preview */}
          {upcomingRegistrations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Next Workshop</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {new Date(upcomingRegistrations[0].registration_date).toLocaleDateString()}
                </Badge>
                <span className="text-gray-600">
                  Your next learning session is coming up!
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
