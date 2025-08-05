import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Search, Mail, Phone, Building, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  marketing_consent: boolean;
  is_admin: boolean;
  created_at: string;
}

export const UserManagement = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<UserProfile> }) => {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "User updated successfully.",
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

  const handleToggleAdmin = async (user: UserProfile) => {
    // Prevent self-demotion
    if (user.user_id === currentUser?.id && user.is_admin) {
      toast({
        title: "Action Not Allowed",
        description: "You cannot remove your own admin privileges.",
        variant: "destructive",
      });
      return;
    }

    updateUserMutation.mutate({
      userId: user.id,
      updates: { is_admin: !user.is_admin }
    });
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      position: formData.get('position') as string,
      marketing_consent: formData.get('marketing_consent') === 'on',
      is_admin: formData.get('is_admin') === 'on'
    };

    updateUserMutation.mutate({
      userId: editingUser.id,
      updates
    });
  };

  const filteredUsers = users?.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, permissions, and contact information.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">
                      {user.first_name} {user.last_name}
                    </h4>
                    {user.is_admin && (
                      <Badge variant="default">Admin</Badge>
                    )}
                    {user.marketing_consent && (
                      <Badge variant="secondary">Marketing Consent</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="space-y-1">
                      {user.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {user.company && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{user.company}</span>
                        </div>
                      )}
                      {user.position && (
                        <div className="flex items-center space-x-2">
                          <UserCheck className="h-4 w-4" />
                          <span>{user.position}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={user.is_admin ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleAdmin(user)}
                  >
                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    defaultValue={editingUser.first_name || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    defaultValue={editingUser.last_name || ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingUser.email || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={editingUser.phone || ''}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    defaultValue={editingUser.company || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    defaultValue={editingUser.position || ''}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="marketing_consent"
                    name="marketing_consent"
                    defaultChecked={editingUser.marketing_consent}
                    className="rounded"
                  />
                  <Label htmlFor="marketing_consent">Marketing Consent</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_admin"
                    name="is_admin"
                    defaultChecked={editingUser.is_admin}
                    className="rounded"
                  />
                  <Label htmlFor="is_admin">Admin Access</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};