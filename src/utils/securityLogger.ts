import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'auth_attempt' | 'admin_action' | 'data_access' | 'suspicious_activity';
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Simple security logging utility that doesn't depend on React context
export const securityLogger = {
  async logEvent(event: SecurityEvent) {
    try {
      // Get current user if available
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('analytics_events').insert({
        event_name: 'security_event',
        user_id: user?.id || null,
        event_data: {
          ...event,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          page_url: window.location.href
        },
        ip_address: null,
        session_id: null
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  },

  // Track failed authentication attempts
  createFailedAuthMonitor() {
    let failedAttempts = 0;
    const maxAttempts = 5;
    const timeWindow = 15 * 60 * 1000; // 15 minutes
    let firstAttempt = 0;

    return (isFailure: boolean) => {
      if (isFailure) {
        if (failedAttempts === 0) {
          firstAttempt = Date.now();
        }
        failedAttempts++;

        // Reset counter if time window exceeded
        if (Date.now() - firstAttempt > timeWindow) {
          failedAttempts = 1;
          firstAttempt = Date.now();
        }

        // Log suspicious activity if threshold exceeded
        if (failedAttempts >= maxAttempts) {
          this.logEvent({
            type: 'suspicious_activity',
            details: {
              event: 'multiple_failed_auth_attempts',
              attempts: failedAttempts,
              timeWindow: timeWindow / 1000 / 60 // minutes
            },
            severity: 'high'
          });
        }
      } else {
        // Reset on successful login
        failedAttempts = 0;
        firstAttempt = 0;
      }
    };
  }
};

// Create a global monitor for failed auth attempts
export const failedAuthMonitor = securityLogger.createFailedAuthMonitor();