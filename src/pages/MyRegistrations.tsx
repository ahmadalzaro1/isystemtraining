
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRegistrations, useGuestRegistrations, useConfirmationLookup } from "@/hooks/useRegistrations";
import { useAuth } from "@/contexts/AuthContext";
import { Search, ArrowLeft, Filter, Download, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModernRegistrationCard } from "@/components/registration/ModernRegistrationCard";
import { RegistrationHero } from "@/components/registration/RegistrationHero";
import { EmptyRegistrationState } from "@/components/registration/EmptyRegistrationState";
import { RegistrationSkeleton } from "@/components/registration/RegistrationSkeleton";
import { WorkshopRegistration } from "@/services/registrationService";

const GuestLookup = () => {
  const [email, setEmail] = useState("");
  const { registrations, isLoading } = useGuestRegistrations(email);
  const { registration, confirmationCode, setConfirmationCode, isLoading: isLookupLoading } = useConfirmationLookup();

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            Find Your Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-3 block text-gray-700">
                Search by Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-3 block text-gray-700">
                Or Confirmation Code
              </label>
              <Input
                placeholder="Enter your confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {(isLoading || isLookupLoading) && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Searching for your registration...</p>
        </div>
      )}

      {registration && (
        <div>
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Found Your Registration</h3>
          <ModernRegistrationCard registration={registration} index={0} />
        </div>
      )}

      {email && registrations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            Your Registrations ({registrations.length})
          </h3>
          <div className="space-y-4">
            {registrations.map((registration, index) => (
              <ModernRegistrationCard 
                key={registration.id} 
                registration={registration} 
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {email && !isLoading && registrations.length === 0 && email.length > 0 && (
        <Card className="border-0 bg-gray-50/50 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No Registrations Found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any registrations for this email address.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setEmail("")}
              className="bg-white hover:bg-gray-50"
            >
              Try Different Email
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const MyRegistrations = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { registrations, isLoading } = useRegistrations();
  const [searchQuery, setSearchQuery] = useState("");

  // Remove debug logs from production
  const filteredRegistrations = registrations.filter(registration =>
    searchQuery === "" || 
    registration.workshop_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    registration.confirmation_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto p-4 lg:p-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="h-4 w-px bg-gray-300" />
          
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Workshop Registrations
          </h1>
        </div>

        {user ? (
          <div className="space-y-8">
            {isLoading ? (
              <RegistrationSkeleton />
            ) : (
              <>
                <RegistrationHero 
                  registrations={registrations} 
                  userName={profile?.first_name}
                />

                {registrations.length === 0 ? (
                  <EmptyRegistrationState />
                ) : (
                  <div className="space-y-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search registrations or confirmation codes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-11 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300"
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>

                    {/* Registration Cards */}
                    <div className="space-y-4">
                      {filteredRegistrations.map((registration, index) => (
                        <ModernRegistrationCard 
                          key={registration.id} 
                          registration={registration} 
                          index={index}
                        />
                      ))}
                    </div>

                    {filteredRegistrations.length === 0 && searchQuery && (
                      <Card className="border-0 bg-white/50 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">No Results Found</h3>
                          <p className="text-gray-500 mb-4">
                            Try adjusting your search terms or clearing the filter.
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setSearchQuery("")}
                            className="bg-white hover:bg-gray-50"
                          >
                            Clear Search
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
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
