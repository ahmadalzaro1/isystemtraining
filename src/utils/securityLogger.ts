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

// Track failed authentication attempts with enhanced security
  createFailedAuthMonitor() {
    let failedAttempts = 0;
    const maxAttempts = 3; // Reduced from 5 for tighter security
    const timeWindow = 10 * 60 * 1000; // Reduced to 10 minutes
    const blockDuration = 30 * 60 * 1000; // 30 minute block
    let firstAttempt = 0;
    let isBlocked = false;
    let blockStartTime = 0;

    return (isFailure: boolean) => {
      const now = Date.now();
      
      // Check if still blocked
      if (isBlocked && (now - blockStartTime < blockDuration)) {
        if (isFailure) {
          this.logEvent({
            type: 'suspicious_activity',
            details: {
              event: 'auth_attempt_while_blocked',
              blockTimeRemaining: Math.ceil((blockDuration - (now - blockStartTime)) / 60000),
              attempts: failedAttempts
            },
            severity: 'critical'
          });
        }
        return;
      }
      
      // Reset block if duration passed
      if (isBlocked && (now - blockStartTime >= blockDuration)) {
        isBlocked = false;
        failedAttempts = 0;
        firstAttempt = 0;
      }

      if (isFailure) {
        if (failedAttempts === 0) {
          firstAttempt = now;
        }
        failedAttempts++;

        // Reset counter if time window exceeded
        if (now - firstAttempt > timeWindow) {
          failedAttempts = 1;
          firstAttempt = now;
        }

        // Log warning at half threshold
        if (failedAttempts >= Math.ceil(maxAttempts / 2)) {
          this.logEvent({
            type: 'suspicious_activity',
            details: {
              event: 'approaching_auth_limit',
              attempts: failedAttempts,
              maxAttempts: maxAttempts,
              timeWindow: timeWindow / 1000 / 60
            },
            severity: 'medium'
          });
        }

        // Block and log critical event if threshold exceeded
        if (failedAttempts >= maxAttempts) {
          isBlocked = true;
          blockStartTime = now;
          
          this.logEvent({
            type: 'suspicious_activity',
            details: {
              event: 'auth_attempts_blocked',
              attempts: failedAttempts,
              timeWindow: timeWindow / 1000 / 60,
              blockDuration: blockDuration / 1000 / 60,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString()
            },
            severity: 'critical'
          });
        }
      } else {
        // Reset on successful login
        failedAttempts = 0;
        firstAttempt = 0;
        isBlocked = false;
        blockStartTime = 0;
        
        // Log successful login after previous failures
        const previousFailures = failedAttempts;
        if (previousFailures > 0) {
          this.logEvent({
            type: 'auth_attempt',
            details: {
              event: 'successful_login_after_failures',
              previousFailures: previousFailures
            },
            severity: 'low'
          });
        }
      }
    };
  }
};

// Create a global monitor for failed auth attempts
export const failedAuthMonitor = securityLogger.createFailedAuthMonitor();