import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'
import { Resend } from 'resend'

const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@cashobha.in']

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || '')
  try {
    const body = await request.json()
    const { 
      fullName, 
      email, 
      phone, 
      company, 
      message, 
      serviceName 
    } = body

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Save to Supabase (contact_inquiries table)
    const supabaseAdmin = createServerSupabase()
    const { data: inquiry, error: dbError } = await supabaseAdmin
      .from('contact_inquiries')
      .insert({
        full_name: fullName,
        email: email,
        phone_number: phone,
        company: company || null,
        message: message,
        service_interested: serviceName,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (dbError) {
      console.error('Database error details:', dbError.message || dbError)
      // If the table name or columns don't match, this will fail.
      // But we proceed to send emails anyway as fallback.
    }

    // 2. Send Emails via Resend
    try {
      // Email 1: Admin Notification
      await resend.emails.send({
        from: 'Inquiry System <info@cashobha.in>',
        to: ADMIN_EMAILS,
        subject: `New Premium Service Inquiry: ${fullName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #D1AF62;">New High-Value Inquiry Received</h2>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Client Name:</strong> ${fullName}</p>
            <p><strong>Client Email:</strong> ${email}</p>
            <p><strong>Client Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <hr />
            <p><strong>Message/Requirements:</strong></p>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `
      })

      // Email 2: Client Confirmation
      await resend.emails.send({
        from: 'Shobha Pujari <info@cashobha.in>',
        to: email,
        subject: `Inquiry Received: ${serviceName}`,
        html: `
          <div style="font-family: 'Playfair Display', serif; color: #3E3730; max-width: 600px; margin: 0 auto; border: 1px solid #D6CCBE; padding: 40px; border-radius: 20px;">
            <h1 style="color: #D1AF62; border-bottom: 2px solid #D1AF62; padding-bottom: 10px;">Inquiry Received</h1>
            <p>Dear <strong>${fullName}</strong>,</p>
            <p>Thank you for reaching out regarding our <strong>${serviceName}</strong>. This is a high-value strategy package, and we handle each inquiry with personal attention.</p>
            
            <p>Our team (or Shobha personally) will review your requirements and get back to you within 24-48 hours to discuss the next steps.</p>
            
            <div style="background-color: #F7F2E8; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Interested in:</strong> ${serviceName}</p>
              <p style="margin: 5px 0;"><strong>Inquiry Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>If you have any urgent questions, feel free to reach out to us at <a href="mailto:${ADMIN_EMAILS[0]}" style="color: #D1AF62;">${ADMIN_EMAILS[0]}</a>.</p>
            
            <p style="margin-top: 40px;">Best regards,<br><strong>Shobha Pujari Team</strong></p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    return NextResponse.json({ success: true, inquiry })
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
