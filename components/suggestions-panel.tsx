"use client";

import { getSuggestions } from "@/lib/suggestions";

interface SuggestionsPanelProps {
  entry: {
    title: string;
    description: string;
    category: string;
  };
}

export function SuggestionsPanel({ entry }: SuggestionsPanelProps) {
  const suggestions = getSuggestions(entry);

  return (
    <div className="rounded-xl border border-border bg-accent/30 p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <h3 className="font-semibold text-foreground">Suggestions</h3>
      </div>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-muted-foreground"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

