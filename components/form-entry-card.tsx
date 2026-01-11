import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface FormEntryCardProps {
  entry: {
    id: string;
    title: string;
    description: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

const categoryConfig: Record<string, { gradient: string; emoji: string }> = {
  productivity: { gradient: "from-blue-500 to-cyan-500", emoji: "⚡" },
  health: { gradient: "from-emerald-500 to-teal-500", emoji: "💚" },
  admin: { gradient: "from-purple-500 to-violet-500", emoji: "📋" },
  "customer support": { gradient: "from-amber-500 to-orange-500", emoji: "💬" },
  engineering: { gradient: "from-red-500 to-rose-500", emoji: "⚙️" },
  general: { gradient: "from-gray-500 to-slate-500", emoji: "📌" },
};

export function FormEntryCard({ entry }: FormEntryCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const config = categoryConfig[entry.category.toLowerCase()] || categoryConfig.general;

  return (
    <Link href={`/dashboard/${entry.id}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] cursor-pointer">
        <div className={`h-1 bg-gradient-to-r ${config.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground truncate group-hover:gradient-text transition-all duration-300 flex items-center gap-2">
                {entry.title}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {entry.description}
              </p>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${config.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <span>{config.emoji}</span>
              {entry.category}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
              <span>📅</span>
              {formatDate(entry.createdAt)}
            </span>
            {entry.updatedAt > entry.createdAt && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
                <span>✏️</span>
                Updated {formatDate(entry.updatedAt)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
