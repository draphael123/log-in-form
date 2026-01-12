import { notFound } from "next/navigation";
import Link from "next/link";
import { getProfile, getUserPosts } from "@/actions/profile.actions";
import { getFollowStatus, getFollowCounts } from "@/actions/follow.actions";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { FollowButton } from "@/components/follow-button";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  const [profile, posts, session] = await Promise.all([
    getProfile(resolvedParams.id),
    getUserPosts(resolvedParams.id),
    auth(),
  ]);

  if (!profile) {
    notFound();
  }

  const [followStatus, followCounts] = await Promise.all([
    getFollowStatus(resolvedParams.id),
    getFollowCounts(resolvedParams.id),
  ]);

  const isOwnProfile = session?.user?.id === profile.id;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "?";
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return { label: "Admin", color: "from-red-500 to-orange-500", icon: "👑" };
      case "moderator":
        return { label: "Mod", color: "from-blue-500 to-cyan-500", icon: "🛡️" };
      default:
        return null;
    }
  };

  const roleBadge = getRoleBadge(profile.role);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 dark:from-purple-900/10 dark:via-pink-900/5 dark:to-blue-900/10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl gradient-bg flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-purple-500/30">
              {getInitials(profile.name, profile.email)}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl font-black">
                  {profile.name || profile.email.split("@")[0]}
                </h1>
                {roleBadge && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${roleBadge.color} text-white`}>
                    {roleBadge.icon} {roleBadge.label}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{profile.email}</p>
              {profile.bio && (
                <p className="mt-2 text-foreground/80">{profile.bio}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                📅 Joined {formatDate(profile.createdAt)}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                <div className="text-center">
                  <div className="text-xl font-black gradient-text">{profile.reputation}</div>
                  <div className="text-xs text-muted-foreground">Reputation</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black">{profile._count.formEntries}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black">{profile._count.comments}</div>
                  <div className="text-xs text-muted-foreground">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black">{followCounts.followers}</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black">{followCounts.following}</div>
                  <div className="text-xs text-muted-foreground">Following</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-border text-foreground font-bold hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  ⚙️ Edit Profile
                </Link>
              ) : (
                <FollowButton 
                  targetUserId={profile.id} 
                  isFollowing={followStatus.following} 
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Badges */}
        {profile.userBadges.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              🏆 Badges <span className="text-sm text-muted-foreground font-normal">({profile.userBadges.length})</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.userBadges.map((ub) => (
                <div
                  key={ub.id}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${ub.badge.color} text-white font-bold shadow-lg hover:scale-105 transition-transform cursor-default`}
                  title={ub.badge.description}
                >
                  <span>{ub.badge.icon}</span>
                  {ub.badge.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            📝 Posts <span className="text-sm text-muted-foreground font-normal">({posts.length})</span>
          </h2>
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <span className="text-4xl mb-2 block">📝</span>
              <p className="text-muted-foreground">No posts yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/dashboard/${post.id}`}>
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm transition-all hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {post.isPinned && <span title="Pinned">📌</span>}
                            <h3 className="font-bold truncate group-hover:gradient-text transition-all">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>❤️ {post._count.likes}</span>
                            <span>💬 {post._count.comments}</span>
                            <span>👁️ {post.viewCount}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {post.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

