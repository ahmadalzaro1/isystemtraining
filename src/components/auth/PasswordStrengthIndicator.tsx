import React from 'react';
import { Progress } from '@/components/ui/progress';
import { getPasswordStrengthColor, getPasswordStrengthProgress } from '@/utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  strength: 'weak' | 'fair' | 'good' | 'strong';
  errors: string[];
  show: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
  errors,
  show
}) => {
  if (!show) return null;

  const progress = getPasswordStrengthProgress(strength);
  const colorClass = getPasswordStrengthColor(strength);

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password Strength:</span>
        <span className={`text-sm font-medium ${colorClass}`}>
          {strength.charAt(0).toUpperCase() + strength.slice(1)}
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className={`h-2 ${
          strength === 'strong' ? '[&>div]:bg-green-600' :
          strength === 'good' ? '[&>div]:bg-blue-600' :
          strength === 'fair' ? '[&>div]:bg-yellow-600' : '[&>div]:bg-red-600'
        }`}
      />
      
      {errors.length > 0 && (
        <ul className="text-xs text-red-600 space-y-1 mt-2">
          {errors.map((error, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-red-500 mt-0.5">•</span>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};