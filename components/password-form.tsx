"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updatePassword, SettingsState } from "@/actions/settings.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {pending ? "Updating..." : "Update Password"}
    </button>
  );
}

export function PasswordForm() {
  const [state, formAction] = useFormState<SettingsState | null, FormData>(
    updatePassword,
    null
  );

  return (
    <Card className="overflow-hidden border-0 shadow-xl shadow-purple-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            🔐
          </span>
          Change Password
        </CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.message && (
            <Alert variant={state.success ? "success" : "error"}>
              {state.message}
            </Alert>
          )}

          <Input
            name="currentPassword"
            type="password"
            label="Current Password"
            placeholder="Enter your current password"
            required
          />

          <Input
            name="newPassword"
            type="password"
            label="New Password"
            placeholder="At least 8 characters"
            required
          />

          <Input
            name="confirmPassword"
            type="password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            required
          />

          <div className="flex justify-end pt-2">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

