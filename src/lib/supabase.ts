import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Safe logging for browser console diagnostics
if (typeof window !== 'undefined') {
  console.log('🔌 [Supabase Client Diagnostics]:', {
    urlFound: Boolean(supabaseUrl),
    anonKeyFound: Boolean(supabaseAnonKey),
    isConfigured: isConfigured,
    urlLength: supabaseUrl.length,
    anonKeyLength: supabaseAnonKey.length,
  });
}

// Real client
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

export { isConfigured };
