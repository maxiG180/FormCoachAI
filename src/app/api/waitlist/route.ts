import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, message } = body;

    // Validate the request
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' }}
      );
    }

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'FormCoachAI <no-reply@formcoachai.com>', 
      to: [process.env.ZOHO_EMAIL || 'contact@formcoachai.com'],
      subject: "[WAITLIST] New FormCoachAI Waitlist Signup",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6500;">New Waitlist Signup</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Signed up at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Source:</strong> ${name || "Main Waitlist Form"}</p>
          <div style="margin-top: 20px; border-left: 4px solid #FF6500; padding-left: 15px;">
            <p><strong>Additional Info:</strong></p>
            <p>${message || "User requested to be notified when FormCoachAI launches."}</p>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 30px;">
            This email was sent from the FormCoachAI waitlist signup.
          </p>
        </div>
      `,
    });
    
    if (error) {
      console.error('Resend API error:', error);
      throw new Error(error.message);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Successfully joined the waitlist" }), 
      { status: 200, headers: { 'Content-Type': 'application/json' }}
    );
  } catch (error) {
    console.error("Error processing waitlist submission:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process waitlist submission" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' }}
    );
  }
}