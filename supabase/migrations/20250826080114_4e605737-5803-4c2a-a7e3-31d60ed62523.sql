-- Add unique constraint to ip_address column in guest_access_rate_limit table
-- This fixes the ON CONFLICT error in check_guest_access_rate_limit_enhanced() function
ALTER TABLE public.guest_access_rate_limit 
ADD CONSTRAINT guest_access_rate_limit_ip_address_key 
UNIQUE (ip_address);