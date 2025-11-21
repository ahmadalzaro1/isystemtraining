import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Calendar, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import { WorkshopService, CreateWorkshopData } from '@/services/workshopService';
import { Workshop } from '@/types/workshop';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatTime } from '@/lib/utils';

const workshopSchema = z.object({
  name: z.string().min(1, 'Workshop name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  description: z.string().optional(),
  spots_remaining: z.number().min(0, 'Spots must be 0 or more'),
  max_capacity: z.number().min(1, 'Capacity must be at least 1'),
  skill_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  category: z.enum(['Mac', 'iPhone', 'Apple Watch', 'AI', 'Digital Safety', 'Creativity', 'Productivity', 'iCloud', 'Digital Art on iPad']),
  instructor: z.string().min(1, 'Instructor is required'),
  location: z.enum(['iSystem Khalda', 'iSystem Abdoun', 'iSystem Mecca Street', 'iSystem Swefieh', 'iSystem City Mall', 'Mecca Mall - SmartTech', 'Online']),
});

type WorkshopFormData = z.infer<typeof workshopSchema>;

const WorkshopManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Guard against non-admin access
  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Access denied. Administrator privileges required.</p>
      </div>
    );
  }

  const { data: workshops = [], isLoading } = useQuery({
    queryKey: ['workshops'],
    queryFn: WorkshopService.getWorkshops,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateWorkshopData) => WorkshopService.createWorkshop(data),
    onSuccess: (workshop) => {
      console.log('Workshop created successfully:', workshop);
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      toast.success('Workshop created successfully');
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Create workshop error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create workshop';
      toast.error(`Failed to create workshop: ${errorMessage}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWorkshopData> }) =>
      WorkshopService.updateWorkshop(id, data),
    onSuccess: async () => {
      // Invalidate and immediately refetch all workshop-related queries
      await queryClient.invalidateQueries({ 
        queryKey: ['workshops'], 
        refetchType: 'active' 
      });
      
      // Force refetch to ensure data is fresh
      await queryClient.refetchQueries({ 
        queryKey: ['workshops'] 
      });
      
      toast.success('Workshop updated successfully');
      setIsDialogOpen(false);
      setSelectedWorkshop(null);
    },
    onError: (error) => {
      toast.error('Failed to update workshop');
      console.error('Update workshop error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => WorkshopService.deleteWorkshop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      toast.success('Workshop deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete workshop');
      console.error('Delete workshop error:', error);
    },
  });

  const form = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      name: '',
      date: '',
      time: '',
      description: '',
      spots_remaining: 0,
      max_capacity: 12,
      skill_level: 'Beginner',
      category: 'Mac',
      instructor: '',
      location: 'Online',
    },
  });

  const onSubmit = (data: WorkshopFormData) => {
    console.log('Workshop form submitted:', data);
    
    const workshopData: CreateWorkshopData = {
      name: data.name,
      date: new Date(data.date),
      time: data.time,
      description: data.description,
      spots_remaining: data.spots_remaining,
      max_capacity: data.max_capacity,
      skill_level: data.skill_level,
      category: data.category,
      instructor: data.instructor,
      location: data.location,
    };

    console.log('Workshop data prepared for submission:', workshopData);

    if (selectedWorkshop) {
      console.log('Updating existing workshop:', selectedWorkshop.id);
      updateMutation.mutate({ id: selectedWorkshop.id, data: workshopData });
    } else {
      console.log('Creating new workshop');
      createMutation.mutate(workshopData);
    }
  };

  const handleEdit = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    form.reset({
      name: workshop.name,
      date: workshop.date.toISOString().split('T')[0],
      time: workshop.time,
      description: workshop.description,
      spots_remaining: workshop.spotsRemaining,
      max_capacity: workshop.maxCapacity,
      skill_level: workshop.skillLevel,
      category: workshop.category,
      instructor: workshop.instructor,
      location: workshop.location,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedWorkshop(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-surface2 text-text';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workshop Management</h2>
          <p className="text-muted-foreground">Create and manage training workshops</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workshop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedWorkshop ? 'Edit Workshop' : 'Create New Workshop'}
              </DialogTitle>
              <DialogDescription>
                {selectedWorkshop ? 'Update workshop details' : 'Fill in the details to create a new workshop'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workshop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter workshop name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter instructor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="max_capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Capacity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 12)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spots_remaining"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Spots</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="skill_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select skill level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mac">Mac</SelectItem>
                            <SelectItem value="iPhone">iPhone</SelectItem>
                            <SelectItem value="Apple Watch">Apple Watch</SelectItem>
                            <SelectItem value="AI">AI</SelectItem>
                            <SelectItem value="Digital Safety">Digital Safety</SelectItem>
                            <SelectItem value="Creativity">Creativity</SelectItem>
                            <SelectItem value="Productivity">Productivity</SelectItem>
                            <SelectItem value="iCloud">iCloud</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="iSystem Khalda">iSystem Khalda</SelectItem>
                            <SelectItem value="iSystem Abdoun">iSystem Abdoun</SelectItem>
                            <SelectItem value="iSystem Mecca Street">iSystem Mecca Street</SelectItem>
                            <SelectItem value="iSystem Swefieh">iSystem Swefieh</SelectItem>
                            <SelectItem value="iSystem City Mall">iSystem City Mall</SelectItem>
                            <SelectItem value="Mecca Mall - SmartTech">Mecca Mall - SmartTech</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter workshop description"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {selectedWorkshop ? 'Update Workshop' : 'Create Workshop'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Workshops Overview
          </CardTitle>
          <CardDescription>
            Manage your training workshops and sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading workshops...</div>
          ) : (
            <div className="rounded-md border">
              <Table className="ledger-table [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 md:[&_th]:px-4 md:[&_th]:py-2.5 md:[&_td]:px-4 md:[&_td]:py-2.5">
                <TableHeader className="sticky top-0 bg-surface z-10 shadow-[inset_0_-1px_0_hsl(var(--border))]">
                  <TableRow>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Skill Level</TableHead>
                    <TableHead>Available Spots</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkshops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No workshops found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWorkshops.map((workshop) => (
                      <TableRow key={workshop.id} className="transition-colors hover:bg-[hsl(var(--text-strong)/0.03)]">
                        <TableCell>
                          <div>
                            <div className="font-medium">{workshop.name}</div>
                            {workshop.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {workshop.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{workshop.date.toLocaleDateString()}</div>
                            <div className="text-muted-foreground">{formatTime(workshop.time)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{workshop.instructor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{workshop.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSkillLevelColor(workshop.skillLevel)}>
                            {workshop.skillLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{workshop.spotsRemaining}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="primaryMinimal"
                              size="sm"
                              aria-label="Edit workshop"
                              onClick={() => handleEdit(workshop)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="secondaryOutline" size="sm" aria-label="Delete workshop">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Workshop</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{workshop.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(workshop.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
    </div>
  );
};

export default WorkshopManagement;