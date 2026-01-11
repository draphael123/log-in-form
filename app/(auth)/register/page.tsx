"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, AuthState } from "@/actions/auth.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    register,
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
        </div>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Get started with FormFlow today</CardDescription>
      </CardHeader>
      <CardContent>
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

          <Button type="submit" className="w-full" isLoading={isPending}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

