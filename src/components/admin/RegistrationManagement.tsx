import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { Download, Search, Filter, FileText, Users, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTime } from '@/lib/utils';

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
  user_profile?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  workshop?: {
    name: string | null;
    date: string | null;
    time: string | null;
    category: string | null;
    skill_level: string | null;
  } | null;
}

const RegistrationManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Guard against non-admin access
  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Access denied. Administrator privileges required.</p>
      </div>
    );
  }

  // Fetch registration responses for detailed view
  const { data: registrationResponses = [] } = useQuery({
    queryKey: ['registration-responses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registration_responses')
        .select('*')
        .eq('step_name', 'complete_registration');

      if (error) {
        console.error('Error fetching registration responses:', error);
        return [];
      }

      return data as any[];
    },
  });

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['all-registrations'],
    queryFn: async () => {
      // First get all registrations
      const { data: regData, error: regError } = await supabase
        .from('workshop_registrations')
        .select('*')
        .order('registration_date', { ascending: false });

      if (regError) {
        console.error('Error fetching registrations:', regError);
        throw new Error('Failed to fetch registrations');
      }

      // Get unique user IDs and workshop IDs for batch fetching
      const userIds = [...new Set(regData.filter(r => r.user_id).map(r => r.user_id))];
      const workshopIds = [...new Set(regData.map(r => r.workshop_id))];

      // Fetch user profiles
      let userProfiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('user_id, first_name, last_name, email, phone')
          .in('user_id', userIds);

        if (profileError) {
          console.error('Error fetching user profiles:', profileError);
        } else {
          userProfiles = profileData || [];
        }
      }

      // Fetch workshops
      let workshops: any[] = [];
      if (workshopIds.length > 0) {
        const { data: workshopData, error: workshopError } = await supabase
          .from('workshops')
          .select('id, name, date, time, category, skill_level')
          .in('id', workshopIds);

        if (workshopError) {
          console.error('Error fetching workshops:', workshopError);
        } else {
          workshops = workshopData || [];
        }
      }

      // Combine the data
      const enrichedRegistrations = regData.map(registration => {
        const userProfile = userProfiles.find(p => p.user_id === registration.user_id);
        const workshop = workshops.find(w => w.id === registration.workshop_id);

        return {
          ...registration,
          user_profile: userProfile || null,
          workshop: workshop || null,
        };
      });

      return enrichedRegistrations as RegistrationData[];
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
      'User Name': registration.user_profile 
        ? `${registration.user_profile.first_name} ${registration.user_profile.last_name}`
        : registration.guest_name || 'N/A',
      'Email': registration.user_profile?.email || registration.guest_email || 'N/A',
      'Phone': registration.user_profile?.phone || registration.guest_phone || 'N/A',
      'Workshop Name': registration.workshop?.name || 'N/A',
      'Workshop Date': registration.workshop?.date || 'N/A',
      'Workshop Time': registration.workshop?.time ? formatTime(registration.workshop.time) : 'N/A',
      'Category': registration.workshop?.category || 'N/A',
      'Skill Level': registration.workshop?.skill_level || 'N/A',
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
      (registration.user_profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.user_profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.user_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.guest_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.guest_email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (registration.workshop?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      registration.confirmation_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-surface2 text-text';
    }
  };

  const getUserDisplayName = (registration: RegistrationData) => {
    if (registration.user_profile) {
      return `${registration.user_profile.first_name || ''} ${registration.user_profile.last_name || ''}`.trim();
    }
    return registration.guest_name || 'Guest User';
  };

  const getUserEmail = (registration: RegistrationData) => {
    return registration.user_profile?.email || registration.guest_email || 'N/A';
  };

  const getUserPhone = (registration: RegistrationData) => {
    return registration.user_profile?.phone || registration.guest_phone || 'N/A';
  };

  const deleteRegistration = async (registrationId: string, workshopId: string) => {
    try {
      setDeletingId(registrationId);
      
      // Delete the registration
      const { error: deleteError } = await supabase
        .from('workshop_registrations')
        .delete()
        .eq('id', registrationId);

      if (deleteError) {
        throw deleteError;
      }

      // Increase the workshop spots count
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('spots_remaining')
        .eq('id', workshopId)
        .single();

      if (workshopData && !workshopError) {
        const { error: updateError } = await supabase
          .from('workshops')
          .update({ 
            spots_remaining: workshopData.spots_remaining + 1
          })
          .eq('id', workshopId);

        if (updateError) {
          console.warn('Failed to update workshop spots:', updateError);
        }
      }

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['all-registrations'] });
      
      toast.success('Registration deleted successfully');
      setSelectedRegistration(null);
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast.error('Failed to delete registration');
    } finally {
      setDeletingId(null);
    }
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <Card className="sm:col-span-2 lg:col-span-1">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
            <>
              {/* Mobile: Card layout */}
              <div className="block lg:hidden space-y-4">
                {filteredRegistrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {isLoading ? 'Loading registrations...' : 'No registrations found'}
                  </div>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <Card key={registration.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{getUserDisplayName(registration)}</div>
                            <div className="text-sm text-muted-foreground">{getUserEmail(registration)}</div>
                          </div>
                          <Badge className={getStatusColor(registration.status)}>
                            {registration.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Workshop</div>
                            <div className="font-medium">{registration.workshop?.name || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Date</div>
                            <div>{registration.workshop?.date ? format(new Date(registration.workshop.date), 'MMM dd, yyyy') : 'N/A'}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {registration.confirmation_code}
                          </code>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedRegistration(registration)}
                              className="h-8 px-3"
                            >
                              View
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  disabled={deletingId === registration.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this registration? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteRegistration(registration.id, registration.workshop_id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden lg:block rounded-md border overflow-x-auto">
                <Table className="ledger-table [&_th]:px-4 [&_th]:py-2.5 [&_td]:px-4 [&_td]:py-2.5">
                  <TableHeader className="sticky top-0 bg-surface z-10 shadow-[inset_0_-1px_0_hsl(var(--border))]">
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Workshop</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Confirmation Code</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {isLoading ? 'Loading registrations...' : 'No registrations found'}
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
                            <div className="font-medium">{registration.workshop?.name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              {registration.workshop?.category} • {registration.workshop?.skill_level}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{registration.workshop?.date ? format(new Date(registration.workshop.date), 'MMM dd, yyyy') : 'N/A'}</div>
                            <div className="text-muted-foreground">{registration.workshop?.time || 'N/A'}</div>
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
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this registration? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteRegistration(registration.id, registration.workshop_id)}
                                  disabled={deletingId === registration.id}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingId === registration.id ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Registration Details
              {selectedRegistration && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={deletingId === selectedRegistration.id}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === selectedRegistration.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this registration? This action cannot be undone.
                        The workshop spot will be made available again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteRegistration(selectedRegistration.id, selectedRegistration.workshop_id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Registration
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DialogTitle>
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
                      <div><strong>Workshop:</strong> {selectedRegistration.workshop?.name || 'N/A'}</div>
                      <div><strong>Date:</strong> {selectedRegistration.workshop?.date ? format(new Date(selectedRegistration.workshop.date), 'MMMM dd, yyyy') : 'N/A'}</div>
                      <div><strong>Time:</strong> {selectedRegistration.workshop?.time ? formatTime(selectedRegistration.workshop.time) : 'N/A'}</div>
                      <div><strong>Category:</strong> {selectedRegistration.workshop?.category || 'N/A'}</div>
                      <div><strong>Skill Level:</strong> {selectedRegistration.workshop?.skill_level || 'N/A'}</div>
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

                {/* Detailed Registration Responses */}
                {(() => {
                  const userResponse = registrationResponses.find(
                    response => response.registration_id === selectedRegistration.id
                  );
                  
                  if (!userResponse) {
                    return (
                      <div>
                        <h4 className="font-semibold mb-2">Registration Form Responses</h4>
                        <p className="text-sm text-muted-foreground">No detailed form responses available for this registration.</p>
                      </div>
                    );
                  }

                  const responseData = userResponse.response_data;
                  
                  return (
                    <div className="space-y-4">
                      <h4 className="font-semibold mb-2">Registration Form Responses</h4>
                      
                      {/* Personal Information */}
                      {responseData.personal_info && (
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Personal Information</h5>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div><strong>User Type:</strong> {responseData.personal_info.userType || 'N/A'}</div>
                            {responseData.personal_info.platformSwitch && (
                              <div><strong>Platform:</strong> {responseData.personal_info.platformSwitch}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Contact Preferences */}
                      {responseData.contact_preferences && (
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Contact Preferences</h5>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div><strong>Preferred Contact:</strong> {responseData.contact_preferences.contactPreference || 'N/A'}</div>
                            <div><strong>Receive Updates:</strong> {responseData.contact_preferences.receiveUpdates ? 'Yes' : 'No'}</div>
                          </div>
                        </div>
                      )}

                      {/* Learning Preferences */}
                      {responseData.learning_preferences && (
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Learning Preferences</h5>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            {responseData.learning_preferences.mainTasks && (
                              <div><strong>Main Tasks:</strong> {responseData.learning_preferences.mainTasks.join(', ')}</div>
                            )}
                            {responseData.learning_preferences.learningStyles && (
                              <div><strong>Learning Styles:</strong> {responseData.learning_preferences.learningStyles.join(', ')}</div>
                            )}
                            {responseData.learning_preferences.paidTrainingInterest && (
                              <div><strong>Paid Training Interest:</strong> {responseData.learning_preferences.paidTrainingInterest}</div>
                            )}
                            {responseData.learning_preferences.workshopTopics && responseData.learning_preferences.workshopTopics.length > 0 && (
                              <div>
                                <strong>Workshop Topics:</strong>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {responseData.learning_preferences.workshopTopics
                                    .filter((topic: any) => topic.selected)
                                    .map((topic: any, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {topic.topic}
                                      </Badge>
                                    ))
                                  }
                                </div>
                              </div>
                            )}
                            {responseData.learning_preferences.otherTopics && (
                              <div><strong>Other Topics:</strong> {responseData.learning_preferences.otherTopics}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationManagement;
