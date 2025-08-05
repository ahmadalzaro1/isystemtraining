import { supabase } from "@/integrations/supabase/client";
import { Workshop } from "@/types/workshop";

export interface DatabaseWorkshop {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string | null;
  spots_remaining: number;
  skill_level: string;
  category: string;
  instructor: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkshopData {
  name: string;
  date: Date;
  time: string;
  description?: string;
  spots_remaining: number;
  skill_level: "Beginner" | "Intermediate" | "Advanced";
  category: "Mac" | "iPhone" | "Apple Watch" | "AI" | "Digital Safety" | "Creativity" | "Productivity" | "iCloud";
  instructor: string;
}

export class WorkshopService {
  static async getWorkshops(): Promise<Workshop[]> {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching workshops:', error);
      throw new Error('Failed to fetch workshops');
    }

    return data.map(this.transformDatabaseWorkshop);
  }

  static async createWorkshop(workshopData: CreateWorkshopData): Promise<Workshop> {
    const { data, error } = await supabase
      .from('workshops')
      .insert({
        name: workshopData.name,
        date: workshopData.date.toISOString().split('T')[0],
        time: workshopData.time,
        description: workshopData.description || null,
        spots_remaining: workshopData.spots_remaining,
        skill_level: workshopData.skill_level,
        category: workshopData.category,
        instructor: workshopData.instructor,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workshop:', error);
      throw new Error('Failed to create workshop');
    }

    return this.transformDatabaseWorkshop(data);
  }

  static async updateWorkshop(id: string, workshopData: Partial<CreateWorkshopData>): Promise<Workshop> {
    const updateData: any = { ...workshopData };
    if (updateData.date) {
      updateData.date = updateData.date.toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('workshops')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating workshop:', error);
      throw new Error('Failed to update workshop');
    }

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
      skillLevel: dbWorkshop.skill_level as "Beginner" | "Intermediate" | "Advanced",
      category: dbWorkshop.category as "Mac" | "iPhone" | "Apple Watch" | "AI" | "Digital Safety" | "Creativity" | "Productivity" | "iCloud",
      instructor: dbWorkshop.instructor,
    };
  }
}