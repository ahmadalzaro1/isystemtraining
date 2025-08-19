import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, BarChart3, Calendar, Settings, UserCheck, Shield, UserCog } from 'lucide-react';
import { useAdminSessionTracking } from '@/hooks/useAdminSessionTracking';

import { UserManagement } from '@/components/admin/UserManagement';
import { CourseManagement } from '@/components/admin/CourseManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import WorkshopManagement from '@/components/admin/WorkshopManagement';
import RegistrationManagement from '@/components/admin/RegistrationManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { SubjectManagement } from '@/components/admin/SubjectManagement';
import { RegistrationStepManagement } from '@/components/admin/RegistrationStepManagement';
import { CampaignManagement } from '@/components/admin/CampaignManagement';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';
import { SecurityManagement } from '@/components/admin/SecurityManagement';

const Admin = () => {
  // Track admin session for security
  useAdminSessionTracking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage users, courses, workshops, and system settings</p>
        </div>

        <Tabs defaultValue="workshops" className="space-y-6">
          {/* Mobile: Scrollable horizontal tabs */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto pb-2 no-scrollbar gap-1">
              <TabsList className="inline-flex gap-1 bg-transparent p-0">
                <TabsTrigger value="workshops" className="flex-shrink-0 h-10 px-4 rounded-pill">
                  <Calendar className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="registrations" className="flex-shrink-0 h-10 px-4 rounded-pill">
                  <UserCheck className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="users" className="flex-shrink-0 h-10 px-4 rounded-pill">
                  <UserCog className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex-shrink-0 h-10 px-4 rounded-pill">
                  <BookOpen className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-shrink-0 h-10 px-4 rounded-pill">
                  <BarChart3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="security" className="flex-shrink-0 h-10 px-4 rounded-pill">
                  <Shield className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-shrink-0 h-10 px-4 rounded-pill">
                  <Settings className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          {/* Desktop: Grid layout */}
          <TabsList className="hidden lg:grid w-full grid-cols-7 h-12 p-1">
            <TabsTrigger value="workshops" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Workshops</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>Registrations</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
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

          <TabsContent value="security">
            <div className="space-y-6">
              <SecurityManagement />
              <AdminAuditLog />
            </div>
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