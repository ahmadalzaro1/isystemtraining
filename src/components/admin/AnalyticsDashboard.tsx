import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, UserCheck, TrendingUp, Calendar, Award } from 'lucide-react';

export const AnalyticsDashboard = () => {
  // Fetch analytics data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Get user stats
      const { data: userStats } = await supabase
        .from('user_profiles')
        .select('is_admin, marketing_consent, created_at');

      // Get course stats
      const { data: courseStats } = await supabase
        .from('courses')
        .select('is_published, price, created_at');

      // Get enrollment stats
      const { data: enrollmentStats } = await supabase
        .from('enrollments')
        .select('enrolled_at, completed_at, progress_percentage');

      // Get registration responses
      const { data: registrationStats } = await supabase
        .from('registration_responses')
        .select('completed_at, step_name');

      // Get recent analytics events
      const { data: recentEvents } = await supabase
        .from('analytics_events')
        .select('event_name, created_at, event_data')
        .order('created_at', { ascending: false })
        .limit(10);

      return {
        users: userStats || [],
        courses: courseStats || [],
        enrollments: enrollmentStats || [],
        registrations: registrationStats || [],
        events: recentEvents || []
      };
    }
  });

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  const totalUsers = stats?.users.length || 0;
  const adminUsers = stats?.users.filter(u => u.is_admin).length || 0;
  const marketingConsent = stats?.users.filter(u => u.marketing_consent).length || 0;
  
  const totalCourses = stats?.courses.length || 0;
  const publishedCourses = stats?.courses.filter(c => c.is_published).length || 0;
  const freeCourses = stats?.courses.filter(c => c.price === 0).length || 0;
  const paidCourses = totalCourses - freeCourses;
  
  const totalEnrollments = stats?.enrollments.length || 0;
  const completedEnrollments = stats?.enrollments.filter(e => e.completed_at).length || 0;
  const averageProgress = stats?.enrollments.length > 0 
    ? Math.round(stats.enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / stats.enrollments.length)
    : 0;

  const totalRegistrations = stats?.registrations.length || 0;
  const uniqueUsers = new Set(stats?.registrations.map(r => r.step_name)).size;

  // Get recent user signups (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSignups = stats?.users.filter(u => 
    new Date(u.created_at) > thirtyDaysAgo
  ).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Analytics Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Overview of your platform's performance and user engagement.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {recentSignups} new in last 30 days
            </p>
            <div className="flex space-x-2 mt-2">
              <Badge variant="secondary">{adminUsers} admins</Badge>
              <Badge variant="outline">{marketingConsent} opted-in</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {publishedCourses} published
            </p>
            <div className="flex space-x-2 mt-2">
              <Badge variant="default">{freeCourses} free</Badge>
              <Badge variant="secondary">{paidCourses} paid</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              {completedEnrollments} completed
            </p>
            <div className="mt-2">
              <Badge variant="outline">{averageProgress}% avg progress</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registration Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              Total responses collected
            </p>
            <div className="mt-2">
              <Badge variant="secondary">{uniqueUsers} unique steps</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
            <CardDescription>
              Latest user activity and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.events.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{event.event_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Event
                  </Badge>
                </div>
              ))}
              {!stats?.events.length && (
                <p className="text-sm text-muted-foreground">No recent events</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Course Completion Rate</span>
                <Badge variant="default">
                  {totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Published Course Ratio</span>
                <Badge variant="secondary">
                  {totalCourses > 0 ? Math.round((publishedCourses / totalCourses) * 100) : 0}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Marketing Opt-in Rate</span>
                <Badge variant="outline">
                  {totalUsers > 0 ? Math.round((marketingConsent / totalUsers) * 100) : 0}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Admin Users</span>
                <Badge variant="destructive">
                  {totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};