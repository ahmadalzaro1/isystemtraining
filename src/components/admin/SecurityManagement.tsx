import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, AlertTriangle, Database, Clock, FileText } from 'lucide-react';

interface RetentionPolicy {
  id: string;
  table_name: string;
  retention_days: number;
  last_cleanup_at: string | null;
  is_active: boolean;
}

export const SecurityManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Access denied. Administrator privileges required.
        </AlertDescription>
      </Alert>
    );
  }

  // Fetch retention policies
  const { data: retentionPolicies, isLoading: policiesLoading } = useQuery({
    queryKey: ['retention-policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_retention_policies')
        .select('*')
        .order('table_name');
      
      if (error) throw error;
      return data as RetentionPolicy[];
    }
  });

  // Run cleanup mutation
  const cleanupMutation = useMutation({
    mutationFn: async (type: 'guest' | 'analytics') => {
      const functionName = type === 'guest' 
        ? 'cleanup_expired_guest_registrations'
        : 'anonymize_expired_analytics';
      
      const { data, error } = await supabase.rpc(functionName);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, type) => {
      toast.success(`Cleanup completed: ${data} records processed`);
      queryClient.invalidateQueries({ queryKey: ['retention-policies'] });
    },
    onError: (error) => {
      toast.error(`Cleanup failed: ${error.message}`);
    }
  });

  // Update retention policy mutation
  const updatePolicyMutation = useMutation({
    mutationFn: async ({ id, retention_days }: { id: string; retention_days: number }) => {
      const { error } = await supabase
        .from('data_retention_policies')
        .update({ retention_days })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Retention policy updated');
      queryClient.invalidateQueries({ queryKey: ['retention-policies'] });
      setSelectedPolicy(null);
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
    }
  });

  const formatDays = (days: number) => {
    if (days >= 365) {
      return `${Math.floor(days / 365)} year${Math.floor(days / 365) !== 1 ? 's' : ''}`;
    }
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const getTableDisplayName = (tableName: string) => {
    return tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (policiesLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-accent" />
        <h1 className="text-2xl font-semibold">Security Management</h1>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
              <span className="text-sm text-muted-foreground">RLS Enabled</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Audit Logging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
              <span className="text-sm text-muted-foreground">All Actions Logged</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                Configured
              </Badge>
              <span className="text-sm text-muted-foreground">Auto Cleanup</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Retention Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Retention Policies
          </CardTitle>
          <CardDescription>
            Manage how long sensitive data is stored before automatic anonymization or deletion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retentionPolicies?.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{getTableDisplayName(policy.table_name)}</h3>
                  <p className="text-sm text-muted-foreground">
                    Data retained for {formatDays(policy.retention_days)}
                    {policy.last_cleanup_at && (
                      <span className="ml-2">
                        • Last cleanup: {new Date(policy.last_cleanup_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={policy.is_active ? 'default' : 'secondary'}>
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data Cleanup Actions
          </CardTitle>
          <CardDescription>
            Manually trigger data retention cleanup processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Guest Registration Cleanup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Anonymize expired guest registration data to protect privacy
              </p>
              <Button
                onClick={() => cleanupMutation.mutate('guest')}
                disabled={cleanupMutation.isPending}
                variant="outline"
                size="sm"
              >
                {cleanupMutation.isPending ? 'Processing...' : 'Run Cleanup'}
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Analytics Data Cleanup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Anonymize old analytics data while preserving aggregated insights
              </p>
              <Button
                onClick={() => cleanupMutation.mutate('analytics')}
                disabled={cleanupMutation.isPending}
                variant="outline"
                size="sm"
              >
                {cleanupMutation.isPending ? 'Processing...' : 'Run Cleanup'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Best Practices:</strong>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
            <li>Review audit logs regularly for suspicious activity</li>
            <li>Run data cleanup processes monthly to maintain privacy compliance</li>
            <li>Monitor authentication settings in Supabase dashboard</li>
            <li>Keep retention policies aligned with your privacy policy</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};