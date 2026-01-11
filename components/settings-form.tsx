"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateSettings, SettingsState } from "@/actions/settings.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { CATEGORIES } from "@/lib/suggestions";

interface SettingsFormProps {
  settings: {
    userName?: string | null;
    theme: string;
    accentColor: string;
    emailNotifications: boolean;
    weeklyDigest: boolean;
    showSuggestions: boolean;
    compactView: boolean;
    defaultCategory: string;
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-2.5 text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

const accentColors = [
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "green", label: "Green", color: "bg-emerald-500" },
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
];

const themes = [
  { value: "system", label: "System", icon: "💻" },
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
];

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction] = useFormState<SettingsState | null, FormData>(
    updateSettings,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && (
        <Alert variant={state.success ? "success" : "error"}>
          {state.message}
        </Alert>
      )}

      {/* Profile Settings */}
      <Card className="overflow-hidden border-0 shadow-xl shadow-purple-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="h-1 gradient-bg" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              👤
            </span>
            Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="name"
            label="Display Name"
            placeholder="Enter your name"
            defaultValue={settings.userName || ""}
          />
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="overflow-hidden border-0 shadow-xl shadow-purple-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="h-1 gradient-bg" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              🎨
            </span>
            Appearance
          </CardTitle>
          <CardDescription>Customize how FormFlow looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <label
                  key={theme.value}
                  className="relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-purple-300 dark:hover:border-purple-700 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    defaultChecked={settings.theme === theme.value}
                    className="sr-only"
                  />
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="text-sm font-medium">{theme.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Accent Color</label>
            <div className="flex gap-3">
              {accentColors.map((color) => (
                <label
                  key={color.value}
                  className="relative cursor-pointer"
                  title={color.label}
                >
                  <input
                    type="radio"
                    name="accentColor"
                    value={color.value}
                    defaultChecked={settings.accentColor === color.value}
                    className="sr-only peer"
                  />
                  <div className={`w-10 h-10 rounded-full ${color.color} shadow-lg transition-transform hover:scale-110 peer-checked:ring-4 peer-checked:ring-offset-2 peer-checked:ring-purple-300`} />
                </label>
              ))}
            </div>
          </div>

          {/* Compact View Toggle */}
          <label className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-colors">
            <div>
              <span className="font-medium">Compact View</span>
              <p className="text-sm text-muted-foreground">Show more entries with less spacing</p>
            </div>
            <input
              type="checkbox"
              name="compactView"
              defaultChecked={settings.compactView}
              className="w-5 h-5 rounded accent-purple-500"
            />
          </label>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="overflow-hidden border-0 shadow-xl shadow-purple-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="h-1 gradient-bg" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              🔔
            </span>
            Notifications
          </CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-colors">
            <div>
              <span className="font-medium">Email Notifications</span>
              <p className="text-sm text-muted-foreground">Receive updates about your account</p>
            </div>
            <input
              type="checkbox"
              name="emailNotifications"
              defaultChecked={settings.emailNotifications}
              className="w-5 h-5 rounded accent-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-colors">
            <div>
              <span className="font-medium">Weekly Digest</span>
              <p className="text-sm text-muted-foreground">Get a weekly summary of your entries</p>
            </div>
            <input
              type="checkbox"
              name="weeklyDigest"
              defaultChecked={settings.weeklyDigest}
              className="w-5 h-5 rounded accent-purple-500"
            />
          </label>
        </CardContent>
      </Card>

      {/* Form Preferences */}
      <Card className="overflow-hidden border-0 shadow-xl shadow-purple-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="h-1 gradient-bg" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              📋
            </span>
            Form Preferences
          </CardTitle>
          <CardDescription>Customize your form experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-colors">
            <div>
              <span className="font-medium">Show Suggestions</span>
              <p className="text-sm text-muted-foreground">Display smart suggestions on entries</p>
            </div>
            <input
              type="checkbox"
              name="showSuggestions"
              defaultChecked={settings.showSuggestions}
              className="w-5 h-5 rounded accent-purple-500"
            />
          </label>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Default Category
            </label>
            <select
              name="defaultCategory"
              defaultValue={settings.defaultCategory}
              className="w-full rounded-xl border-2 bg-white/50 dark:bg-gray-900/50 px-4 py-2.5 text-sm border-border hover:border-purple-300 dark:hover:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

