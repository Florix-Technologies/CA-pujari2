import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'
import { Resend } from 'resend'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '')
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      webinar_title, // This will be the NSE Plan Title
      amount, 
      section // foundational or advanced
    } = body

    if (!name || !email || !webinar_title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Centralized Admin Recipient for all programs
    const targetAdminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@cashobha.in']

    // 1. Save to Supabase (reusing bookings table)
    const supabaseAdmin = createServerSupabase()
    const { data: booking, error: dbError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: body.userId,
        email: email,
        full_name: name,
        phone_number: phone,
        service_type: 'NSE',
        tier_name: webinar_title,
        price: parseFloat(amount) || 0,
        currency: 'INR',
        booking_status: 'confirmed',
        payment_status: 'paid',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (dbError) {
      console.error('Database error details:', dbError.message || dbError)
      return NextResponse.json({ error: 'Failed to save NSE booking', details: dbError.message || dbError }, { status: 500 })
    }

    // 2. Send Emails via Resend
    try {
      // Email 1: Client Confirmation
      await resend.emails.send({
        from: 'Shobha Pujari <info@cashobha.in>',
        to: email,
        subject: `Enrollment Confirmed: ${webinar_title} (NSE Program)`,
        html: `
          <div style="font-family: 'Playfair Display', serif; color: #3E3730; max-width: 600px; margin: 0 auto; border: 1px solid #D6CCBE; padding: 40px; border-radius: 20px;">
            <h1 style="color: #D1AF62; border-bottom: 2px solid #D1AF62; padding-bottom: 10px;">Program Enrollment Confirmed</h1>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Welcome to the <strong>${webinar_title}</strong>. Your enrollment in the NSE Investment Program has been successfully processed.</p>
            
            <div style="background-color: #F7F2E8; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Program:</strong> ${webinar_title}</p>
              <p style="margin: 5px 0;"><strong>Category:</strong> ${section === 'foundational' ? 'Foundational & Growth' : 'Advanced & Elite'}</p>
              <p style="margin: 5px 0;"><strong>Investment Paid:</strong> ₹${amount}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> Active / Confirmed</p>
            </div>
            
            <p>Our team will reach out to you within 24 hours with your login credentials, program schedule, and onboarding material.</p>
            
            <p>If you have any questions, feel free to reply to this email or contact us at <a href="mailto:${targetAdminEmails[0]}" style="color: #D1AF62;">${targetAdminEmails[0]}</a>.</p>
            
            <p style="margin-top: 40px;">Best regards,<br><strong>Shobha Pujari Team</strong></p>
          </div>
        `
      })

      // Email 2: Admin Notification
      await resend.emails.send({
        from: 'NSE Booking System <info@cashobha.in>',
        to: targetAdminEmails,
        subject: `New NSE Enrollment: ${name} (${webinar_title})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #D1AF62;">New NSE Program Enrollment</h2>
            <p><strong>Program:</strong> ${webinar_title}</p>
            <p><strong>Category:</strong> ${section}</p>
            <p><strong>Client Name:</strong> ${name}</p>
            <p><strong>Client Email:</strong> ${email}</p>
            <p><strong>Client Phone:</strong> ${phone}</p>
            <p><strong>Amount Paid:</strong> ₹${amount}</p>
            <hr />
            <p><strong>Note:</strong> This notification was routed to this inbox based on the program category (${section}).</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    return NextResponse.json({ success: true, booking })
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
