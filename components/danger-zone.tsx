"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/actions/settings.actions";
import { logout } from "@/actions/auth.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DangerZone() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirmText !== "DELETE") return;

    startTransition(async () => {
      await deleteAccount();
      await logout();
      router.push("/");
    });
  };

  return (
    <Card className="overflow-hidden border-2 border-red-200 dark:border-red-900/50 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            ⚠️
          </span>
          Danger Zone
        </CardTitle>
        <CardDescription>Irreversible actions that affect your account</CardDescription>
      </CardHeader>
      <CardContent>
        {!showConfirm ? (
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
            <div>
              <span className="font-medium text-red-700 dark:text-red-300">Delete Account</span>
              <p className="text-sm text-red-600/70 dark:text-red-400/70">
                Permanently delete your account and all your data
              </p>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] transition-all duration-300"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-300">Are you absolutely sure?</h4>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                  This action cannot be undone. This will permanently delete your account, all your entries, and remove all your data from our servers.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                Type <span className="font-bold">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-xl border-2 border-red-300 dark:border-red-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText("");
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isPending}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Deleting..." : "Yes, Delete My Account"}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

