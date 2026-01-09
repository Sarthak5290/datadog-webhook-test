// Supabase client utility

import { createClient } from '@supabase/supabase-js';

// Environment variables (already configured in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create and export a singleton Supabase client
// This can be used on both server and client side
export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Export a default instance for convenience
export const supabase = getSupabaseClient();
