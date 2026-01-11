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

export function FormEntryCard({ entry }: FormEntryCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Link href={`/dashboard/${entry.id}`}>
      <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {entry.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {entry.description}
              </p>
            </div>
            <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
              {entry.category}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Created {formatDate(entry.createdAt)}</span>
            {entry.updatedAt > entry.createdAt && (
              <span>• Updated {formatDate(entry.updatedAt)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

