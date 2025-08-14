import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Clock } from 'lucide-react';

interface SecurityAlertProps {
  type: 'session_timeout' | 'suspicious_activity' | 'data_anonymized';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({ type, message, severity }) => {
  const getIcon = () => {
    switch (type) {
      case 'session_timeout':
        return <Clock className="h-4 w-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};