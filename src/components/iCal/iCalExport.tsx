import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { toast } from 'sonner';
import { Workshop } from '@/types/workshop';

interface iCalExportProps {
  workshops?: Workshop[];
  workshopId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

/**
 * Component for exporting workshop registrations to iCal format
 * Supports both single workshop and all registrations export
 */
export const iCalExport: React.FC<iCalExportProps> = ({ 
  workshops = [],
  workshopId, 
  variant = 'outline',
  size = 'default',
  className 
}) => {
  const { triggerHaptic } = useHapticFeedback();

  const generateiCalContent = (workshopsData: Workshop[]): string => {
    const now = new Date();
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    let icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//iSystem Training//Workshop Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:iSystem Training Workshops',
      'X-WR-CALDESC:Your registered iSystem Training workshops'
    ].join('\r\n') + '\r\n';

    workshopsData.forEach((workshop) => {
      const startDate = new Date(workshop.date);
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 2); // Assume 2-hour workshops

      const uid = `workshop-${workshop.id}@isystem-training.com`;
      const dtStamp = formatDate(now);
      const dtStart = formatDate(startDate);
      const dtEnd = formatDate(endDate);

      icalContent += [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${workshop.name}`,
        `DESCRIPTION:${workshop.description}\\n\\nLevel: ${workshop.skillLevel}\\nTime: ${workshop.time}\\nInstructor: ${workshop.instructor}`,
        `LOCATION:iSystem Training Center`,
        `STATUS:CONFIRMED`,
        `TRANSP:OPAQUE`,
        `CATEGORIES:${workshop.category}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT30M',
        'ACTION:DISPLAY',
        'DESCRIPTION:Workshop starting in 30 minutes',
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n') + '\r\n';
    });

    icalContent += 'END:VCALENDAR\r\n';
    return icalContent;
  };

  const handleExport = (): void => {
    try {
      triggerHaptic('light');
      
      let workshopsToExport = workshops;
      let filename = 'isystem-workshops.ics';
      
      if (workshopId) {
        const workshop = workshops.find(w => w.id === workshopId);
        if (!workshop) {
          toast.error('Workshop not found');
          return;
        }
        workshopsToExport = [workshop];
        filename = `${workshop.name.toLowerCase().replace(/\s+/g, '-')}.ics`;
      }

      const icalContent = generateiCalContent(workshopsToExport);
      
      // Create and download the file
      const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success(
        workshopId 
          ? 'Workshop exported to calendar' 
          : 'All workshops exported to calendar'
      );
      
    } catch (error) {
      console.error('iCal export failed:', error);
      toast.error('Failed to export calendar. Please try again.');
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant={variant}
      size={size}
      className={className}
      aria-label={workshopId ? 'Export workshop to calendar' : 'Export all workshops to calendar'}
    >
      <Calendar className="h-4 w-4 mr-2" />
      {workshopId ? 'Add to Calendar' : 'Export Calendar'}
      <Download className="h-4 w-4 ml-2" />
    </Button>
  );
};