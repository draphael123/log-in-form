"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { login, AuthState } from "@/actions/auth.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" isLoading={pending}>
      Sign In
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState<AuthState | null, FormData>(
    login,
    null
  );

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" x2="3" y1="12" y2="12" />
          </svg>
        </div>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.message && !state.success && (
            <Alert variant="error">{state.message}</Alert>
          )}

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
            placeholder="••••••••"
            autoComplete="current-password"
            error={state?.errors?.password?.[0]}
            required
          />

          <SubmitButton />
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Create one
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

