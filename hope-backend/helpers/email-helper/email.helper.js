/**
 * @fileoverview Email service utilities for THE_HOPE application
 * @module services/emailService
 * @description Nodemailer-based email sender with calming, supportive HTML templates
 *              Supports password resets and wellness communications
 */

const nodemailer = require("nodemailer");

// Validate required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error(
    "Missing required environment variables: EMAIL_USER and EMAIL_PASS",
  );
}

/**
 * Configured Nodemailer transporter (Gmail SMTP)
 * @type {import('nodemailer').Transporter}
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

/**
 * Send plain email with HTML content
 * @async
 * @param {Object} options
 * @param {string} options.to      - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html    - HTML body content
 * @returns {Promise<boolean>} Success status
 */
exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: "THE HOPE <nurture@thehope.app>",
      to: to.trim(),
      subject,
      html,
      text: html.replace(/<[^>]+>/g, " ").substring(0, 200) + "...",
    });

    console.log(`Email sent to ${to} | MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    return false;
  }
};

/**
 * Wrap content in calming, branded THE_HOPE HTML email template
 * @param {string} content - Main email body HTML
 * @param {string} [title="THE HOPE - Mental Health & Wellness"] - Document title
 * @returns {string} Complete HTML email
 */
exports.getEmailTemplate = (content, title = "THE HOPE") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { 
      margin:0; 
      padding:0; 
      background:#f0f5f9; 
      font-family:"Inter", system-ui, -apple-system, sans-serif; 
      line-height:1.6; 
      color:#2d3e4f; 
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: "Quicksand", sans-serif;
      font-weight: 600;
      color: #1e4a6d;
    }
    a { 
      color:#4A90E2; 
      text-decoration:none;
      font-weight: 500;
      transition: color 0.2s ease;
    }
    a:hover {
      color: #2C3E50;
    }
    .container { 
      max-width:640px; 
      margin:0 auto; 
      background:#ffffff; 
      border-radius:32px; 
      overflow:hidden; 
      box-shadow:0 20px 40px rgba(30, 74, 109, 0.08); 
    }
    .header { 
      background: linear-gradient(135deg, #B5E5CF 0%, #A8D8EA 50%, #F3D9DC 100%);
      padding: 40px 32px; 
      text-align: center; 
      position: relative;
    }
    .header::after {
      content: '☮︎';
      position: absolute;
      bottom: 20px;
      right: 30px;
      font-size: 48px;
      opacity: 0.1;
      color: #1e4a6d;
      transform: rotate(15deg);
    }
    .logo { 
      width: 180px; 
      height: auto; 
      margin-bottom: 8px;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
    }
    .brand-title { 
      color: #1e4a6d; 
      font-size: 32px; 
      font-weight: 700; 
      margin: 8px 0 0; 
      letter-spacing: -0.5px; 
      font-family: "Quicksand", sans-serif;
    }
    .brand-tagline {
      color: #4a6b8a;
      font-size: 16px;
      margin-top: 8px;
      font-weight: 400;
      opacity: 0.9;
    }
    .main-content { 
      padding: 56px 48px; 
      background: #ffffff; 
      color: #2d3e4f; 
    }
    .btn-primary { 
      display: inline-block; 
      background: linear-gradient(135deg, #6B9AC4 0%, #4A90E2 100%);
      color: #ffffff !important; 
      font-weight: 600; 
      font-size: 17px; 
      padding: 16px 42px; 
      border-radius: 40px; 
      text-decoration: none; 
      box-shadow: 0 8px 20px rgba(74, 144, 226, 0.25); 
      transition: all 0.3s ease;
      font-family: "Quicksand", sans-serif;
      letter-spacing: 0.3px;
    }
    .btn-primary:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 12px 28px rgba(74, 144, 226, 0.35); 
      background: linear-gradient(135deg, #5A8AC4 0%, #3A80D2 100%);
    }
    .btn-secondary {
      display: inline-block;
      background: transparent;
      color: #4A90E2 !important;
      font-weight: 600;
      font-size: 16px;
      padding: 14px 36px;
      border-radius: 40px;
      text-decoration: none;
      border: 2px solid #4A90E2;
      transition: all 0.3s ease;
    }
    .btn-secondary:hover {
      background: rgba(74, 144, 226, 0.05);
      color: #2C3E50 !important;
      border-color: #2C3E50;
    }
    .wellness-box { 
      background: #f8fafd; 
      border-radius: 24px; 
      padding: 32px; 
      margin: 36px 0; 
      border: 1px solid #e1ecf4;
    }
    .quote-box {
      background: #F3D9DC;
      border-radius: 24px;
      padding: 32px;
      margin: 36px 0;
      color: #4a4a4a;
      font-style: italic;
      text-align: center;
      font-size: 18px;
      font-family: "Quicksand", sans-serif;
      font-weight: 400;
      line-height: 1.8;
    }
    .quote-box::before {
      content: '"';
      font-size: 48px;
      color: #9f7e8a;
      opacity: 0.5;
      font-family: serif;
      line-height: 0;
      margin-right: 8px;
    }
    .resource-list {
      list-style: none;
      padding: 0;
      margin: 24px 0;
    }
    .resource-list li {
      padding: 16px 0 16px 32px;
      border-bottom: 1px solid #e1ecf4;
      position: relative;
    }
    .resource-list li::before {
      content: '☮︎';
      position: absolute;
      left: 0;
      color: #A8D8EA;
      font-size: 18px;
    }
    .resource-list li:last-child {
      border-bottom: none;
    }
    .mood-tracker {
      background: #E8F0FE;
      border-radius: 40px;
      padding: 8px;
      margin: 24px 0;
      display: flex;
      justify-content: space-around;
    }
    .mood-dot {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffffff;
      display: inline-block;
      margin: 0 4px;
    }
    .footer { 
      background: #f0f5f9; 
      padding: 48px 40px; 
      text-align: center; 
      color: #6b7f8e; 
      border-top: 1px solid #d9e4ec;
    }
    .footer-title { 
      color: #4A90E2; 
      font-size: 22px; 
      font-weight: 700; 
      margin: 0 0 12px; 
      font-family: "Quicksand", sans-serif;
    }
    .footer-copy { 
      font-size: 14px; 
      margin: 16px 0; 
      color: #6b7f8e;
    }
    .footer-links {
      margin: 24px 0;
    }
    .footer-links a {
      color: #4A90E2;
      margin: 0 12px;
      font-size: 14px;
    }
    .footer-note { 
      font-size: 13px; 
      color: #8a9aa8; 
      line-height: 1.6; 
      margin-top: 24px; 
      font-style: italic;
    }
    .crisis-resources {
      background: #FFF0F0;
      border-radius: 16px;
      padding: 20px;
      margin-top: 32px;
      border-left: 4px solid #E27A7A;
    }
    @media (max-width:600px) { 
      .main-content { padding: 40px 24px; } 
      .header { padding: 32px 24px; } 
      .wellness-box { padding: 24px; }
      .quote-box { padding: 24px; }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f5f9;padding:40px 20px;">
    <tr><td align="center">
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dd524q9vc/image/upload/v1773302419/THE_HOPE/logo/logo_gn9kup.png" alt="THE HOPE" class="logo" />
          <h1 class="brand-title">THE HOPE</h1>
          <p class="brand-tagline">Nurturing minds, spreading hope</p>
        </div>
        <div class="main-content">
          ${content}
          
          <!-- Calming reminder for all emails -->
          <div style="text-align:center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e1ecf4;">
            <p style="color:#6b7f8e; font-size:14px; font-style:italic; margin:0;">
              Take a moment to breathe. You're doing great. 🌿
            </p>
          </div>
        </div>
        <div class="footer">
          <p class="footer-title">THE HOPE</p>
          <p class="footer-copy">© ${new Date().getFullYear()} <strong style="color:#4A90E2;">THE HOPE</strong>. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">About Us</a>
            <a href="#">Privacy</a>
            <a href="#">Contact Support</a>
          </div>
          <p class="footer-note">
            This is an automated message from THE HOPE wellness platform.<br>
            If you didn't initiate this action, please ignore this email or contact our support team.
          </p>
          <div class="crisis-resources">
            <p style="margin:0; color:#7A4E4E; font-size:13px;">
              <strong>Need immediate support?</strong> Crisis Helpline: 988 or Text HOME to 741741
            </p>
          </div>
        </div>
      </div>
    </td></tr>
  </table>
</body>
</html>
`;

/**
 * Get frontend base URL based on user role
 * @param {string} role - User role
 * @returns {string} Frontend base URL
 */
function getFrontendUrl(role) {
  // Convert role to uppercase for consistency
  const normalizedRole = role?.toUpperCase();

  switch (normalizedRole) {
    case "SUPERADMIN":
      if (!process.env.FRONTEND_URL) {
        throw new Error("FRONTEND_URL environment variable is not defined");
      }
      return process.env.FRONTEND_URL.replace(/\/+$/, "");

    default:
      // Default to main frontend URL if no specific role config
      if (process.env.FRONTEND_URL) {
        return process.env.FRONTEND_URL.replace(/\/+$/, "");
      }
      throw new Error(`Unable to determine frontend URL for role: ${role}`);
  }
}

/**
 * Send calming password reset email with supportive language
 * @async
 * @param {string} toEmail    - Recipient email
 * @param {string} resetToken - Reset token
 * @param {string} role       - User role
 * @returns {Promise<boolean>}
 */
exports.sendPasswordResetEmail = async (toEmail, resetToken, role) => {
  const frontendUrl = getFrontendUrl(role);
  const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const content = `
    <div style="text-align:center;max-width:520px;margin:0 auto;">
      <h2 style="color:#1e4a6d;font-size:32px;margin-bottom:16px;font-weight:700;font-family:Quicksand, sans-serif;">
        Reset Your Password
      </h2>
      
      <p style="color:#4a6b8a;line-height:1.8;margin-bottom:24px;font-size:17px;">
        We received a request to reset the password for your THE HOPE account. 
        We're here to help you get back to your wellness journey.
      </p>
      
      <div class="wellness-box" style="text-align:left;">
        <p style="margin:0 0 16px; color:#2d3e4f;">
          <strong>✨ Quick reminder:</strong> Your password should be something you can remember easily, 
          but hard for others to guess. Take a deep breath — you've got this.
        </p>
      </div>
      
      <div style="margin:40px 0;">
        <a href="${resetLink}" class="btn-primary">Reset Password</a>
      </div>
      
      <p style="color:#6b7f8e;font-size:15px;line-height:1.7;">
        This reset link will be active for the next <strong style="color:#4A90E2;">1 hour</strong>.<br><br>
        If you didn't request this password reset, no action is needed — your account remains secure.
      </p>
      
      <div class="quote-box" style="margin-top: 40px;">
        "Self-care is not selfish. You cannot serve from an empty vessel."
      </div>
    </div>
  `;

  return await exports.sendEmail({
    to: toEmail,
    subject: "THE HOPE • Reset Your Password",
    html: exports.getEmailTemplate(content, "Password Reset - THE HOPE"),
  });
};

/**
 * Send 6-digit OTP for email verification with a calming, supportive theme
 * @async
 * @param {string} toEmail      - User's email address
 * @param {string} userName     - User's display name
 * @param {string} otp          - 6-digit plain OTP code
 * @returns {Promise<boolean>}  Success status
 */
exports.sendEmailVerificationOtp = async (toEmail, userName, otp) => {
  const content = `
    <div style="text-align:center; max-width:520px; margin:0 auto;">
      <h2 style="color:#1e4a6d; font-size:32px; margin-bottom:16px; font-weight:700; font-family:Quicksand, sans-serif;">
        Verify Your Account
      </h2>
      
      <p style="color:#4a6b8a; line-height:1.8; margin-bottom:24px; font-size:17px;">
        Hello ${userName || "there"},<br><br>
        Welcome to <strong>THE HOPE</strong>! We're so glad you're here. 
        Please use the verification code below to complete your sign-up and begin your wellness journey.
      </p>
      
      <div class="wellness-box" style="margin:40px 0; border: 2px dashed #A8D8EA; background: #f0f7ff;">
        <h1 style="font-size:48px; letter-spacing:12px; color:#4A90E2; margin:0; font-weight:900; font-family:'Inter', sans-serif;">
          ${otp}
        </h1>
      </div>

      <p style="color:#6b7f8e; font-size:15px; line-height:1.7; margin:30px 0;">
        This code is valid for <strong style="color:#4A90E2;">10 minutes</strong>.
      </p>

      <div class="quote-box">
        "The journey of a thousand miles begins with a single step."
      </div>
      
      <p style="color:#1e293b; font-size:16px; margin-top:40px; font-weight:500;">
        With care,<br>
        The THE_HOPE Team
      </p>
    </div>
  `;

  return await exports.sendEmail({
    to: toEmail,
    subject: "THE HOPE • Your Verification Code",
    html: exports.getEmailTemplate(content, "Email Verification - THE HOPE"),
  });
};
