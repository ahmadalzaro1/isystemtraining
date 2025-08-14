import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { securityLogger } from '@/utils/securityLogger';

const ADMIN_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute

export const useAdminSessionTracking = () => {
  const { user, isAdmin } = useAuth();
  const lastActivityRef = useRef(Date.now());
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAdmin || !user) return;

    // Track admin session start
    const trackSession = async () => {
      try {
        await supabase.rpc('track_admin_session', {
          p_ip_address: null, // IP will be captured by database
          p_user_agent: navigator.userAgent
        });
      } catch (error) {
        console.error('Failed to track admin session:', error);
      }
    };

    trackSession();

    // Set up activity monitoring
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Monitor user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Check for session timeout
    const checkTimeout = () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      if (timeSinceLastActivity > ADMIN_SESSION_TIMEOUT) {
        // Log security event for admin session timeout
        securityLogger.logEvent({
          type: 'admin_action',
          details: {
            event: 'admin_session_timeout',
            timeout_minutes: ADMIN_SESSION_TIMEOUT / 60000
          },
          severity: 'medium'
        });

        // Force logout for security
        window.location.href = '/auth?reason=session_timeout';
      }
    };

    // Set up periodic timeout checks
    sessionTimeoutRef.current = setInterval(checkTimeout, ACTIVITY_CHECK_INTERVAL);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (sessionTimeoutRef.current) {
        clearInterval(sessionTimeoutRef.current);
      }
    };
  }, [isAdmin, user]);

  return {
    lastActivity: lastActivityRef.current,
    timeoutInMinutes: ADMIN_SESSION_TIMEOUT / 60000
  };
};