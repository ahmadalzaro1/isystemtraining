import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Send, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Campaign {
  id: string;
  name: string;
  description: string;
  campaign_type: 'email' | 'retargeting' | 'push';
  target_audience: any;
  trigger_conditions: any;
  message_template: any;
  is_active: boolean;
  created_at: string;
}

export const CampaignManagement = () => {
  const { isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    campaign_type: 'email' as 'email' | 'push' | 'retargeting',
    target_audience: '{}',
    trigger_conditions: '{}',
    message_template: '{}',
    is_active: true
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

  // Fetch campaigns
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    }
  });

  // Fetch campaign sends for analytics
  const { data: campaignSends } = useQuery({
    queryKey: ['campaign-sends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_sends')
        .select('campaign_id, status, sent_at, opened_at, clicked_at');

      if (error) throw error;
      return data;
    }
  });

  // Create/Update campaign mutation
  const campaignMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Parse JSON fields
      let targetAudience, triggerConditions, messageTemplate;
      try {
        targetAudience = JSON.parse(data.target_audience);
        triggerConditions = JSON.parse(data.trigger_conditions);
        messageTemplate = JSON.parse(data.message_template);
      } catch (e) {
        throw new Error('Invalid JSON in campaign configuration');
      }

      const campaignData = {
        ...data,
        target_audience: targetAudience,
        trigger_conditions: triggerConditions,
        message_template: messageTemplate
      };

      if (editingCampaign) {
        const { error } = await supabase
          .from('marketing_campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('marketing_campaigns')
          .insert([campaignData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: `Campaign ${editingCampaign ? 'updated' : 'created'} successfully.`,
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

  // Delete campaign mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast({
        title: "Success",
        description: "Campaign deleted successfully.",
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      campaign_type: 'email',
      target_audience: JSON.stringify({
        "user_type": ["student", "professional"],
        "marketing_consent": true
      }, null, 2),
      trigger_conditions: JSON.stringify({
        "event": "registration_complete",
        "delay_hours": 24
      }, null, 2),
      message_template: JSON.stringify({
        "subject": "Welcome to our platform!",
        "body": "Thank you for joining us...",
        "cta_text": "Get Started",
        "cta_url": "/courses"
      }, null, 2),
      is_active: true
    });
    setEditingCampaign(null);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      campaign_type: campaign.campaign_type,
      target_audience: JSON.stringify(campaign.target_audience, null, 2),
      trigger_conditions: JSON.stringify(campaign.trigger_conditions, null, 2),
      message_template: JSON.stringify(campaign.message_template, null, 2),
      is_active: campaign.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    campaignMutation.mutate(formData);
  };

  const getCampaignStats = (campaignId: string) => {
    if (!campaignSends) return { sent: 0, opened: 0, clicked: 0 };
    
    const sends = campaignSends.filter(s => s.campaign_id === campaignId);
    return {
      sent: sends.length,
      opened: sends.filter(s => s.opened_at).length,
      clicked: sends.filter(s => s.clicked_at).length
    };
  };

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'retargeting': return 'bg-purple-100 text-purple-800';
      case 'push': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Marketing Campaign Management</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage automated marketing campaigns for user engagement.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </DialogTitle>
              <DialogDescription>
                {editingCampaign ? 'Update campaign settings.' : 'Set up a new automated marketing campaign.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign_type">Campaign Type</Label>
                  <Select 
                    value={formData.campaign_type} 
                    onValueChange={(value: 'email' | 'retargeting' | 'push') => setFormData({ ...formData, campaign_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="retargeting">Retargeting</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience (JSON)</Label>
                <Textarea
                  id="target_audience"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Define audience criteria (user_type, marketing_consent, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger_conditions">Trigger Conditions (JSON)</Label>
                <Textarea
                  id="trigger_conditions"
                  value={formData.trigger_conditions}
                  onChange={(e) => setFormData({ ...formData, trigger_conditions: e.target.value })}
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Define when this campaign should trigger (events, delays, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message_template">Message Template (JSON)</Label>
                <Textarea
                  id="message_template"
                  value={formData.message_template}
                  onChange={(e) => setFormData({ ...formData, message_template: e.target.value })}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Message content, subject, CTA, etc.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={campaignMutation.isPending}>
                  {campaignMutation.isPending ? 'Saving...' : (editingCampaign ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {campaigns?.map((campaign) => {
          const stats = getCampaignStats(campaign.id);
          const openRate = stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0;
          const clickRate = stats.sent > 0 ? Math.round((stats.clicked / stats.sent) * 100) : 0;

          return (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <Badge className={getCampaignTypeColor(campaign.campaign_type)}>
                        {campaign.campaign_type}
                      </Badge>
                      <Badge variant={campaign.is_active ? "default" : "secondary"}>
                        {campaign.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    {campaign.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {campaign.description}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sent:</span>
                        <span className="ml-1 font-medium">{stats.sent}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Open Rate:</span>
                        <span className="ml-1 font-medium">{openRate}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Click Rate:</span>
                        <span className="ml-1 font-medium">{clickRate}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(campaign)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this campaign?')) {
                          deleteMutation.mutate(campaign.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};