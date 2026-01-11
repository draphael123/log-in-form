import { notFound } from "next/navigation";
import Link from "next/link";
import { getFormEntry } from "@/actions/form.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuggestionsPanel } from "@/components/suggestions-panel";
import { FormEntryForm } from "@/components/form-entry-form";
import { DeleteEntryButton } from "@/components/delete-entry-button";

interface EntryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function EntryPage({ params, searchParams }: EntryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const entry = await getFormEntry(resolvedParams.id);

  if (!entry) {
    notFound();
  }

  const isEditing = resolvedSearchParams.edit === "true";

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{entry.title}</span>
      </nav>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <FormEntryForm
              mode="edit"
              entryId={entry.id}
              defaultValues={{
                title: entry.title,
                description: entry.description,
                category: entry.category,
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Entry details */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <CardTitle className="text-xl">{entry.title}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                    {entry.category}
                  </span>
                  <span>Created {formatDate(entry.createdAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{entry.description}</p>
              </div>

              {entry.updatedAt > entry.createdAt && (
                <p className="text-xs text-muted-foreground">
                  Last updated {formatDate(entry.updatedAt)}
                </p>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Link
                  href={`/dashboard/${entry.id}?edit=true`}
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  Edit
                </Link>
                <DeleteEntryButton entryId={entry.id} />
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <SuggestionsPanel entry={entry} />
        </>
      )}
    </div>
  );
}

