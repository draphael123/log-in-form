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
      {/* Animated background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl blob" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl blob" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl blob" style={{ animationDelay: '-4s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-cyan-400/25 rounded-full blur-3xl float" />

      <div className="max-w-lg w-full text-center space-y-8 relative z-10">
        {/* Logo / Brand */}
        <div className="space-y-4 bounce-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl animated-gradient shadow-2xl shadow-purple-500/40 mb-4 pulse-glow">
            <span className="text-5xl">📋</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight gradient-text-animated">
            FormFlow
          </h1>
          <p className="text-xl text-muted-foreground">
            A <span className="text-purple-500 font-bold">fun</span> way to manage your entries with{" "}
            <span className="text-pink-500 font-bold sparkle">smart suggestions</span> ✨
          </p>
        </div>

        {/* Fun tagline */}
        <div className="flex items-center justify-center gap-2 text-2xl slide-up" style={{ animationDelay: '0.3s' }}>
          <span className="emoji-bounce cursor-default">🚀</span>
          <span className="emoji-bounce cursor-default" style={{ animationDelay: '0.1s' }}>💡</span>
          <span className="emoji-bounce cursor-default" style={{ animationDelay: '0.2s' }}>🎯</span>
          <span className="emoji-bounce cursor-default" style={{ animationDelay: '0.3s' }}>⚡</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center rounded-2xl gradient-bg text-white px-8 py-4 text-lg font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-110 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Let&apos;s Go! 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center justify-center rounded-2xl border-2 border-purple-300 dark:border-purple-700 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-foreground px-8 py-4 text-lg font-bold hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Create Account
              <span className="text-xl group-hover:rotate-12 transition-transform">🎉</span>
            </span>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 stagger-children">
          <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200/50 dark:border-blue-700/30 hover-lift cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100">Secure Auth</h3>
            <p className="text-sm text-blue-700/70 dark:text-blue-300/70 mt-1">
              Fort Knox level security! 🏰
            </p>
          </div>
          <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200/50 dark:border-purple-700/30 hover-lift cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-purple-500/40 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-bold text-purple-900 dark:text-purple-100">Easy Forms</h3>
            <p className="text-sm text-purple-700/70 dark:text-purple-300/70 mt-1">
              Create, edit, done! ✅
            </p>
          </div>
          <div className="group p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200/50 dark:border-amber-700/30 hover-lift cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-amber-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-bold text-amber-900 dark:text-amber-100">Smart Tips</h3>
            <p className="text-sm text-amber-700/70 dark:text-amber-300/70 mt-1">
              AI-powered magic! 🪄
            </p>
          </div>
        </div>

        {/* Feedback link */}
        <div className="pt-6 slide-up" style={{ animationDelay: '0.7s' }}>
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-500 transition-colors group"
          >
            <span className="group-hover:scale-125 transition-transform">💬</span>
            Got feedback? We&apos;d love to hear from you!
          </Link>
        </div>

        {/* Fun footer */}
        <div className="pt-4 slide-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-sm text-muted-foreground">
            Made with <span className="text-red-500 animate-pulse">❤️</span> using Next.js, Tailwind & Prisma
          </p>
          <div className="flex justify-center gap-2 mt-2 text-lg">
            <span className="hover:scale-125 transition-transform cursor-default">⚡</span>
            <span className="hover:scale-125 transition-transform cursor-default">🎨</span>
            <span className="hover:scale-125 transition-transform cursor-default">🔥</span>
            <span className="hover:scale-125 transition-transform cursor-default">💜</span>
          </div>
        </div>
      </div>
    </div>
  );
}
