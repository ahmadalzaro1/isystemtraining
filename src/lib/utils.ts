import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string): string {
  // Parse time string (e.g., "18:00" or "09:30")
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return time; // Return original if parsing fails
  }
  
  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  // Format with or without minutes
  if (minutes === 0) {
    return `${displayHours} ${period}`;
  } else {
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}
