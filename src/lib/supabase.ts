import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://ouyribwxtjotjqbnvsdd.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91eXJpYnd4dGpvdGpxYm52c2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NTY1MjcsImV4cCI6MjEwMTQzMjUyN30.sJSqmi-4XjGB4qPph4vO7EJYuimWOIPJeImCFsmLP1w';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-public-anon-key-from-supabase'
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
