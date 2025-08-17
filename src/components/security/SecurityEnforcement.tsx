import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { securityLogger } from '@/utils/securityLogger';
import { checkGuestAccessRateLimit } from '@/utils/guestDataSecurity';

interface SecurityEnforcementProps {
  children: React.ReactNode;
}

export const SecurityEnforcement: React.FC<SecurityEnforcementProps> = ({ children }) => {
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Enhanced security monitoring initialization
    const initializeSecurityMonitoring = async () => {
      // Log application start
      await securityLogger.logEvent({
        type: 'auth_attempt',
        details: {
          event: 'application_initialized',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          hasUser: !!user,
          isAdmin: isAdmin
        },
        severity: 'low'
      });

      // Check for security violations in URL/query params
      const urlParams = new URLSearchParams(window.location.search);
      const suspiciousPatterns = [
        'script', 'javascript:', 'data:', 'vbscript:', 'onload', 'onerror',
        'eval(', 'alert(', 'confirm(', 'prompt(', '<script', '</script'
      ];

      urlParams.forEach((value, key) => {
        const combined = `${key}=${value}`.toLowerCase();
        if (suspiciousPatterns.some(pattern => combined.includes(pattern))) {
          securityLogger.logEvent({
            type: 'suspicious_activity',
            details: {
              event: 'suspicious_url_parameter',
              parameter: key,
              value: value.substring(0, 100), // Limit logged value length
              fullUrl: window.location.href
            },
            severity: 'high'
          });
        }
      });

      // Monitor for rapid navigation patterns (potential bot behavior)
      let navigationCount = 0;
      let lastNavigation = Date.now();
      
      const navigationMonitor = () => {
        const now = Date.now();
        if (now - lastNavigation < 1000) { // Less than 1 second between navigations
          navigationCount++;
          if (navigationCount > 5) { // More than 5 rapid navigations
            securityLogger.logEvent({
              type: 'suspicious_activity',
              details: {
                event: 'rapid_navigation_pattern',
                navigationCount,
                timeWindow: now - lastNavigation,
                userAgent: navigator.userAgent
              },
              severity: 'medium'
            });
          }
        } else {
          navigationCount = 0;
        }
        lastNavigation = now;
      };

      // Add navigation monitoring
      window.addEventListener('beforeunload', navigationMonitor);
      window.addEventListener('popstate', navigationMonitor);

      return () => {
        window.removeEventListener('beforeunload', navigationMonitor);
        window.removeEventListener('popstate', navigationMonitor);
      };
    };

    initializeSecurityMonitoring();
  }, [user, isAdmin]);

  // Guest access rate limiting
  useEffect(() => {
    if (!user) {
      const checkRateLimit = async () => {
        try {
          const result = await checkGuestAccessRateLimit();
          if (result.blocked) {
            // Could redirect to a rate-limited page or show a message
            console.warn('Guest access rate limit exceeded');
          }
        } catch (error) {
          console.error('Rate limit check failed:', error);
        }
      };

      checkRateLimit();
    }
  }, [user]);

  // CSP Violation Reporting
  useEffect(() => {
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      securityLogger.logEvent({
        type: 'suspicious_activity',
        details: {
          event: 'csp_violation',
          blockedUri: event.blockedURI,
          documentUri: event.documentURI,
          violatedDirective: event.violatedDirective,
          originalPolicy: event.originalPolicy
        },
        severity: 'high'
      });
    };

    document.addEventListener('securitypolicyviolation', handleCSPViolation);

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, []);

  return <>{children}</>;
};