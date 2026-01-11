import { getUserSettings } from "@/actions/settings.actions";
import { SettingsForm } from "@/components/settings-form";
import { EmailForm } from "@/components/email-form";
import { PasswordForm } from "@/components/password-form";
import { DangerZone } from "@/components/danger-zone";
import Link from "next/link";

export default async function SettingsPage() {
  const settings = await getUserSettings();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">Settings</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your FormFlow experience
        </p>
      </div>

      {/* Account Info Card */}
      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30">
            {settings.userName?.charAt(0)?.toUpperCase() || settings.userEmail?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {settings.userName || "No name set"}
            </h2>
            <p className="text-muted-foreground">{settings.userEmail}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Member since {formatDate(settings.userCreatedAt!)}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <SettingsForm settings={settings} />

      {/* Email Form */}
      <EmailForm currentEmail={settings.userEmail!} />

      {/* Password Form */}
      <PasswordForm />

      {/* Danger Zone */}
      <DangerZone />
    </div>
  );
}

