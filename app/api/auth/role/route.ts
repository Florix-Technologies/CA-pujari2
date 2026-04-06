import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabaseAdmin = createServerSupabase()
    
    // Fetch profile using service role to bypass RLS
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching role in API:', error.message)
      return NextResponse.json({ role: 'student' })
    }

    return NextResponse.json({ role: profile?.role || 'student' })
  } catch (err: any) {
    console.error('Role API caught error:', err)
    return NextResponse.json({ role: 'student' }, { status: 500 })
  }
}
