import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        {/* Logo / Brand */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl animated-gradient shadow-lg shadow-purple-500/25 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <line x1="10" x2="8" y1="9" y2="9" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight gradient-text">
            FormFlow
          </h1>
          <p className="text-muted-foreground text-lg">
            A simple way to manage your entries with{" "}
            <span className="text-purple-500 font-medium">smart suggestions</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-8 py-3.5 text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-foreground px-8 py-3.5 text-sm font-semibold hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
          >
            Create Account
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-700/30 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Secure Auth</h3>
            <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-1">
              Password hashing & protected routes
            </p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-purple-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-100">CRUD Forms</h3>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-1">
              Create, view, edit & delete entries
            </p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 border border-pink-200/50 dark:border-pink-700/30 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-pink-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/>
              </svg>
            </div>
            <h3 className="font-semibold text-sm text-pink-900 dark:text-pink-100">Smart Tips</h3>
            <p className="text-xs text-pink-700/70 dark:text-pink-300/70 mt-1">
              Get relevant suggestions automatically
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground pt-8">
          Built with Next.js, Tailwind CSS & Prisma
        </p>
      </div>
    </div>
  );
}
