import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, full_name } = body
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const supabaseAdmin = createServerSupabase()

    // Lookup the auth user by email using the admin API
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) return NextResponse.json({ error: listError.message }, { status: 500 })
    const user = users.find(u => u.email === email)

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Auth user not found yet' }, { status: 404 })
    }

    // Check if profile exists to avoid overwriting roles (like admin -> student)
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (!existingProfile) {
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({ id: user.id, email, full_name, role: 'student' })

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    } else {
      // Profile exists, just update email or full_name if needed (don't touch role)
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ email, full_name })
        .eq('id', user.id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    // Return the role so the login page can redirect immediately
    const finalRole = existingProfile?.role || 'student'
    return NextResponse.json({ ok: true, role: finalRole })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
