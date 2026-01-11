"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { submitFeedback, FeedbackState } from "@/actions/feedback.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { useConfetti, SuccessAnimation } from "@/components/confetti";

const feedbackTypes = [
  { value: "praise", label: "Praise", emoji: "🎉", color: "from-emerald-500 to-teal-500" },
  { value: "feature", label: "Feature Request", emoji: "💡", color: "from-amber-500 to-orange-500" },
  { value: "bug", label: "Bug Report", emoji: "🐛", color: "from-red-500 to-rose-500" },
  { value: "general", label: "General", emoji: "💬", color: "from-blue-500 to-cyan-500" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3.5 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Sending...
        </>
      ) : (
        <>
          Send Feedback
          <span className="ml-2">🚀</span>
        </>
      )}
    </button>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-3xl transition-transform hover:scale-125 focus:outline-none"
        >
          {star <= (hover || value) ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const { fireEmoji } = useConfetti();
  const [selectedType, setSelectedType] = useState("general");
  const [rating, setRating] = useState(0);
  const [state, formAction] = useFormState<FeedbackState | null, FormData>(
    submitFeedback,
    null
  );

  if (state?.success) {
    fireEmoji();
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bounce-in">
          <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-center rainbow-border">
            <CardContent className="py-12">
              <SuccessAnimation />
              <h2 className="text-2xl font-black gradient-text-animated mt-6 mb-2">
                Thank You! 🎉
              </h2>
              <p className="text-muted-foreground mb-6">
                Your feedback means the world to us!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
                >
                  <span className="mr-2">🏠</span> Go Home
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-purple-200 dark:border-purple-800 text-foreground px-6 py-3 text-sm font-bold hover:border-purple-400 hover:scale-105 transition-all duration-300"
                >
                  <span className="mr-2">📝</span> Send More
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl blob" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl blob" style={{ animationDelay: '-4s' }} />

      <div className="max-w-lg w-full relative z-10 bounce-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg shadow-xl shadow-purple-500/40 pulse-glow mb-4">
            <span className="text-4xl">💬</span>
          </div>
          <h1 className="text-3xl font-black gradient-text-animated mb-2">
            We&apos;d Love Your Feedback!
          </h1>
          <p className="text-muted-foreground">
            Help us make this better for everyone ✨
          </p>
        </div>

        <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <div className="h-1.5 animated-gradient" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📝</span> Share Your Thoughts
            </CardTitle>
            <CardDescription>
              Bug, feature idea, or just want to say hi? We&apos;re all ears! 👂
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              {state?.message && !state.success && (
                <div className="shake">
                  <Alert variant="error">
                    <span className="mr-2">😅</span>{state.message}
                  </Alert>
                </div>
              )}

              {/* Feedback Type Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  What type of feedback? 🤔
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                        selectedType === type.value
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-border hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={selectedType === type.value}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="sr-only"
                      />
                      <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center text-white shadow-lg`}>
                        {type.emoji}
                      </span>
                      <span className="font-medium text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  How&apos;s your experience? (optional)
                </label>
                <StarRating value={rating} onChange={setRating} />
                <input type="hidden" name="rating" value={rating || ""} />
              </div>

              <Input
                name="name"
                type="text"
                label="Your Name (optional)"
                placeholder="What should we call you? 👋"
              />

              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                error={state?.errors?.email?.[0]}
                required
              />

              <Textarea
                name="message"
                label="Your Message"
                placeholder="Tell us what's on your mind... 💭"
                error={state?.errors?.message?.[0]}
                rows={4}
                required
              />

              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

