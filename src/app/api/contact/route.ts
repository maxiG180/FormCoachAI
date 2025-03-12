// src/app/api/contact/route.ts
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the data
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Send email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: 'FormCoachAI <no-reply@formcoachai.com>', 
      to: [process.env.ZOHO_EMAIL || 'contact@formcoachai.com'],
      replyTo: data.email, // Changed from reply_to to replyTo
      subject: `FormCoachAI: Message from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6500;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <div style="margin-top: 20px; border-left: 4px solid #FF6500; padding-left: 15px;">
            <p><strong>Message:</strong></p>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 30px;">
            This email was sent from the FormCoachAI contact form.
          </p>
        </div>
      `,
    });
    
    if (error) {
      console.error('Resend API error:', error);
      throw new Error(error.message);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}