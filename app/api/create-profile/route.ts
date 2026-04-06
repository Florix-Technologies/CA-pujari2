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

      // Trigger New User Registration Email to Admin
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY || '');
        const adminEmail = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',')[0] : 'admin@cashobha.in';

        await resend.emails.send({
          from: 'Shobha Registration <info@cashobha.in>',
          to: adminEmail, // Sending specifically to the requested inbox
          subject: `New User Registration: ${full_name || email}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #D1AF62;">New Platform Registration</h2>
              <p>A new user has signed up for the platform.</p>
              <p><strong>Name:</strong> ${full_name || 'N/A'}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send registration notification email:', emailError);
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
