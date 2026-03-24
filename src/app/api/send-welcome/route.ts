import { Resend } from 'resend'
import { NextResponse, type NextRequest } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const firstName = name ? name.split(' ')[0] : 'there'

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to Homagio 🏠',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: -apple-system, Helvetica Neue, Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: #0D1B2A; padding: 32px; text-align: center;">
                        <div style="font-size: 28px; font-weight: 700; letter-spacing: -1px;">
                          <span style="color: #006aff;">hom</span><span style="color: #ffffff;">agio</span>
                        </div>
                        <div style="color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 6px;">Your Home Intelligence Platform</div>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px 32px;">
                        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px; letter-spacing: -0.5px;">
                          Welcome, ${firstName}! 🏠
                        </h1>
                        <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 0 0 24px;">
                          Your Homagio account is ready. You can now start building your home's digital twin — catalog every material, track every dollar, and discover every possibility.
                        </p>

                        <!-- What you can do -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f8f8; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
                          <tr><td>
                            <div style="font-size: 13px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">Get started</div>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: #333;">
                                  <span style="margin-right: 10px;">🏠</span> Add your home and its details
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: #333;">
                                  <span style="margin-right: 10px;">🚪</span> Create rooms for each space
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: #333;">
                                  <span style="margin-right: 10px;">📦</span> Catalog materials, brands, and costs
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: #333;">
                                  <span style="margin-right: 10px;">💰</span> Track your home's value over time
                                </td>
                              </tr>
                            </table>
                          </td></tr>
                        </table>

                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center">
                              <a href="https://homagio-app.vercel.app/dashboard" style="display: inline-block; background: #006aff; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: -0.2px;">
                                Go to My Dashboard →
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 24px 32px; border-top: 1px solid #f0f0f0; text-align: center;">
                        <p style="font-size: 12px; color: #aaa; margin: 0;">
                          © 2025 Homagio, Inc. · <a href="https://homagio-app.vercel.app" style="color: #aaa; text-decoration: none;">homagio-app.vercel.app</a>
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
