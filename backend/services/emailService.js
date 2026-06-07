const nodemailer = require('nodemailer');

// Create transporter only if SMTP credentials are provided
let transporter = null;

try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
} catch (error) {
  console.log('Email service not configured - emails will be skipped');
}

const emailService = {
  sendEmail: async (options) => {
    // Skip if no transporter configured
    if (!transporter) {
      console.log('Email skipped (no SMTP config):', options.subject);
      return { skipped: true };
    }

    const mailOptions = {
      from: `StuGig Support <${process.env.SMTP_FROM || 'support@stugig.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error.message);
      // Don't throw error - just log it
      return { error: error.message };
    }
  },

  sendVerificationEmail: async (user, token) => {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-2xl;">
        <h2 style="color: #4f46e5; text-align: center;">Welcome to StuGig!</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for signing up for StuGig - the student freelance and internship marketplace. Please verify your email address to activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #64748b; font-size: 14px;">${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">This link will expire in 24 hours.</p>
      </div>
    `;
    return emailService.sendEmail({
      email: user.email,
      subject: 'Verify your email for StuGig',
      html,
    });
  },

  sendPasswordResetEmail: async (user, token) => {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-2xl;">
        <h2 style="color: #dc2626; text-align: center;">Reset Your Password</h2>
        <p>Hi ${user.firstName},</p>
        <p>You requested a password reset for your StuGig account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #64748b; font-size: 14px;">${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">This link will expire in 1 hour.</p>
      </div>
    `;
    return emailService.sendEmail({
      email: user.email,
      subject: 'StuGig - Password Reset Request',
      html,
    });
  },
};

module.exports = emailService;
