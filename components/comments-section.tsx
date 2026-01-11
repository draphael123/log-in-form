"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createComment, deleteComment } from "@/actions/comment.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

const COMMENTS_PER_PAGE = 10;

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface CommentsSectionProps {
  entryId: string;
  comments: Comment[];
  currentUserId?: string;
  postOwnerId: string;
}

function CommentForm({ entryId }: { entryId: string }) {
  const [state, formAction] = useFormState(createComment, null);
  const [content, setContent] = useState("");

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
    if (!state?.errors) {
      setContent("");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <input type="hidden" name="entryId" value={entryId} />
      <Textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment... 💬"
        rows={3}
        className="resize-none border-2 focus:border-purple-500"
      />
      {state?.errors?.content && (
        <p className="text-sm text-red-500">{state.errors.content[0]}</p>
      )}
      {state?.message && !state.success && (
        <Alert variant="error">{state.message}</Alert>
      )}
      {state?.success && (
        <Alert variant="success">Comment added! 🎉</Alert>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim()}>
          <span className="mr-2">💬</span> Post Comment
        </Button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  currentUserId,
  postOwnerId,
}: {
  comment: Comment;
  currentUserId?: string;
  postOwnerId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = currentUserId === comment.user.id || currentUserId === postOwnerId;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    setIsDeleting(true);
    await deleteComment(comment.id);
    setIsDeleting(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
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

  const isOwner = currentUserId === comment.user.id;

  return (
    <div className="group flex gap-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${isOwner ? 'gradient-bg' : 'bg-gray-400 dark:bg-gray-600'}`}>
        {getInitials(comment.user.name, comment.user.email)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm">
            {comment.user.name || comment.user.email.split("@")[0]}
          </span>
          {isOwner && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              You
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            • {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
          title="Delete comment"
        >
          {isDeleting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export function CommentsSection({
  entryId,
  comments,
  currentUserId,
  postOwnerId,
}: CommentsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  const paginatedComments = comments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to comments section
    document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div 
      id="comments-section"
      className="rounded-2xl border-0 bg-gradient-to-br from-blue-50/80 via-purple-50/50 to-pink-50/80 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20 p-6 shadow-xl shadow-blue-500/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-2xl">💬</span>
        </div>
        <div>
          <h3 className="font-black text-lg gradient-text">Comments</h3>
          <p className="text-sm text-muted-foreground">
            {comments.length === 0
              ? "Be the first to comment! ✨"
              : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
          </p>
        </div>
      </div>

      {/* Comment form */}
      {currentUserId ? (
        <div className="mb-6">
          <CommentForm entryId={entryId} />
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            Please log in to comment 🔐
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length > 0 ? (
        <>
          <div className="space-y-3 stagger-children">
            {paginatedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                postOwnerId={postOwnerId}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {/* Previous button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - currentPage) <= 1;
                  
                  // Show ellipsis
                  const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={page} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                        currentPage === page
                          ? "gradient-bg text-white shadow-lg shadow-purple-500/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, comments.length)} of {comments.length} comments
            </p>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">🗨️</span>
          <p className="text-sm text-muted-foreground">
            No comments yet. Start the conversation!
          </p>
        </div>
      )}
    </div>
  );
}

