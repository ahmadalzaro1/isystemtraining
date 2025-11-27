import { supabase } from "@/integrations/supabase/client";

export interface WaitlistEntry {
  id: string;
  workshop_id: string;
  email: string;
  name?: string;
  phone?: string;
  created_at: string;
  status: 'waiting' | 'notified' | 'converted' | 'expired';
  queue_position?: number;
}

export const WaitlistService = {
  /**
   * Add a user to the waitlist for a workshop
   * Returns the waitlist ID and position in queue
   */
  async addToWaitlist(
    workshopId: string,
    email: string,
    name?: string,
    phone?: string
  ): Promise<{ id: string; queuePosition: number }> {
    const { data, error } = await supabase.rpc('add_to_waitlist', {
      p_workshop_id: workshopId,
      p_email: email,
      p_name: name || null,
      p_phone: phone || null,
    });

    if (error) {
      console.error('Error adding to waitlist:', error);
      throw new Error(error.message || 'Failed to join waitlist');
    }

    if (!data || data.length === 0) {
      throw new Error('Failed to join waitlist');
    }

    return {
      id: data[0].id,
      queuePosition: data[0].queue_position,
    };
  },

  /**
   * Get the waitlist count for a specific workshop
   */
  async getWaitlistCount(workshopId: string): Promise<number> {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshopId)
      .eq('status', 'waiting');

    if (error) {
      console.error('Error getting waitlist count:', error);
      return 0;
    }

    return count || 0;
  },

  /**
   * Get a user's position in the waitlist
   */
  async getWaitlistPosition(workshopId: string, email: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('waitlist')
      .select('created_at')
      .eq('workshop_id', workshopId)
      .eq('email', email.toLowerCase())
      .eq('status', 'waiting')
      .single();

    if (error || !data) {
      return null;
    }

    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshopId)
      .eq('status', 'waiting')
      .lte('created_at', data.created_at);

    return count || null;
  },
};
