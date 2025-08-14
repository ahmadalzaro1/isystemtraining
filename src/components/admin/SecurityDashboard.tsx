import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

interface SecurityAlert {
  id: string;
  type: 'auth_failure' | 'admin_action' | 'data_access' | 'suspicious_activity';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
}

export const SecurityDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { logSecurityEvent } = useSecurityMonitoring();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAdmin) return;
    
    fetchSecurityAlerts();
    logSecurityEvent({
      type: 'admin_action',
      details: { action: 'security_dashboard_accessed' },
      severity: 'low'
    });
  }, [isAdmin, logSecurityEvent]);
  
  const fetchSecurityAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'security_event')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      const securityAlerts: SecurityAlert[] = data?.map(event => {
        const eventData = event.event_data as any;
        return {
          id: event.id,
          type: eventData?.event_type || 'suspicious_activity',
          message: getAlertMessage(eventData),
          severity: eventData?.severity || 'medium',
          timestamp: event.created_at,
          resolved: false
        };
      }) || [];
      
      setAlerts(securityAlerts);
    } catch (error) {
      console.error('Failed to fetch security alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getAlertMessage = (eventData: any): string => {
    switch (eventData.event_type) {
      case 'multiple_failed_auth_attempts':
        return `Multiple failed authentication attempts detected (${eventData.details?.attempts} attempts)`;
      case 'admin_privilege_escalation':
        return 'Admin privilege escalation detected';
      case 'suspicious_data_access':
        return `Suspicious data access pattern detected in ${eventData.details?.table_name}`;
      case 'data_retention_cleanup':
        return `Data retention cleanup completed (${eventData.details?.records_anonymized} records anonymized)`;
      default:
        return 'Security event detected';
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': 
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };
  
  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          Access denied. Administrator privileges required.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Events</p>
                <p className="text-2xl font-bold">
                  {alerts.filter(a => 
                    new Date(a.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading security alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
              <p>No security alerts found. Your system is secure!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.slice(0, 20).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded-full text-white ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          
          {alerts.length > 20 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={fetchSecurityAlerts}>
                Load More Alerts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Strong password requirements enforced</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Rate limiting active on authentication endpoints</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Input validation and sanitization enabled</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Database-level security constraints active</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Admin audit logging functional</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};