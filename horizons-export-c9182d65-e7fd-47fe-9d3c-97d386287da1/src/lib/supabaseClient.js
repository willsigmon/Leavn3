import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        // headers: { 'x-my-custom-header': 'my-app-name' },
      },
    });
    
    // Expose Supabase client and its properties for easier access in components if needed for functions URL etc.
    // Note: direct exposure of supabaseKey is generally fine for anon key.
    supabase.supabaseUrl = supabaseUrl;
    supabase.supabaseKey = supabaseAnonKey; // anon key
    supabase.functionsUrl = `${supabaseUrl}/functions/v1`;
  