"use client";

import { getSuggestions } from "@/lib/suggestions";

interface SuggestionsPanelProps {
  entry: {
    title: string;
    description: string;
    category: string;
  };
}

const suggestionEmojis = ["💡", "🎯", "⚡", "🔥", "✨"];
const gradientColors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-500",
];

export function SuggestionsPanel({ entry }: SuggestionsPanelProps) {
  const suggestions = getSuggestions(entry);

  return (
    <div className="rounded-2xl border-0 bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-blue-50/80 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 p-6 shadow-xl shadow-purple-500/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/30 pulse-glow">
          <span className="text-2xl">🧠</span>
        </div>
        <div>
          <h3 className="font-black text-lg gradient-text">Smart Suggestions</h3>
          <p className="text-sm text-muted-foreground">AI-powered tips just for you! ✨</p>
        </div>
      </div>
      <ul className="space-y-3 stagger-children">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="group flex items-start gap-3 p-4 rounded-xl bg-white/70 dark:bg-gray-800/50 border border-white/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800/70 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
          >
            <span className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${gradientColors[index % gradientColors.length]} text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              {suggestionEmojis[index % suggestionEmojis.length]}
            </span>
            <span className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">{suggestion}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          Pro tip: Apply these suggestions to level up! 🚀
        </span>
      </div>
    </div>
  );
}
