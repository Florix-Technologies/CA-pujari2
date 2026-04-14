import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin)
    )
  }

  // Handle successful callback with authorization code
  if (code) {
    try {
      const supabaseAdmin = createServerSupabase()

      // Exchange the code for a session
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.exchangeCodeForSession(code)
      if (sessionError || !sessionData.session) {
        console.error('Session exchange error:', sessionError)
        return NextResponse.redirect(
          new URL('/login?error=session-failed', requestUrl.origin)
        )
      }

      const { session } = sessionData
      const user = session.user

      if (!user?.email || !user?.id) {
        return NextResponse.redirect(
          new URL('/login?error=invalid-user', requestUrl.origin)
        )
      }

      // Check if profile exists
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        // Create new profile for OAuth user
        const { error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
            role: 'student',
          })

        if (insertError) {
          console.error('Profile creation error:', insertError)
          return NextResponse.redirect(
            new URL('/login?error=profile-creation-failed', requestUrl.origin)
          )
        }

        // Send registration notification email
        try {
          const { Resend } = await import('resend')
          const resend = new Resend(process.env.RESEND_API_KEY || '')
          const adminEmail = process.env.ADMIN_EMAILS
            ? process.env.ADMIN_EMAILS.split(',')[0]
            : 'admin@cashobha.in'

          await resend.emails.send({
            from: 'Shobha Registration <info@cashobha.in>',
            to: adminEmail,
            subject: `New User Registration (Google): ${user.user_metadata?.full_name || user.email}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #D1AF62;">New Platform Registration (Google OAuth)</h2>
                <p>A new user has signed up via Google.</p>
                <p><strong>Name:</strong> ${user.user_metadata?.full_name || 'N/A'}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Auth Method:</strong> Google OAuth</p>
              </div>
            `,
          })
        } catch (emailError) {
          console.error('Failed to send registration notification:', emailError)
        }
      }

      // Create response with session cookies
      const response = NextResponse.redirect(
        new URL('/', requestUrl.origin)
      )

      // Set session cookies
      const { data: { session: newSession } } = await supabaseAdmin.auth.getSession()
      if (newSession) {
        response.cookies.set('sb-access-token', newSession.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
        response.cookies.set('sb-refresh-token', newSession.refresh_token || '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
      }

      return response
    } catch (err) {
      console.error('Auth callback error:', err)
      return NextResponse.redirect(
        new URL('/login?error=callback-failed', requestUrl.origin)
      )
    }
  }

  // No code - shouldn't happen
  return NextResponse.redirect(new URL('/login?error=no-code', requestUrl.origin))
}
