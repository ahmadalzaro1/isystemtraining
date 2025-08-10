import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { Download, Search, Filter, FileText, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RegistrationData {
  id: string;
  workshop_id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  status: string;
  registration_date: string;
  confirmation_code: string;
  user_profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  workshops?: {
    name: string | null;
    date: string | null;
    time: string | null;
    category: string | null;
    skill_level: string | null;
  } | null;
}

const RegistrationManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);

  // Guard against non-admin access
  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Access denied. Administrator privileges required.</p>
      </div>
    );
  }

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['all-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select(`
          *,
          user_profiles(first_name, last_name, email, phone),
          workshops(name, date, time, category, skill_level)
        `)
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        throw new Error('Failed to fetch registrations');
      }

      return data as any[];
    },
  });

  const exportWeeklyRegistrations = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

    const weeklyRegistrations = registrations.filter(registration => {
      const registrationDate = new Date(registration.registration_date);
      return isWithinInterval(registrationDate, { start: weekStart, end: weekEnd });
    });

    if (weeklyRegistrations.length === 0) {
      toast.error('No registrations found for this week');
      return;
    }

    const exportData = weeklyRegistrations.map(registration => ({
      'Registration ID': registration.id,
      'Confirmation Code': registration.confirmation_code,
      'Registration Date': format(new Date(registration.registration_date), 'yyyy-MM-dd HH:mm'),
      'Status': registration.status,
      'User Name': registration.user_profiles 
        ? `${registration.user_profiles.first_name} ${registration.user_profiles.last_name}`
        : registration.guest_name || 'N/A',
      'Email': registration.user_profiles?.email || registration.guest_email || 'N/A',
      'Phone': registration.user_profiles?.phone || registration.guest_phone || 'N/A',
      'Workshop Name': registration.workshops?.name || 'N/A',
      'Workshop Date': registration.workshops?.date || 'N/A',
      'Workshop Time': registration.workshops?.time || 'N/A',
      'Category': registration.workshops?.category || 'N/A',
      'Skill Level': registration.workshops?.skill_level || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weekly Registrations');

    const fileName = `weekly_registrations_${format(weekStart, 'yyyy-MM-dd')}_to_${format(weekEnd, 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast.success(`Exported ${weeklyRegistrations.length} registrations to ${fileName}`);
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      (registration.user_profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.user_profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.user_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.guest_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.guest_email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.workshops?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      registration.confirmation_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserDisplayName = (registration: RegistrationData) => {
    if (registration.user_profiles) {
      return `${registration.user_profiles.first_name || ''} ${registration.user_profiles.last_name || ''}`.trim();
    }
    return registration.guest_name || 'Guest User';
  };

  const getUserEmail = (registration: RegistrationData) => {
    return registration.user_profiles?.email || registration.guest_email || 'N/A';
  };

  const getUserPhone = (registration: RegistrationData) => {
    return registration.user_profiles?.phone || registration.guest_phone || 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Registration Management</h2>
          <p className="text-muted-foreground">View and manage workshop registrations</p>
        </div>
        <Button onClick={exportWeeklyRegistrations} className="gap-2">
          <Download className="h-4 w-4" />
          Export This Week
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations.filter(r => {
                const regDate = new Date(r.registration_date);
                const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
                const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
                return isWithinInterval(regDate, { start: weekStart, end: weekEnd });
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations.filter(r => r.status.toLowerCase() === 'confirmed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
          <CardDescription>Complete list of workshop registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading registrations...</div>
          ) : (
            <div className="rounded-md border">
              <Table className="ledger-table [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 md:[&_th]:px-4 md:[&_th]:py-2.5 md:[&_td]:px-4 md:[&_td]:py-2.5">
                <TableHeader className="sticky top-0 bg-surface z-10 shadow-[inset_0_-1px_0_hsl(var(--border))]">
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Confirmation Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No registrations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegistrations.map((registration) => (
                      <TableRow 
                        key={registration.id}
                        className="cursor-pointer transition-colors hover:bg-[hsl(var(--text-strong)/0.03)]"
                        onClick={() => setSelectedRegistration(registration)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{getUserDisplayName(registration)}</div>
                            <div className="text-sm text-muted-foreground">
                              {getUserEmail(registration)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{registration.workshops?.name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              {registration.workshops?.category} • {registration.workshops?.skill_level}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{registration.workshops?.date ? format(new Date(registration.workshops.date), 'MMM dd, yyyy') : 'N/A'}</div>
                            <div className="text-muted-foreground">{registration.workshops?.time || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(registration.status)}>
                            {registration.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(registration.registration_date), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {registration.confirmation_code}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Complete information for this workshop registration
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Participant Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {getUserDisplayName(selectedRegistration)}</div>
                      <div><strong>Email:</strong> {getUserEmail(selectedRegistration)}</div>
                      <div><strong>Phone:</strong> {getUserPhone(selectedRegistration)}</div>
                      <div><strong>User Type:</strong> {selectedRegistration.user_id ? 'Registered User' : 'Guest'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Workshop Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Workshop:</strong> {selectedRegistration.workshops?.name || 'N/A'}</div>
                      <div><strong>Date:</strong> {selectedRegistration.workshops?.date ? format(new Date(selectedRegistration.workshops.date), 'MMMM dd, yyyy') : 'N/A'}</div>
                      <div><strong>Time:</strong> {selectedRegistration.workshops?.time || 'N/A'}</div>
                      <div><strong>Category:</strong> {selectedRegistration.workshops?.category || 'N/A'}</div>
                      <div><strong>Skill Level:</strong> {selectedRegistration.workshops?.skill_level || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Registration Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedRegistration.status)}`}>
                        {selectedRegistration.status}
                      </Badge>
                    </div>
                    <div><strong>Registration Date:</strong> {format(new Date(selectedRegistration.registration_date), 'MMMM dd, yyyy HH:mm')}</div>
                    <div><strong>Confirmation Code:</strong> 
                      <code className="ml-2 text-xs bg-muted px-1 py-0.5 rounded">
                        {selectedRegistration.confirmation_code}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationManagement;