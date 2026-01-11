import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "ForumFlow <onboarding@resend.dev>";
const APP_URL = process.env.NEXTAUTH_URL || "https://formflow-app-gamma.vercel.app";

export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name?: string | null;
}) {
  const firstName = name?.split(" ")[0] || "there";

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
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
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 40px;">🎉</span>
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Welcome to this test website!</h1>
            </td>
          </tr>
        </table>

        <!-- Main Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; border: 2px solid #e5e7eb; margin-bottom: 24px; overflow: hidden;">
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);"></td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 18px; line-height: 28px; color: #1c1917;">
                Hey ${firstName}! 👋
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
                    <a href="${process.env.NEXTAUTH_URL || "https://formflow-app-gamma.vercel.app"}/dashboard" 
                       style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Fun Footer -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 16px;">
              <p style="margin: 0 0 8px; font-size: 24px;">
                🚀 💜 ✨
              </p>
              <p style="margin: 0; font-size: 14px; color: #78716c;">
                Have fun exploring!
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #a8a29e;">
                You received this email because you signed up for our test website.
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

Hey ${firstName}! 👋

Thanks for signing up! You're now part of our awesome community. 🚀

Here's what you can do:
✅ Create and organize forum posts
💡 Get smart suggestions based on your content
⚡ Edit and manage posts anytime
🎨 Customize your experience in settings

Go to your dashboard: ${process.env.NEXTAUTH_URL || "https://formflow-app-gamma.vercel.app"}/dashboard

Have fun exploring! 🚀 💜 ✨
      `.trim(),
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error };
    }

    console.log("Welcome email sent:", data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
}

export async function sendPasswordChangedEmail({
  email,
  name,
}: {
  email: string;
  name?: string | null;
}) {
  const firstName = name?.split(" ")[0] || "there";
  const changedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "🔐 Your password was changed",
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
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #22c55e, #10b981); border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 40px;">🔐</span>
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #1c1917;">Password Changed</h1>
            </td>
          </tr>
        </table>

        <!-- Main Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; border: 2px solid #e5e7eb; margin-bottom: 24px; overflow: hidden;">
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #22c55e, #10b981);"></td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 18px; line-height: 28px; color: #1c1917;">
                Hey ${firstName}! 👋
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 26px; color: #44403c;">
                Your password was successfully changed on:
              </p>
              <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #166534;">
                  📅 ${changedAt}
                </p>
              </div>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 26px; color: #44403c;">
                If you made this change, you can safely ignore this email. ✅
              </p>
              <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #991b1b;">
                  ⚠️ <strong>Didn't make this change?</strong><br>
                  If you didn't change your password, your account may be compromised. Please contact support immediately.
                </p>
              </div>
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px;">
                    <a href="${APP_URL}/dashboard" 
                       style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 16px;">
              <p style="margin: 0; font-size: 14px; color: #78716c;">
                Keep your account secure! 🔒
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #a8a29e;">
                This is an automated security notification.
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
Password Changed 🔐

Hey ${firstName}! 👋

Your password was successfully changed on:
📅 ${changedAt}

If you made this change, you can safely ignore this email. ✅

⚠️ Didn't make this change?
If you didn't change your password, your account may be compromised. Please contact support immediately.

Go to your dashboard: ${APP_URL}/dashboard

Keep your account secure! 🔒
      `.trim(),
    });

    if (error) {
      console.error("Failed to send password changed email:", error);
      return { success: false, error };
    }

    console.log("Password changed email sent:", data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Error sending password changed email:", error);
    return { success: false, error };
  }
}
