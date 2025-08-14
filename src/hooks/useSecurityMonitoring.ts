import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'auth_attempt' | 'admin_action' | 'data_access' | 'suspicious_activity';
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const useSecurityMonitoring = () => {
  // Don't use useAuth to avoid circular dependency
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get current user and admin status directly from Supabase
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();
        setIsAdmin(profile?.is_admin || false);
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('is_admin')
            .eq('user_id', session.user.id)
            .single();
          setIsAdmin(profile?.is_admin || false);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    try {
      // Log to analytics events table for monitoring
      await supabase.from('analytics_events').insert({
        event_name: 'security_event',
        user_id: user?.id || null,
        event_data: {
          ...event,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          page_url: window.location.href
        },
        ip_address: null, // Will be populated by database trigger if needed
        session_id: null
      });

      // For critical events, also log to audit log if user is admin
      if (event.severity === 'critical' && isAdmin) {
        await supabase.rpc('log_sensitive_data_access', {
          p_table_name: 'security_monitoring',
          p_operation: event.type,
          p_user_agent: navigator.userAgent
        });
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [user, isAdmin]);

  const monitorFailedAuthAttempts = useCallback(() => {
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
          logSecurityEvent({
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
  }, [logSecurityEvent]);

  const monitorAdminActions = useCallback((action: string, targetData?: any) => {
    if (isAdmin) {
      logSecurityEvent({
        type: 'admin_action',
        details: {
          action,
          targetData: targetData ? {
            id: targetData.id,
            type: targetData.constructor?.name || 'unknown'
          } : null
        },
        severity: action.includes('delete') || action.includes('admin') ? 'high' : 'medium'
      });
    }
  }, [isAdmin, logSecurityEvent]);

  const monitorDataAccess = useCallback((tableName: string, operation: string, recordCount?: number) => {
    // Only log bulk data access or sensitive table access
    const sensitiveOperations = ['bulk_export', 'mass_delete', 'admin_view'];
    const sensitiveTables = ['user_profiles', 'workshop_registrations', 'admin_audit_log'];
    
    if (sensitiveOperations.includes(operation) || sensitiveTables.includes(tableName)) {
      logSecurityEvent({
        type: 'data_access',
        details: {
          tableName,
          operation,
          recordCount: recordCount || 1
        },
        severity: operation.includes('bulk') || operation.includes('mass') ? 'high' : 'medium'
      });
    }
  }, [logSecurityEvent]);

  // Monitor page visibility changes for session security
  useEffect(() => {
    let hiddenTime: number;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTime = Date.now();
      } else {
        const timeHidden = Date.now() - hiddenTime;
        // If page was hidden for more than 30 minutes and user is admin, log it
        if (timeHidden > 30 * 60 * 1000 && isAdmin) {
          logSecurityEvent({
            type: 'suspicious_activity',
            details: {
              event: 'long_inactive_admin_session',
              inactiveMinutes: Math.floor(timeHidden / 1000 / 60)
            },
            severity: 'medium'
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAdmin, logSecurityEvent]);

  // Monitor unusual navigation patterns
  useEffect(() => {
    let pageViews: string[] = [];
    const maxPageViews = 50; // Track last 50 page views
    
    const logPageView = () => {
      pageViews.push(window.location.pathname);
      if (pageViews.length > maxPageViews) {
        pageViews = pageViews.slice(-maxPageViews);
      }

      // Detect rapid navigation (potential bot behavior)
      if (pageViews.length >= 10) {
        const recentViews = pageViews.slice(-10);
        const uniquePages = new Set(recentViews).size;
        
        if (uniquePages > 8) { // Visiting 8+ different pages in last 10 views
          logSecurityEvent({
            type: 'suspicious_activity',
            details: {
              event: 'rapid_navigation_pattern',
              uniquePagesInLast10: uniquePages,
              pattern: recentViews
            },
            severity: 'medium'
          });
        }
      }
    };

    logPageView();
    window.addEventListener('popstate', logPageView);
    
    return () => window.removeEventListener('popstate', logPageView);
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    monitorFailedAuthAttempts: monitorFailedAuthAttempts(),
    monitorAdminActions,
    monitorDataAccess
  };
};