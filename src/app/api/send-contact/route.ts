import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Email 1: Notify you (the Homagio inbox)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.RESEND_FROM_EMAIL as string,
      reply_to: email,
      subject: `[Homagio Contact] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 700; color: #006aff;">hom</span><span style="font-size: 20px; font-weight: 700; color: #111;">agio</span>
          </div>
          <h2 style="color: #111; margin-bottom: 4px;">New Contact Form Submission</h2>
          <p style="color: #666; margin-top: 0;">Someone reached out via the Homagio contact form.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 100px; vertical-align: top;"><strong>Name</strong></td>
              <td style="padding: 8px 0; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Email</strong></td>
              <td style="padding: 8px 0; color: #111;"><a href="mailto:${email}" style="color: #006aff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Subject</strong></td>
              <td style="padding: 8px 0; color: #111;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Message</strong></td>
              <td style="padding: 8px 0; color: #111; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 13px;">Hit Reply to respond directly to ${name}.</p>
        </div>
      `,
    });

    // Email 2: Confirmation to the person who submitted
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `We got your message — homagio`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 700; color: #006aff;">hom</span><span style="font-size: 20px; font-weight: 700; color: #111;">agio</span>
          </div>
          <h2 style="color: #111;">Thanks for reaching out, ${name}!</h2>
          <p style="color: #444; line-height: 1.6;">We received your message and will get back to you as soon as possible — usually within 1–2 business days.</p>
          <div style="background: #f7f8fa; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Your message</p>
            <p style="margin: 0; color: #111; white-space: pre-wrap; font-size: 15px;">${message}</p>
          </div>
          <p style="color: #444; line-height: 1.6;">In the meantime, feel free to explore public homes on Homagio or start cataloguing your own.</p>
          <a href="https://homagio-app.vercel.app/explore" style="display: inline-block; margin-top: 8px; background: #006aff; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">Explore Homes</a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #999; font-size: 13px;">You're receiving this because you submitted the contact form at homagio-app.vercel.app.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact email error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
