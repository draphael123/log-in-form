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

const categoryColors: Record<string, string> = {
  productivity: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30",
  health: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30",
  admin: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/30",
  "customer support": "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/30",
  engineering: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30",
  general: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/30",
};

export function FormEntryCard({ entry }: FormEntryCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const categoryClass = categoryColors[entry.category.toLowerCase()] || categoryColors.general;

  return (
    <Link href={`/dashboard/${entry.id}`}>
      <Card className="group hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 cursor-pointer overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {entry.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {entry.description}
              </p>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${categoryClass}`}>
              {entry.category}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Created {formatDate(entry.createdAt)}
            </span>
            {entry.updatedAt > entry.createdAt && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                </svg>
                Updated {formatDate(entry.updatedAt)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
