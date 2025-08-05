import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { toast } from 'sonner';
import { Download, FileText, Calendar, BarChart3, PieChart, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WeeklyReportData {
  totalRegistrations: number;
  workshopBreakdown: Array<{
    name: string;
    registrations: number;
    spots_remaining: number;
    utilization: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
  skillLevelBreakdown: Array<{
    skillLevel: string;
    count: number;
  }>;
  dailyRegistrations: Array<{
    date: string;
    count: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

const WeeklyReportGenerator: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['weekly-report', selectedWeek],
    queryFn: async (): Promise<WeeklyReportData> => {
      const weekStart = startOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });

      // Fetch registrations for the week
      const { data: registrations, error: regError } = await supabase
        .from('workshop_registrations')
        .select(`
          *,
          workshops(name, category, skill_level, spots_remaining)
        `)
        .gte('registration_date', weekStart.toISOString())
        .lte('registration_date', weekEnd.toISOString());

      if (regError) {
        console.error('Error fetching registrations:', regError);
        throw new Error('Failed to fetch registration data');
      }

      // Fetch all workshops for context
      const { data: workshops, error: workshopError } = await supabase
        .from('workshops')
        .select('*');

      if (workshopError) {
        console.error('Error fetching workshops:', workshopError);
        throw new Error('Failed to fetch workshop data');
      }

      // Process data
      const totalRegistrations = registrations.length;

      // Workshop breakdown
      const workshopMap = new Map();
      registrations.forEach((reg: any) => {
        const workshopName = reg.workshops?.name || 'Unknown';
        if (!workshopMap.has(workshopName)) {
          workshopMap.set(workshopName, {
            name: workshopName,
            registrations: 0,
            spots_remaining: reg.workshops?.spots_remaining || 0,
            utilization: 0,
          });
        }
        workshopMap.get(workshopName).registrations++;
      });

      const workshopBreakdown = Array.from(workshopMap.values()).map(item => ({
        ...item,
        utilization: item.spots_remaining > 0 
          ? Math.round((item.registrations / (item.registrations + item.spots_remaining)) * 100)
          : 100,
      }));

      // Category breakdown
      const categoryMap = new Map();
      registrations.forEach((reg: any) => {
        const category = reg.workshops?.category || 'Unknown';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count: count as number,
      }));

      // Skill level breakdown
      const skillLevelMap = new Map();
      registrations.forEach((reg: any) => {
        const skillLevel = reg.workshops?.skill_level || 'Unknown';
        skillLevelMap.set(skillLevel, (skillLevelMap.get(skillLevel) || 0) + 1);
      });
      const skillLevelBreakdown = Array.from(skillLevelMap.entries()).map(([skillLevel, count]) => ({
        skillLevel,
        count: count as number,
      }));

      // Daily registrations
      const dailyMap = new Map();
      for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = format(d, 'yyyy-MM-dd');
        dailyMap.set(dateStr, 0);
      }
      registrations.forEach((reg: any) => {
        const dateStr = format(new Date(reg.registration_date), 'yyyy-MM-dd');
        if (dailyMap.has(dateStr)) {
          dailyMap.set(dateStr, dailyMap.get(dateStr) + 1);
        }
      });
      const dailyRegistrations = Array.from(dailyMap.entries()).map(([date, count]) => ({
        date: format(new Date(date), 'MMM dd'),
        count: count as number,
      }));

      return {
        totalRegistrations,
        workshopBreakdown,
        categoryBreakdown,
        skillLevelBreakdown,
        dailyRegistrations,
      };
    },
  });

  const generateReport = () => {
    if (!reportData) {
      toast.error('No data available for report generation');
      return;
    }

    const weekStart = startOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });

    // Generate a text-based report
    const reportContent = `
WEEKLY WORKSHOP REPORT
Week of ${format(weekStart, 'MMMM dd, yyyy')} - ${format(weekEnd, 'MMMM dd, yyyy')}

SUMMARY STATISTICS
==================
Total Registrations: ${reportData.totalRegistrations}

WORKSHOP PERFORMANCE
===================
${reportData.workshopBreakdown.map(workshop => 
  `${workshop.name}: ${workshop.registrations} registrations (${workshop.utilization}% utilization)`
).join('\n')}

CATEGORY BREAKDOWN
==================
${reportData.categoryBreakdown.map(cat => 
  `${cat.category}: ${cat.count} registrations`
).join('\n')}

SKILL LEVEL BREAKDOWN
=====================
${reportData.skillLevelBreakdown.map(skill => 
  `${skill.skillLevel}: ${skill.count} registrations`
).join('\n')}

DAILY REGISTRATIONS
===================
${reportData.dailyRegistrations.map(day => 
  `${day.date}: ${day.count} registrations`
).join('\n')}
`;

    // Create and download the report
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly_report_${format(weekStart, 'yyyy-MM-dd')}_to_${format(weekEnd, 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Weekly report generated and downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Weekly Report Generator</h3>
          <p className="text-muted-foreground">Generate comprehensive weekly workshop reports</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="week-select">Select Week:</Label>
            <Input
              id="week-select"
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={generateReport} disabled={isLoading || !reportData} className="gap-2">
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Generating report data...</div>
      ) : reportData ? (
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalRegistrations}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workshops</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.workshopBreakdown.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Workshop Utilization</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportData.workshopBreakdown.length > 0
                    ? Math.round(reportData.workshopBreakdown.reduce((sum, w) => sum + w.utilization, 0) / reportData.workshopBreakdown.length)
                    : 0}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories Active</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.categoryBreakdown.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Registration Trend</CardTitle>
                <CardDescription>Registrations per day during the selected week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.dailyRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Registrations by workshop category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <RechartsPieChart
                      data={reportData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                    >
                      {reportData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Workshop Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Workshop Performance</CardTitle>
              <CardDescription>Detailed breakdown of each workshop's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.workshopBreakdown.map((workshop, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{workshop.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {workshop.registrations} registrations • {workshop.spots_remaining} spots remaining
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{workshop.utilization}%</div>
                      <div className="text-sm text-muted-foreground">utilization</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No data available for the selected week
        </div>
      )}
    </div>
  );
};

export default WeeklyReportGenerator;