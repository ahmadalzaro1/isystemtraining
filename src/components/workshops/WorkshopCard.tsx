
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, CheckCircle } from "lucide-react";
import { Workshop } from "@/types/workshop";

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopCard = ({ workshop, onSelect }: WorkshopCardProps) => {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-all cursor-pointer animate-fade-up group bg-white"
      onClick={() => onSelect(workshop)}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-xl group-hover:text-primary transition-colors">
            {workshop.name}
          </h3>
          <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
            workshop.spotsRemaining <= 5 
              ? 'bg-red-50 text-red-600 animate-pulse' 
              : 'bg-green-50 text-green-600'
          }`}>
            <Users className="h-4 w-4" />
            {workshop.spotsRemaining} spots
          </span>
        </div>
        
        <p className="text-gray-600 leading-relaxed">
          {workshop.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{workshop.time}</span>
          </div>
          <Button 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Register Now
          </Button>
        </div>
      </div>
    </Card>
  );
};
