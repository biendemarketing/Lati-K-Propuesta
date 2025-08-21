
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rnqlkcapgzapcdzzwlpq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucWxrY2FwZ3phcGNkenp3bHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDQxMjUsImV4cCI6MjA3MTMyMDEyNX0.A6Ppoi8MP56rH4beeLXsioqp5zi5n2p79lZjBY9yHpA';

if (!supabaseUrl) {
  console.error("Supabase URL is not configured. Please add it to lib/supabaseClient.tsx");
}
if (!supabaseAnonKey) {
  console.error("Supabase Anon Key is not configured. Please add it to lib/supabaseClient.tsx");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
