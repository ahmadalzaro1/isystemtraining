import { supabase } from "@/integrations/supabase/client";
import { Workshop, WorkshopFilters } from "@/types/workshop";
import { addWeeks, endOfWeek } from "date-fns";

export interface DatabaseWorkshop {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string | null;
  spots_remaining: number;
  max_capacity: number;
  skill_level: string;
  category: string;
  instructor: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkshopData {
  name: string;
  date: Date;
  time: string;
  description?: string;
  spots_remaining: number;
  max_capacity: number;
  skill_level: "Beginner" | "Intermediate" | "Advanced";
  category: "Mac" | "iPhone" | "Apple Watch" | "AI" | "Digital Safety" | "Creativity" | "Productivity" | "iCloud" | "Digital Art on iPad";
  instructor: string;
  location: "iSystem Khalda" | "iSystem Abdoun" | "iSystem Mecca Street" | "iSystem Swefieh" | "iSystem City Mall" | "Mecca Mall - SmartTech" | "Online";
}

export class WorkshopService {
  static async getWorkshops(): Promise<Workshop[]> {
    // Use RPC with security definer to avoid RLS issues and fetch a default window
    const today = new Date();
    const p_start = today.toISOString().slice(0, 10);
    const end = new Date(today);
    end.setDate(end.getDate() + 45); // next ~6 weeks
    const p_end = end.toISOString().slice(0, 10);

    const { data, error } = await supabase.rpc('get_workshops_week', {
      p_start,
      p_end,
      p_levels: null,
      p_categories: null,
      p_query: null,
    });

    if (error) {
      console.error('Error fetching workshops (RPC default):', error);
      throw new Error(error.message || 'Failed to fetch workshops');
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      date: new Date(row.date),
      time: row.time_text,
      description: row.description || '',
      spotsRemaining: row.spots_remaining,
      maxCapacity: row.max_capacity,
      registrationsCount: row.registrations_count || 0,
      skillLevel: row.skill_level,
      category: row.category,
      instructor: row.instructor,
      location: row.location || 'Online',
    } as Workshop));
  }

  static async getWorkshopsWeek(weekStart: Date, weekEnd: Date, filters: WorkshopFilters): Promise<Workshop[]> {
    const p_start = weekStart.toISOString().slice(0, 10);
    const p_end = weekEnd.toISOString().slice(0, 10);
    const p_levels = filters.skillLevel !== 'All' ? [filters.skillLevel] : null;
    const p_categories = filters.category !== 'All' ? [filters.category] : null;
    const p_query = filters.search?.trim() || null;

    const { data, error } = await supabase.rpc('get_workshops_week', {
      p_start,
      p_end,
      p_levels,
      p_categories,
      p_query,
    });

    if (error) {
      console.error('Error fetching workshops (week RPC):', error);
      throw new Error('Failed to fetch workshops for the selected week');
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      date: new Date(row.date),
      time: row.time_text,
      description: row.description || '',
      spotsRemaining: row.spots_remaining,
      maxCapacity: row.max_capacity,
      registrationsCount: row.registrations_count || 0,
      skillLevel: row.skill_level,
      category: row.category,
      instructor: row.instructor,
      location: row.location || 'Online',
    } as Workshop));
  }

  static async getNextAvailableWeek(
    currentWeekStart: Date,
    filters: WorkshopFilters
  ): Promise<{
    hasWorkshops: boolean;
    weekStart?: Date;
    weekEnd?: Date;
    workshopCount?: number;
  } | null> {
    try {
      // Check next 3 weeks
      for (let weekOffset = 1; weekOffset <= 3; weekOffset++) {
        const nextWeekStart = addWeeks(currentWeekStart, weekOffset);
        const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 0 });
        
        const workshops = await this.getWorkshopsWeek(
          nextWeekStart, 
          nextWeekEnd, 
          filters
        );
        
        if (workshops.length > 0) {
          return {
            hasWorkshops: true,
            weekStart: nextWeekStart,
            weekEnd: nextWeekEnd,
            workshopCount: workshops.length
          };
        }
      }
      
      return { hasWorkshops: false };
    } catch (error) {
      console.error('Error checking next available week:', error);
      return null;
    }
  }

  static async createWorkshop(workshopData: CreateWorkshopData): Promise<Workshop> {
    console.log('Creating workshop with data:', workshopData);
    
    const insertData = {
      name: workshopData.name,
      date: workshopData.date.toISOString().split('T')[0],
      time: workshopData.time,
      description: workshopData.description || null,
      spots_remaining: workshopData.spots_remaining,
      max_capacity: workshopData.max_capacity,
      skill_level: workshopData.skill_level,
      category: workshopData.category,
      instructor: workshopData.instructor,
      location: workshopData.location,
    };

    console.log('Insert data prepared:', insertData);

    const { data, error } = await supabase
      .from('workshops')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database error creating workshop:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      if (error.code === '23505') {
        throw new Error('A workshop with this name already exists');
      } else if (error.code === '23514') {
        throw new Error('Invalid workshop data provided');
      } else if (error.message.includes('uuid')) {
        throw new Error('Invalid workshop identifier format');
      } else {
        throw new Error(`Failed to create workshop: ${error.message}`);
      }
    }

    console.log('Workshop created in database:', data);
    return this.transformDatabaseWorkshop(data);
  }

  static async updateWorkshop(id: string, workshopData: Partial<CreateWorkshopData>): Promise<Workshop> {
    console.log('Updating workshop with ID:', id, 'Data:', workshopData);
    
    const updateData: any = { ...workshopData };
    if (updateData.date) {
      updateData.date = updateData.date.toISOString().split('T')[0];
    }

    console.log('Prepared update data:', updateData);

    const { data, error } = await supabase
      .from('workshops')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Database error updating workshop:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      if (error.code === '42501') {
        throw new Error('Access denied: Only administrators can update workshops');
      } else if (error.code === '23505') {
        throw new Error('A workshop with this name already exists');
      } else {
        throw new Error(`Failed to update workshop: ${error.message}`);
      }
    }

    if (!data) {
      throw new Error('Workshop not found or you do not have permission to update it');
    }

    console.log('Workshop updated successfully:', data);
    return this.transformDatabaseWorkshop(data);
  }

  static async deleteWorkshop(id: string): Promise<void> {
    const { error } = await supabase
      .from('workshops')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting workshop:', error);
      throw new Error('Failed to delete workshop');
    }
  }

  private static transformDatabaseWorkshop(dbWorkshop: DatabaseWorkshop): Workshop {
    return {
      id: dbWorkshop.id,
      name: dbWorkshop.name,
      date: new Date(dbWorkshop.date),
      time: dbWorkshop.time,
      description: dbWorkshop.description || '',
      spotsRemaining: dbWorkshop.spots_remaining,
      maxCapacity: dbWorkshop.max_capacity,
      registrationsCount: dbWorkshop.max_capacity - dbWorkshop.spots_remaining, // Calculate from existing data
      skillLevel: dbWorkshop.skill_level as "Beginner" | "Intermediate" | "Advanced",
      category: dbWorkshop.category as "Mac" | "iPhone" | "Apple Watch" | "AI" | "Digital Safety" | "Creativity" | "Productivity" | "iCloud",
      instructor: dbWorkshop.instructor,
      location: dbWorkshop.location as "iSystem Khalda" | "iSystem Abdoun" | "iSystem Mecca Street" | "iSystem Swefieh" | "iSystem City Mall" | "Mecca Mall - SmartTech" | "Online",
    };
  }
}