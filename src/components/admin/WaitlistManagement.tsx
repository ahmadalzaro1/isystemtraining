import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { Download, Search, Mail, UserPlus, Trash2, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface WaitlistEntry {
  id: string;
  workshop_id: string;
  email: string;
  name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  notified_at: string | null;
  workshop?: {
    id: string;
    name: string;
    date: string;
    time: string;
    spots_remaining: number;
    max_capacity: number;
  } | null;
}

const WaitlistManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('all');

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Access denied. Administrator privileges required.</p>
      </div>
    );
  }

  // Fetch workshops for filter dropdown
  const { data: workshops = [] } = useQuery({
    queryKey: ['workshops-for-waitlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select('id, name, date, time, spots_remaining, max_capacity')
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Fetch waitlist entries
  const { data: waitlistEntries = [], isLoading } = useQuery({
    queryKey: ['waitlist-entries'],
    queryFn: async () => {
      const { data: waitlistData, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get workshop details
      const workshopIds = [...new Set(waitlistData.map(w => w.workshop_id))];
      const { data: workshopData } = await supabase
        .from('workshops')
        .select('id, name, date, time, spots_remaining, max_capacity')
        .in('id', workshopIds);

      return waitlistData.map(entry => ({
        ...entry,
        workshop: workshopData?.find(w => w.id === entry.workshop_id) || null,
      })) as WaitlistEntry[];
    },
  });

  // Delete waitlist entry mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('waitlist')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-entries'] });
      toast.success('Removed from waitlist');
    },
    onError: () => {
      toast.error('Failed to remove from waitlist');
    },
  });

  // Mark as notified mutation
  const notifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('waitlist')
        .update({ status: 'notified', notified_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-entries'] });
      toast.success('Marked as notified');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  // Convert to registration mutation
  const convertMutation = useMutation({
    mutationFn: async (entry: WaitlistEntry) => {
      // Check if workshop has spots
      const { data: workshop } = await supabase
        .from('workshops')
        .select('spots_remaining')
        .eq('id', entry.workshop_id)
        .single();

      if (!workshop || workshop.spots_remaining <= 0) {
        throw new Error('Workshop is full');
      }

      // Create registration using the RPC function
      const { error: regError } = await supabase.rpc('create_guest_registration', {
        p_workshop_id: entry.workshop_id,
        p_email: entry.email,
        p_name: entry.name,
        p_phone: entry.phone,
      });

      if (regError) throw regError;

      // Update waitlist status
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({ status: 'converted' })
        .eq('id', entry.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-entries'] });
      queryClient.invalidateQueries({ queryKey: ['all-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['workshops-for-waitlist'] });
      toast.success('Converted to registration successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to convert to registration');
    },
  });

  // Filter entries
  const filteredEntries = waitlistEntries.filter(entry => {
    const matchesSearch = 
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.workshop?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesWorkshop = selectedWorkshopId === 'all' || entry.workshop_id === selectedWorkshopId;

    return matchesSearch && matchesStatus && matchesWorkshop;
  });

  // Get waitlist count per workshop
  const waitlistCounts = waitlistEntries.reduce((acc, entry) => {
    if (entry.status === 'waiting') {
      acc[entry.workshop_id] = (acc[entry.workshop_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const exportWaitlist = () => {
    if (filteredEntries.length === 0) {
      toast.error('No waitlist entries to export');
      return;
    }

    const exportData = filteredEntries.map(entry => ({
      'Name': entry.name || 'N/A',
      'Email': entry.email,
      'Phone': entry.phone || 'N/A',
      'Workshop': entry.workshop?.name || 'N/A',
      'Workshop Date': entry.workshop?.date || 'N/A',
      'Status': entry.status,
      'Joined Waitlist': format(new Date(entry.created_at), 'yyyy-MM-dd HH:mm'),
      'Notified At': entry.notified_at ? format(new Date(entry.notified_at), 'yyyy-MM-dd HH:mm') : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Waitlist');

    const fileName = `waitlist_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast.success(`Exported ${filteredEntries.length} entries`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Waiting</Badge>;
      case 'notified':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Notified</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Converted</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalWaiting = waitlistEntries.filter(e => e.status === 'waiting').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Waitlist Management
            </CardTitle>
            <CardDescription>
              {totalWaiting} people waiting across {Object.keys(waitlistCounts).length} workshops
            </CardDescription>
          </div>
          <Button onClick={exportWaitlist} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or workshop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedWorkshopId} onValueChange={setSelectedWorkshopId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Workshops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workshops</SelectItem>
              {workshops.map(workshop => (
                <SelectItem key={workshop.id} value={workshop.id}>
                  {workshop.name} ({waitlistCounts[workshop.id] || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="notified">Notified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No waitlist entries found</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Workshop</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry, index) => {
                  const workshopEntries = filteredEntries.filter(
                    e => e.workshop_id === entry.workshop_id && e.status === 'waiting'
                  );
                  const position = workshopEntries.findIndex(e => e.id === entry.id) + 1;
                  const hasSpots = (entry.workshop?.spots_remaining || 0) > 0;

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {entry.status === 'waiting' ? (
                          <Badge variant="secondary">#{position}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.name || 'N/A'}
                      </TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.workshop?.name || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.workshop?.date} • {entry.workshop?.spots_remaining}/{entry.workshop?.max_capacity} spots
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {entry.status === 'waiting' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => notifyMutation.mutate(entry.id)}
                                disabled={notifyMutation.isPending}
                                title="Mark as notified"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              {hasSpots && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => convertMutation.mutate(entry)}
                                  disabled={convertMutation.isPending}
                                  title="Convert to registration"
                                >
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                                title="Remove from waitlist"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove from Waitlist</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {entry.name || entry.email} from the waitlist?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(entry.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaitlistManagement;
