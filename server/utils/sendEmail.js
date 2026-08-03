
import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: `"Waitlist" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${to}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message)
    return { success: false, error: error.message }
  }
}

export const sendVerificationEmail = async (email, code, waitlistName) => {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #000000; border-radius: 50%; margin-bottom: 16px;">
          <span style="color: #ffffff; font-weight: bold; font-size: 18px;">W</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 800; color: #111827; margin: 0;">Verify Your Email</h1>
        <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">
          Use the code below to join <strong>${waitlistName || 'the waitlist'}</strong>
        </p>
      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Your Verification Code</p>
        <p style="font-size: 36px; font-weight: 800; letter-spacing: 0.3em; color: #111827; margin: 0; font-family: monospace;">${code}</p>
      </div>

      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `Your verification code: ${code}`,
    html
  })
}

export default sendEmail