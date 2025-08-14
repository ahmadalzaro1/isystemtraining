import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export const SecurityNotification: React.FC = () => {
  return (
    <Alert className="mb-6 border-green-200 bg-green-50">
      <Shield className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <strong>Security Enhancement Complete</strong>
        </div>
        <p className="mt-2 text-sm">
          Guest registration data is now protected with enhanced security measures. 
          All guest access now requires proper confirmation codes to prevent unauthorized data access.
        </p>
      </AlertDescription>
    </Alert>
  );
};