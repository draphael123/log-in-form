"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { register, AuthState } from "@/actions/auth.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="group w-full inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3.5 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Creating magic...
        </>
      ) : (
        <>
          Join the Party!
          <span className="ml-2 group-hover:scale-125 transition-transform">🎉</span>
        </>
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
    <div className="relative bounce-in">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-400/30 rounded-full blur-3xl blob" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-400/30 rounded-full blur-3xl blob" style={{ animationDelay: '-4s' }} />
      
      <Card className="relative overflow-hidden border-0 shadow-2xl shadow-purple-500/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="h-1.5 animated-gradient" />
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg shadow-xl shadow-purple-500/40 pulse-glow">
            <span className="text-4xl">🚀</span>
          </div>
          <CardTitle className="text-2xl gradient-text-animated">Join FormFlow!</CardTitle>
          <CardDescription className="text-base">Your productivity adventure starts here ✨</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form action={formAction} className="space-y-4">
            {state?.message && !state.success && (
              <div className="shake">
                <Alert variant="error">
                  <span className="mr-2">😅</span>{state.message}
                </Alert>
              </div>
            )}

            {state?.success && (
              <Alert variant="success">
                <span className="mr-2">🎉</span>{state.message}
              </Alert>
            )}

            <Input
              name="name"
              type="text"
              label="Name (optional)"
              placeholder="What should we call you? 👀"
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
              placeholder="Make it strong! 💪"
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
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold transition-colors hover:underline"
            >
              Sign in! 👋
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
