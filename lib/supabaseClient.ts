import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep this non-fatal at import time so local dev can still run other tasks,
  // but downstream code should fail fast if values are missing.
  // eslint-disable-next-line no-console
  console.warn('Supabase URL or anon key missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

/**
 * Create a server-side Supabase client using the service role key.
 * Use this only for trusted server operations (migrations, admin tasks).
 */
export function createServerSupabase(): SupabaseClient {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
  if (!serviceRole) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment')
  return createClient(url, serviceRole, { auth: { persistSession: false } })
}

export default supabase
