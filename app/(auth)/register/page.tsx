"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { register, AuthState } from "@/actions/auth.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Creating account...
        </>
      ) : (
        "Create Account"
      )}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState<AuthState | null, FormData>(
    register,
    null
  );

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl" />
      
      <Card className="relative overflow-hidden border-0 shadow-2xl shadow-purple-500/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-bg shadow-lg shadow-purple-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
          </div>
          <CardTitle className="text-2xl gradient-text">Create an account</CardTitle>
          <CardDescription>Get started with FormFlow today</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form action={formAction} className="space-y-4">
            {state?.message && !state.success && (
              <Alert variant="error">{state.message}</Alert>
            )}

            {state?.success && (
              <Alert variant="success">{state.message}</Alert>
            )}

            <Input
              name="name"
              type="text"
              label="Name (optional)"
              placeholder="Your name"
              autoComplete="name"
              error={state?.errors?.name?.[0]}
            />

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              error={state?.errors?.email?.[0]}
              required
            />

            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              error={state?.errors?.password?.[0]}
              required
            />

            <SubmitButton />
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
