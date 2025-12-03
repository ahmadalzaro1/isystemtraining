import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, BarChart3, Calendar, Settings, UserCheck, Shield, UserCog, Book, Clock } from 'lucide-react';
import { useAdminSessionTracking } from '@/hooks/useAdminSessionTracking';

import { UserManagement } from '@/components/admin/UserManagement';
import { CourseManagement } from '@/components/admin/CourseManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import WorkshopManagement from '@/components/admin/WorkshopManagement';
import RegistrationManagement from '@/components/admin/RegistrationManagement';
import WaitlistManagement from '@/components/admin/WaitlistManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { SubjectManagement } from '@/components/admin/SubjectManagement';
import { RegistrationStepManagement } from '@/components/admin/RegistrationStepManagement';
import { CampaignManagement } from '@/components/admin/CampaignManagement';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';
import { SecurityManagement } from '@/components/admin/SecurityManagement';
import { GuideManagement } from '@/components/admin/GuideManagement';

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
            <div className="flex overflow-x-auto pb-2 no-scrollbar">
              <TabsList className="inline-flex gap-1 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger value="workshops" className="flex-shrink-0 h-9 px-3 text-xs">
                  <Calendar className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="registrations" className="flex-shrink-0 h-9 px-3 text-xs">
                  <UserCheck className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="waitlist" className="flex-shrink-0 h-9 px-3 text-xs">
                  <Clock className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="users" className="flex-shrink-0 h-9 px-3 text-xs">
                  <UserCog className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex-shrink-0 h-9 px-3 text-xs">
                  <BookOpen className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-shrink-0 h-9 px-3 text-xs">
                  <BarChart3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="security" className="flex-shrink-0 h-9 px-3 text-xs">
                  <Shield className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex-shrink-0 h-9 px-3 text-xs">
                  <Book className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-shrink-0 h-9 px-3 text-xs">
                  <Settings className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          {/* Desktop: Flex layout for uniform sizing */}
          <TabsList className="hidden lg:flex w-full h-12 p-1 gap-1">
            <TabsTrigger value="workshops" className="flex-1 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Workshops</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex-1 flex items-center justify-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="text-sm">Registrations</span>
            </TabsTrigger>
            <TabsTrigger value="waitlist" className="flex-1 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Waitlist</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 flex items-center justify-center gap-2">
              <UserCog className="h-4 w-4" />
              <span className="text-sm">Users</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex-1 flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 flex items-center justify-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Security</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex-1 flex items-center justify-center gap-2">
              <Book className="h-4 w-4" />
              <span className="text-sm">Guides</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 flex items-center justify-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workshops">
            <WorkshopManagement />
          </TabsContent>

          <TabsContent value="registrations">
            <RegistrationManagement />
          </TabsContent>

          <TabsContent value="waitlist">
            <WaitlistManagement />
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

          <TabsContent value="guides">
            <GuideManagement />
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