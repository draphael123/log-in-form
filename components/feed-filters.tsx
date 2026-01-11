"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const categoryConfig: Record<string, { gradient: string; emoji: string }> = {
  productivity: { gradient: "from-blue-500 to-cyan-500", emoji: "⚡" },
  health: { gradient: "from-emerald-500 to-teal-500", emoji: "💚" },
  admin: { gradient: "from-purple-500 to-violet-500", emoji: "📋" },
  "customer support": { gradient: "from-amber-500 to-orange-500", emoji: "💬" },
  engineering: { gradient: "from-red-500 to-rose-500", emoji: "⚙️" },
  general: { gradient: "from-gray-500 to-slate-500", emoji: "📌" },
};

const dateFilters = [
  { value: "all", label: "All Time", emoji: "🌐" },
  { value: "today", label: "Today", emoji: "📅" },
  { value: "week", label: "This Week", emoji: "📆" },
  { value: "month", label: "This Month", emoji: "🗓️" },
  { value: "year", label: "This Year", emoji: "📊" },
];

interface FeedFiltersProps {
  categories: string[];
  selectedCategory: string;
  selectedDate: string;
  searchQuery: string;
  totalEntries: number;
  filteredCount: number;
}

export function FeedFilters({
  categories,
  selectedCategory,
  selectedDate,
  searchQuery,
  totalEntries,
  filteredCount,
}: FeedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchQuery);

  const updateFilters = (category?: string, date?: string, searchTerm?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category !== undefined) {
      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
    }

    if (date !== undefined) {
      if (date === "all") {
        params.delete("date");
      } else {
        params.set("date", date);
      }
    }
    
    if (searchTerm !== undefined) {
      if (searchTerm === "") {
        params.delete("search");
      } else {
        params.set("search", searchTerm);
      }
    }

    startTransition(() => {
      router.push(`/dashboard/feed?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(undefined, undefined, search);
  };

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-border slide-up">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries by title, description, or author..."
            className="w-full pl-12 pr-24 py-3 rounded-xl border-2 border-border bg-white dark:bg-gray-900 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg gradient-bg text-white text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all disabled:opacity-50"
          >
            {isPending ? "..." : "Search"}
          </button>
        </div>
      </form>

      {/* Category filters */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Filter by category:</p>
        <div className="flex flex-wrap gap-2">
          {/* All button */}
          <button
            onClick={() => updateFilters("all", undefined, undefined)}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 ${
              selectedCategory === "all"
                ? "gradient-bg text-white shadow-lg shadow-purple-500/30"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span>🌐</span>
            All
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
              {totalEntries}
            </span>
          </button>

          {/* Category buttons */}
          {categories.map((category) => {
            const config = categoryConfig[category.toLowerCase()] || categoryConfig.general;
            const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
            
            return (
              <button
                key={category}
                onClick={() => updateFilters(category, undefined, undefined)}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 ${
                  isSelected
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{config.emoji}</span>
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date filters */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Filter by date:</p>
        <div className="flex flex-wrap gap-2">
          {dateFilters.map((filter) => {
            const isSelected = selectedDate === filter.value;
            
            return (
              <button
                key={filter.value}
                onClick={() => updateFilters(undefined, filter.value, undefined)}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 ${
                  isSelected
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{filter.emoji}</span>
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active filters indicator */}
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Filtering...
        </div>
      )}
    </div>
  );
}

