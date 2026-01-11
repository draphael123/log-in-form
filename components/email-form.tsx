"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateEmail, SettingsState } from "@/actions/settings.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

interface EmailFormProps {
  currentEmail: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {pending ? "Updating..." : "Update Email"}
    </button>
  );
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const [state, formAction] = useFormState<SettingsState | null, FormData>(
    updateEmail,
    null
  );

  return (
    <Card className="overflow-hidden border-0 shadow-xl shadow-purple-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            ✉️
          </span>
          Change Email
        </CardTitle>
        <CardDescription>Update your email address. You&apos;ll need to verify your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.message && (
            <Alert variant={state.success ? "success" : "error"}>
              {state.message}
            </Alert>
          )}

          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Current email</p>
            <p className="text-sm font-medium">{currentEmail}</p>
          </div>

          <Input
            name="newEmail"
            type="email"
            label="New Email Address"
            placeholder="Enter your new email"
            required
          />

          <Input
            name="password"
            type="password"
            label="Confirm Your Password"
            placeholder="Enter your current password"
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

