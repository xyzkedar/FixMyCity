import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wfajevdditvelmzlkgmi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYWpldmRkaXR2ZWxtemxrZ21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjEyMjEsImV4cCI6MjA4NzA5NzIyMX0.Rzxlfc1bp5LWlU3VlmmVfIEnIY8ChvIE99GEzbchRWQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { supabaseUrl, supabaseAnonKey };
