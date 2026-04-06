import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, full_name } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    const supabaseAdmin = createServerSupabase()

    // Create the user via admin API and mark email as confirmed to avoid email sending
    const createRes = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    })

    // Log full response for easier debugging
    // eslint-disable-next-line no-console
    console.debug('admin.createUser response', createRes)

    // Support both shapes: { data, error } or { user, error }
    const maybeError = (createRes as any).error ?? (createRes as any).error
    const created = (createRes as any).data?.user ?? (createRes as any).data ?? (createRes as any).user

    if (maybeError) {
      // eslint-disable-next-line no-console
      console.error('admin.createUser error', maybeError)
      return NextResponse.json({ error: maybeError.message ?? String(maybeError), detail: maybeError }, { status: 500 })
    }

    if (!created || !created.id) {
      // eslint-disable-next-line no-console
      console.error('admin.createUser unexpected response', createRes)
      return NextResponse.json({ error: 'Failed to create user', detail: createRes }, { status: 500 })
    }

    // Upsert profile row using service role key
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: created.id, email, full_name, role: 'student' }, { onConflict: 'id' })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Attempt to send registration email notification to Admin
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY || '');
      const adminEmail = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',')[0] : 'admin@cashobha.in';

      await resend.emails.send({
        from: 'Shobha Registration <info@cashobha.in>',
        to: adminEmail,
        subject: `New User Registration: ${full_name || email}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #D1AF62;">New Platform Registration (Admin Fallback Route)</h2>
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

    return NextResponse.json({ ok: true, user: { id: created.id, email: created.email } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
