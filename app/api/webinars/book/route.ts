import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'
import { Resend } from 'resend'

const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@cashobha.in']

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '')
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      webinar_title, 
      webinar_date, 
      webinar_time, 
      amount, 
      duration 
    } = body

    if (!name || !email || !webinar_title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Save to Supabase
    const supabaseAdmin = createServerSupabase()
    const { data: booking, error: dbError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: body.userId,
        email: email,
        full_name: name,
        phone_number: phone,
        service_type: 'Webinar',
        tier_name: webinar_title,
        price: parseFloat(amount) || 0,
        currency: 'INR',
        booking_status: 'confirmed',
        payment_status: 'paid',
        meeting_details: {
          scheduled_date: webinar_date,
          scheduled_time: webinar_time,
          duration: duration
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (dbError) {
      console.error('Database error details:', dbError.message || dbError)
      return NextResponse.json({ error: 'Failed to save booking', details: dbError.message || dbError }, { status: 500 })
    }

    // 2. Send Emails via Resend
    try {
      // Email 1: Client Confirmation
      await resend.emails.send({
        from: 'Shobha Pujari <info@cashobha.in>',
        to: email,
        subject: `Booking Confirmed: ${webinar_title}`,
        html: `
          <div style="font-family: 'Playfair Display', serif; color: #3E3730; max-width: 600px; margin: 0 auto; border: 1px solid #D6CCBE; padding: 40px; border-radius: 20px;">
            <h1 style="color: #D1AF62; border-bottom: 2px solid #D1AF62; padding-bottom: 10px;">Booking Confirmed</h1>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for registering for the <strong>${webinar_title}</strong>. Your seat has been successfully reserved.</p>
            
            <div style="background-color: #F7F2E8; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Webinar:</strong> ${webinar_title}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${webinar_date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${webinar_time}</p>
              <p style="margin: 5px 0;"><strong>Duration:</strong> ${duration}</p>
              <p style="margin: 5px 0;"><strong>Investment Paid:</strong> ${amount}</p>
            </div>
            
            <p style="background-color: #FFF9E6; padding: 15px; border-left: 4px solid #D1AF62;">
              <strong>Note:</strong> You will receive the session joining link on this email exactly one hour before the webinar starts.
            </p>
            
            <p>If you have any questions, feel free to reach out to us at <a href="mailto:${ADMIN_EMAILS[0]}" style="color: #D1AF62;">${ADMIN_EMAILS[0]}</a>.</p>
            
            <p style="margin-top: 40px;">Best regards,<br><strong>Shobha Pujari Team</strong></p>
          </div>
        `
      })

      // Email 2: Admin Notification
      await resend.emails.send({
        from: 'Booking System <info@cashobha.in>',
        to: ADMIN_EMAILS,
        subject: `New Webinar Booking: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2>New Booking Received</h2>
            <p><strong>Client Name:</strong> ${name}</p>
            <p><strong>Client Email:</strong> ${email}</p>
            <p><strong>Client Phone:</strong> ${phone}</p>
            <hr />
            <p><strong>Webinar:</strong> ${webinar_title}</p>
            <p><strong>Session Date:</strong> ${webinar_date}</p>
            <p><strong>Booking Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // We don't fail the request if emails fail, but we log it.
    }

    return NextResponse.json({ success: true, booking })
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
