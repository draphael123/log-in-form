// Test script to send welcome email
// Run with: npx tsx scripts/test-email.ts

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  console.log("🚀 Sending test welcome email...\n");
  console.log("API Key:", process.env.RESEND_API_KEY ? "✅ Set" : "❌ Not set");
  
  try {
    const { data, error } = await resend.emails.send({
      from: "ForumFlow <onboarding@resend.dev>",
      to: "daniel@fountain.net",
      subject: "Welcome to this test website! 🎉",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafaf9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 40px;">🎉</span>
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #6366f1;">Welcome to this test website!</h1>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; border: 2px solid #e5e7eb; margin-bottom: 24px; overflow: hidden;">
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);"></td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 18px; line-height: 28px; color: #1c1917;">
                Hey Daniel! 👋
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 26px; color: #44403c;">
                Thanks for signing up! You're now part of our awesome community. 🚀
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 26px; color: #44403c;">
                Here's what you can do:
              </p>
              <ul style="margin: 0 0 24px; padding-left: 0; list-style: none; color: #44403c;">
                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                  <span style="position: absolute; left: 0;">✅</span>
                  Create and organize forum posts
                </li>
                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                  <span style="position: absolute; left: 0;">💡</span>
                  Get smart suggestions based on your content
                </li>
                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                  <span style="position: absolute; left: 0;">⚡</span>
                  Edit and manage posts anytime
                </li>
                <li style="margin-bottom: 12px; padding-left: 28px; position: relative;">
                  <span style="position: absolute; left: 0;">🎨</span>
                  Customize your experience in settings
                </li>
              </ul>
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); border-radius: 12px;">
                    <a href="https://formflow-app-gamma.vercel.app/dashboard" 
                       style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 16px;">
              <p style="margin: 0 0 8px; font-size: 24px;">
                🚀 💜 ✨
              </p>
              <p style="margin: 0; font-size: 14px; color: #78716c;">
                Have fun exploring!
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
      text: `
Welcome to this test website! 🎉

Hey Daniel! 👋

Thanks for signing up! You're now part of our awesome community. 🚀

Here's what you can do:
✅ Create and organize forum posts
💡 Get smart suggestions based on your content
⚡ Edit and manage posts anytime
🎨 Customize your experience in settings

Go to your dashboard: https://formflow-app-gamma.vercel.app/dashboard

Have fun exploring! 🚀 💜 ✨
      `.trim(),
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      return;
    }

    console.log("✅ Email sent successfully!");
    console.log("📧 Email ID:", data?.id);
  } catch (err) {
    console.error("❌ Exception:", err);
  }
}

sendTestEmail();

