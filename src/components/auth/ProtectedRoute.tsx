import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-background" 
        role="status" 
        aria-label="Checking authentication"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    toast.error('Authentication required', {
      description: 'Please sign in to access this page'
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    toast.error('Access denied', {
      description: 'Administrator privileges required'
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
};