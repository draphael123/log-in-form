import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "FormFlow <onboarding@resend.dev>";

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
      subject: "Welcome to FormFlow! 🎉",
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
              <div style="width: 48px; height: 48px; background-color: #ccfbf1; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 24px;">📋</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1c1917;">Welcome to FormFlow!</h1>
            </td>
          </tr>
        </table>

        <!-- Main Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e7e5e4; margin-bottom: 24px;">
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #1c1917;">
                Hey ${firstName}! 👋
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #44403c;">
                Thanks for creating an account with FormFlow. You're all set to start managing your entries with smart suggestions.
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #44403c;">
                Here's what you can do:
              </p>
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #44403c;">
                <li style="margin-bottom: 8px;">Create and organize form entries</li>
                <li style="margin-bottom: 8px;">Get smart suggestions based on your content</li>
                <li style="margin-bottom: 8px;">Edit and manage entries anytime</li>
              </ul>
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="background-color: #0d9488; border-radius: 8px;">
                    <a href="${process.env.NEXTAUTH_URL || "https://formflow-app-gamma.vercel.app"}/dashboard" 
                       style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
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
                FormFlow - Simple form management with smart suggestions
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #a8a29e;">
                You received this email because you signed up for FormFlow.
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
Hey ${firstName}!

Thanks for creating an account with FormFlow. You're all set to start managing your entries with smart suggestions.

Here's what you can do:
- Create and organize form entries
- Get smart suggestions based on your content
- Edit and manage entries anytime

Go to your dashboard: ${process.env.NEXTAUTH_URL || "https://formflow-app-gamma.vercel.app"}/dashboard

---
FormFlow - Simple form management with smart suggestions
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

