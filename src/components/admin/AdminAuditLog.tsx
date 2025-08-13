import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Eye, Clock, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuditLogEntry {
  id: string;
  admin_email: string;
  target_email: string;
  action: string;
  details: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export const AdminAuditLog = () => {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(0);
  const limit = 50;

  // Guard against non-admin access
  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Access denied. Administrator privileges required.</p>
      </div>
    );
  }

  const { data: auditLogs, isLoading, error } = useQuery({
    queryKey: ['admin-audit-logs', page],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_audit_logs', {
        limit_count: limit,
        offset_count: page * limit
      });

      if (error) throw error;
      return data as AuditLogEntry[];
    }
  });

  const getActionBadge = (action: string) => {
    const variants: Record<string, string> = {
      'ADMIN_GRANTED': 'default',
      'ADMIN_GRANTED_SECURE': 'default',
      'ADMIN_REVOKED': 'destructive',
      'ADMIN_REVOKED_SECURE': 'destructive',
      'ADMIN_USER_DELETED': 'destructive'
    };

    return (
      <Badge variant={variants[action] as any || 'secondary'}>
        {action.replace('_', ' ')}
      </Badge>
    );
  };

  const formatUserAgent = (userAgent: string) => {
    if (!userAgent) return 'Unknown';
    
    // Extract browser info
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return 'Unknown Browser';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Loading audit logs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load audit logs: {(error as Error).message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Admin Security Audit Log</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track all administrative actions and privilege changes for security monitoring.
          </p>
        </CardHeader>
        <CardContent>
          {!auditLogs || auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audit log entries found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Admin User</TableHead>
                    <TableHead>Target User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{entry.admin_email || 'System'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{entry.target_email || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        {getActionBadge(entry.action)}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          {entry.details?.method && (
                            <div>Method: {entry.details.method}</div>
                          )}
                          {entry.details?.previous_status !== undefined && (
                            <div>
                              {entry.details.previous_status ? 'Was Admin' : 'Was User'} → {' '}
                              {entry.details.new_status ? 'Now Admin' : 'Now User'}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>{formatUserAgent(entry.user_agent)}</div>
                          {entry.ip_address && (
                            <div className="text-muted-foreground">{entry.ip_address}</div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {page * limit + 1} to {Math.min((page + 1) * limit, (page + 1) * limit)} entries
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!auditLogs || auditLogs.length < limit}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};