import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo / Brand */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <line x1="10" x2="8" y1="9" y2="9" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            FormFlow
          </h1>
          <p className="text-muted-foreground">
            A simple way to manage your entries with smart suggestions
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
          <div className="p-4 rounded-lg bg-accent/50">
            <div className="text-primary text-lg mb-1">✓</div>
            <h3 className="font-medium text-sm">Secure Auth</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Password hashing & protected routes
            </p>
          </div>
          <div className="p-4 rounded-lg bg-accent/50">
            <div className="text-primary text-lg mb-1">✓</div>
            <h3 className="font-medium text-sm">CRUD Forms</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Create, view, edit & delete entries
            </p>
          </div>
          <div className="p-4 rounded-lg bg-accent/50">
            <div className="text-primary text-lg mb-1">✓</div>
            <h3 className="font-medium text-sm">Smart Tips</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Get relevant suggestions automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

