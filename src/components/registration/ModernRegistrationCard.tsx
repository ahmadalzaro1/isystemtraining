
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Copy, Share, MoreHorizontal } from "lucide-react";
import { WorkshopRegistration } from "@/services/registrationService";
import { WorkshopService } from "@/services/workshopService";
import { Workshop } from "@/types/workshop";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModernRegistrationCardProps {
  registration: WorkshopRegistration;
  index: number;
}

export const ModernRegistrationCard = ({ registration, index }: ModernRegistrationCardProps) => {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    let isMounted = true;
    WorkshopService.getWorkshops()
      .then(list => {
        if (!isMounted) return;
        const found = list.find(w => w.id === registration.workshop_id) || null;
        setWorkshop(found);
      })
      .catch(() => setWorkshop(null));
    return () => { isMounted = false; };
  }, [registration.workshop_id]);
  
  if (!workshop) {
    return (
      <Card className="mb-4 opacity-50">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Workshop not found</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          color: 'bg-emerald-50 text-[hsl(var(--text-strong))] border-emerald-200/50',
          glow: 'shadow-emerald-500/10',
          accent: 'border-l-emerald-400'
        };
      case 'cancelled':
        return {
          color: 'bg-red-50 text-red-700 border-red-200/50',
          glow: 'shadow-red-500/10',
          accent: 'border-l-red-400'
        };
      case 'pending':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200/50',
          glow: 'shadow-amber-500/10',
          accent: 'border-l-amber-400'
        };
      default:
        return {
          color: 'bg-surface text-text-muted border-border/50',
          glow: 'shadow-elev-1',
          accent: 'border-l-[hsl(var(--border))]'
        };
    }
  };

  const statusConfig = getStatusConfig(registration.status);

  const copyConfirmationCode = () => {
    navigator.clipboard.writeText(registration.confirmation_code);
    toast.success("Confirmation code copied");
  };

  const shareRegistration = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${workshop.name} Registration`,
          text: `I'm registered for ${workshop.name} on ${workshop.date.toLocaleDateString()}`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      const shareText = `I'm registered for ${workshop.name} on ${workshop.date.toLocaleDateString()}. Confirmation: ${registration.confirmation_code}`;
      navigator.clipboard.writeText(shareText);
      toast.success("Registration details copied to clipboard");
    }
  };

  return (
    <Card 
      className={cn(
        "lgx-card rounded-2xl group relative overflow-hidden",
        "hover:shadow-elev-2 hover:-translate-y-1",
        "transition-all duration-500 ease-out will-change-transform",
        "border-l-4", statusConfig.accent,
        statusConfig.glow
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <CardContent className="p-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-text group-hover:text-text transition-colors">
              {workshop.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
              <User className="h-4 w-4" />
              <span>{workshop.instructor}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={cn("font-medium border", statusConfig.color)}>
              {registration.status.toUpperCase()}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={copyConfirmationCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Confirmation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareRegistration}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Registration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Workshop Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                <Calendar className="h-4 w-4 text-[hsl(var(--text-strong))]" />
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--text-strong))]">{workshop.date.toLocaleDateString()}</p>
                <p className="text-[hsl(var(--text-muted))] text-xs">Workshop Date</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--text-strong))]">{workshop.time}</p>
                <p className="text-[hsl(var(--text-muted))] text-xs">Duration</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--text-strong))]">Online Workshop</p>
                <p className="text-[hsl(var(--text-muted))] text-xs">Virtual Event</p>
              </div>
            </div>
            
            <div className="text-sm">
              <p className="font-medium text-[hsl(var(--text-strong))]">{workshop.skillLevel}</p>
              <p className="text-[hsl(var(--text-muted))] text-xs">Skill Level</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-[hsl(var(--text-muted))]">
            <span>Registered: {new Date(registration.registration_date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 bg-surface2 rounded text-xs font-mono text-[hsl(var(--text-muted))]">
              {registration.confirmation_code}
            </code>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={copyConfirmationCode}
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
