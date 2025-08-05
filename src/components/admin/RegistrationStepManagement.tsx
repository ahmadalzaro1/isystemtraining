import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface RegistrationStep {
  id: string;
  step_name: string;
  step_title: string;
  step_description: string;
  step_config: any;
  sort_order: number;
  is_active: boolean;
  is_required: boolean;
}

export const RegistrationStepManagement = () => {
  const { isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<RegistrationStep | null>(null);
  const [formData, setFormData] = useState({
    step_name: '',
    step_title: '',
    step_description: '',
    step_config: '{}',
    sort_order: 0,
    is_active: true,
    is_required: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Guard against non-admin access
  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Access denied. Administrator privileges required.</p>
      </div>
    );
  }

  // Fetch registration steps
  const { data: steps, isLoading } = useQuery({
    queryKey: ['admin-registration-steps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registration_steps')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      return data as RegistrationStep[];
    }
  });

  // Create/Update step mutation
  const stepMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Parse step_config JSON
      let stepConfig;
      try {
        stepConfig = JSON.parse(data.step_config);
      } catch (e) {
        throw new Error('Invalid JSON in step configuration');
      }

      const stepData = {
        ...data,
        step_config: stepConfig
      };

      if (editingStep) {
        const { error } = await supabase
          .from('registration_steps')
          .update(stepData)
          .eq('id', editingStep.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('registration_steps')
          .insert([stepData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registration-steps'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: `Registration step ${editingStep ? 'updated' : 'created'} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete step mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('registration_steps')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registration-steps'] });
      toast({
        title: "Success",
        description: "Registration step deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Reorder step mutation
  const reorderMutation = useMutation({
    mutationFn: async ({ stepId, newOrder }: { stepId: string; newOrder: number }) => {
      const { error } = await supabase
        .from('registration_steps')
        .update({ sort_order: newOrder })
        .eq('id', stepId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registration-steps'] });
    }
  });

  const resetForm = () => {
    setFormData({
      step_name: '',
      step_title: '',
      step_description: '',
      step_config: '{}',
      sort_order: (steps?.length || 0) + 1,
      is_active: true,
      is_required: true
    });
    setEditingStep(null);
  };

  const handleEdit = (step: RegistrationStep) => {
    setEditingStep(step);
    setFormData({
      step_name: step.step_name,
      step_title: step.step_title,
      step_description: step.step_description || '',
      step_config: JSON.stringify(step.step_config, null, 2),
      sort_order: step.sort_order || 0,
      is_active: step.is_active,
      is_required: step.is_required
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stepMutation.mutate(formData);
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    if (!steps) return;
    
    const currentStep = steps.find(s => s.id === stepId);
    if (!currentStep) return;

    const newOrder = direction === 'up' 
      ? currentStep.sort_order - 1 
      : currentStep.sort_order + 1;

    if (newOrder < 1 || newOrder > steps.length) return;

    // Find the step that currently has the target order
    const targetStep = steps.find(s => s.sort_order === newOrder);
    
    if (targetStep) {
      // Swap the orders
      reorderMutation.mutate({ stepId: targetStep.id, newOrder: currentStep.sort_order });
    }
    
    reorderMutation.mutate({ stepId: stepId, newOrder });
  };

  if (isLoading) {
    return <div>Loading registration steps...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Registration Flow Management</h3>
          <p className="text-sm text-muted-foreground">
            Customize the user registration process with dynamic steps.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStep ? 'Edit Registration Step' : 'Create New Registration Step'}
              </DialogTitle>
              <DialogDescription>
                {editingStep ? 'Update step configuration.' : 'Add a new step to the registration flow.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="step_name">Step Name (Key)</Label>
                  <Input
                    id="step_name"
                    value={formData.step_name}
                    onChange={(e) => setFormData({ ...formData, step_name: e.target.value })}
                    placeholder="user_type"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="step_title">Step Title</Label>
                  <Input
                    id="step_title"
                    value={formData.step_title}
                    onChange={(e) => setFormData({ ...formData, step_title: e.target.value })}
                    placeholder="User Type"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="step_description">Step Description</Label>
                <Textarea
                  id="step_description"
                  value={formData.step_description}
                  onChange={(e) => setFormData({ ...formData, step_description: e.target.value })}
                  placeholder="Select your user type"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="step_config">Step Configuration (JSON)</Label>
                <Textarea
                  id="step_config"
                  value={formData.step_config}
                  onChange={(e) => setFormData({ ...formData, step_config: e.target.value })}
                  placeholder='{"options": ["student", "professional", "business"]}'
                  rows={5}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  JSON configuration for the step (options, fields, validation, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={formData.is_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                  />
                  <Label htmlFor="required">Required</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={stepMutation.isPending}>
                  {stepMutation.isPending ? 'Saving...' : (editingStep ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {steps?.map((step) => (
          <Card key={step.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{step.step_title}</h4>
                    <Badge variant="outline">Order: {step.sort_order}</Badge>
                    <Badge variant={step.is_active ? "default" : "secondary"}>
                      {step.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {step.is_required && (
                      <Badge variant="destructive">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Key: <code className="bg-muted px-1 py-0.5 rounded text-xs">{step.step_name}</code>
                  </p>
                  {step.step_description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {step.step_description}
                    </p>
                  )}
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View Configuration
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                      {JSON.stringify(step.step_config, null, 2)}
                    </pre>
                  </details>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => moveStep(step.id, 'up')}
                    disabled={step.sort_order <= 1}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => moveStep(step.id, 'down')}
                    disabled={step.sort_order >= (steps?.length || 0)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(step)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this registration step?')) {
                        deleteMutation.mutate(step.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};