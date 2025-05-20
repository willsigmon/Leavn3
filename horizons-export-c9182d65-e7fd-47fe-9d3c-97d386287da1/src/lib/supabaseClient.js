import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://gegergaanossklhfcowe.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZ2VyZ2Fhbm9zc2tsaGZjb3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDIwNTksImV4cCI6MjA2MzI3ODA1OX0.irpWBnKuPHExDOLFia-skPBPjgTlQhOaPLT5Ehiosk0';
    
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
  