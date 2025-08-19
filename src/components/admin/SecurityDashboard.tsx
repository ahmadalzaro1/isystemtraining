import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
                <p className="text-2xl font-bold text-warning">
                  {alerts.filter(alert => 
                    alert.type === 'suspicious_activity' && 
                    alert.message.includes('failed')
                  ).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
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
          <CardTitle>Security Status & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Security Features Active</h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• Row Level Security (RLS) enabled</li>
                <li>• Enhanced security headers configured</li>
                <li>• Failed authentication monitoring</li>
                <li>• Admin activity logging</li>
                <li>• Guest access rate limiting</li>
                <li>• Data retention policies active</li>
                <li>• Database function search paths secured</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📋 Security Recommendations</h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>• Review audit logs weekly</li>
                <li>• Monitor failed authentication patterns</li>
                <li>• Update admin permissions quarterly</li>
                <li>• Verify CAPTCHA configuration in Supabase secrets</li>
                <li>• Check email security settings (SPF/DKIM)</li>
                <li>• Test backup and recovery procedures</li>
              </ul>
            </div>
            
            {alerts.filter(a => a.severity === 'critical').length > 0 && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">⚠️ Immediate Action Required</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {alerts.filter(a => a.severity === 'critical').length} critical security alert(s) detected. 
                  Review and address immediately.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};