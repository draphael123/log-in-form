"use client";

import { getSuggestions } from "@/lib/suggestions";

interface SuggestionsPanelProps {
  entry: {
    title: string;
    description: string;
    category: string;
  };
}

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
    <div className="rounded-2xl border border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-blue-50/80 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <h3 className="font-bold text-lg gradient-text">Smart Suggestions</h3>
      </div>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/60 transition-colors"
          >
            <span className={`flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br ${gradientColors[index % gradientColors.length]} text-white text-xs flex items-center justify-center font-bold shadow-lg`}>
              {index + 1}
            </span>
            <span className="text-sm text-foreground/80 leading-relaxed">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
