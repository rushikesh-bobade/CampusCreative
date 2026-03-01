import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (process.env.NODE_ENV === 'development') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing in .env.local')
  } else {
    console.log('Supabase client initialized with endpoint:', supabaseUrl)
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
