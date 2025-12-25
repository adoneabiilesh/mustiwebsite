import { createBrowserClient } from '@supabase/ssr';

// NEXT_PUBLIC_ is REQUIRED for client-side environment variables in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        console.error('❌ Supabase environment variables are MISSING in the browser!');
        console.log('Available process.env keys:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
    }
} else {
    if (typeof window !== 'undefined') {
        console.log('✅ Supabase initialized with URL:', supabaseUrl.substring(0, 15) + '...');
    }
}

export function createClient() {
    // If variables are missing, this will throw a helpful error from @supabase/ssr
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
