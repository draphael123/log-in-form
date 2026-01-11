import { notFound } from "next/navigation";
import Link from "next/link";
import { getFormEntry, isEntryOwner } from "@/actions/form.actions";
import { getComments } from "@/actions/comment.actions";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuggestionsPanel } from "@/components/suggestions-panel";
import { FormEntryForm } from "@/components/form-entry-form";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { CommentsSection } from "@/components/comments-section";

interface EntryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function EntryPage({ params, searchParams }: EntryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const [entry, session, comments] = await Promise.all([
    getFormEntry(resolvedParams.id),
    auth(),
    getComments(resolvedParams.id),
  ]);
  const isOwner = await isEntryOwner(resolvedParams.id);

  if (!entry) {
    notFound();
  }

  const isEditing = resolvedSearchParams.edit === "true" && isOwner;

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

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "?";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground slide-up">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/feed" className="hover:text-foreground transition-colors">
          Feed
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{entry.title}</span>
      </nav>

      {isEditing ? (
        <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl bounce-in">
          <div className="h-1 animated-gradient" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>✏️</span> Edit Post
            </CardTitle>
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
          <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl bounce-in">
            <div className="h-1 animated-gradient" />
            <CardHeader>
              {/* Author info */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/30">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${isOwner ? 'gradient-bg' : 'bg-gray-400 dark:bg-gray-600'}`}>
                  {getInitials(entry.user.name, entry.user.email)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {entry.user.name || entry.user.email.split("@")[0]}
                    </span>
                    {isOwner && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl gradient-text">{entry.title}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                    {entry.category}
                  </span>
                  <span>📅 {formatDate(entry.createdAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <span>📝</span> Description
                </h4>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{entry.description}</p>
              </div>

              {entry.updatedAt > entry.createdAt && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span>✏️</span> Last updated {formatDate(entry.updatedAt)}
                </p>
              )}

              {/* Actions - only show edit/delete if owner */}
              {isOwner && (
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Link
                    href={`/dashboard/${entry.id}?edit=true`}
                    className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-4 py-2 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
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
              )}

              {!isOwner && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>👀</span> You&apos;re viewing someone else&apos;s post
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suggestions */}
          <SuggestionsPanel entry={entry} />

          {/* Comments */}
          <CommentsSection
            entryId={entry.id}
            comments={comments}
            currentUserId={session?.user?.id}
            postOwnerId={entry.userId}
          />
        </>
      )}
    </div>
  );
}
