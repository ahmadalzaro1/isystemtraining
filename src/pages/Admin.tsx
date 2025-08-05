import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, BarChart3, Calendar, Settings, UserCheck } from 'lucide-react';

import { UserManagement } from '@/components/admin/UserManagement';
import { CourseManagement } from '@/components/admin/CourseManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import WorkshopManagement from '@/components/admin/WorkshopManagement';
import RegistrationManagement from '@/components/admin/RegistrationManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { SubjectManagement } from '@/components/admin/SubjectManagement';
import { RegistrationStepManagement } from '@/components/admin/RegistrationStepManagement';
import { CampaignManagement } from '@/components/admin/CampaignManagement';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage users, courses, workshops, and system settings</p>
        </div>

        <Tabs defaultValue="workshops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="workshops" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Workshops</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Registrations</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workshops">
            <WorkshopManagement />
          </TabsContent>

          <TabsContent value="registrations">
            <RegistrationManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              <CategoryManagement />
              <SubjectManagement />
              <RegistrationStepManagement />
              <CampaignManagement />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;