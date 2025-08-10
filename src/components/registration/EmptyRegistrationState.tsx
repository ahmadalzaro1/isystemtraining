
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyRegistrationState = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="relative mb-8">
          {/* Floating Icons Animation */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-6">
            <Calendar className="h-10 w-10 text-purple-600 animate-pulse" />
            
            {/* Floating decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-200 animate-bounce" 
                 style={{ animationDelay: '0.5s' }}>
              <Sparkles className="h-4 w-4 text-yellow-600 m-1" />
            </div>
            
            <div className="absolute -bottom-1 -left-2 w-5 h-5 rounded-full bg-green-200 animate-bounce"
                 style={{ animationDelay: '1s' }}>
              <BookOpen className="h-3 w-3 text-green-600 m-1" />
            </div>
          </div>
        </div>

        <h2 className="text-[28px] leading-[32px] font-bold text-gray-900 mb-3">
          Your Learning Journey Starts Here
        </h2>
        
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          You haven't registered for any workshops yet. Discover amazing learning opportunities 
          and start building new skills today.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-[hsl(var(--text-strong))] px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            Browse Available Workshops
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-[hsl(var(--text-muted))]">
            Join thousands of learners advancing their skills
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-100">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Easy Scheduling</h3>
            <p className="text-sm text-[hsl(var(--text-muted))]">Pick times that work for you</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Expert Instructors</h3>
            <p className="text-sm text-[hsl(var(--text-muted))]">Learn from industry professionals</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Instant Access</h3>
            <p className="text-sm text-[hsl(var(--text-muted))]">Start learning immediately</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
