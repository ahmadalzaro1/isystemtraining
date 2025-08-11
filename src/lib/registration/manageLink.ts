import { supabase } from "@/integrations/supabase/client";

export async function sendManageLink(code: string, email: string) {
  const { data, error } = await supabase.functions.invoke('send-manage-link', {
    body: { email, code, siteUrl: window.location.origin },
  });
  if (error) throw new Error(error.message || 'Failed to send manage link');
  return data;
}

export async function linkRegsToUser(email: string) {
  const { error } = await supabase.rpc('link_guest_regs_to_user', { p_email: email });
  if (error) throw new Error(error.message || 'Failed to link registrations');
}
