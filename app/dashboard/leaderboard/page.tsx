import Link from "next/link";
import { getLeaderboard } from "@/actions/profile.actions";
import { Card, CardContent } from "@/components/ui/card";

export default async function LeaderboardPage() {
  const users = await getLeaderboard(25);

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "?";
  };

  const getMedal = (index: number) => {
    switch (index) {
      case 0: return { emoji: "🥇", color: "from-yellow-400 to-amber-500" };
      case 1: return { emoji: "🥈", color: "from-gray-300 to-gray-400" };
      case 2: return { emoji: "🥉", color: "from-amber-600 to-orange-700" };
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h1 className="text-3xl font-black gradient-text-animated">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top contributors in the community 🌟
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 stagger-children">
        {users.slice(0, 3).map((user, index) => {
          const medal = getMedal(index);
          const order = index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3";
          const height = index === 0 ? "h-40" : index === 1 ? "h-32" : "h-28";
          
          return (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className={`${order} group`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform ${index === 0 ? "w-20 h-20 text-2xl" : ""}`}>
                  {getInitials(user.name, user.email)}
                </div>
                <p className="font-bold mt-2 truncate">
                  {user.name || user.email.split("@")[0]}
                </p>
                <div className={`mt-2 rounded-t-xl bg-gradient-to-t ${medal?.color} ${height} flex items-start justify-center pt-4`}>
                  <div className="text-center text-white">
                    <span className="text-3xl">{medal?.emoji}</span>
                    <p className="text-2xl font-black">{user.reputation}</p>
                    <p className="text-xs opacity-80">points</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-3 stagger-children">
        {users.slice(3).map((user, index) => (
          <Link key={user.id} href={`/profile/${user.id}`}>
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm transition-all hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                    {index + 4}
                  </div>
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                    {getInitials(user.name, user.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate group-hover:gradient-text transition-all">
                      {user.name || user.email.split("@")[0]}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>📝 {user._count.formEntries} posts</span>
                      <span>💬 {user._count.comments} comments</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black gradient-text">{user.reputation}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                  {user.userBadges.length > 0 && (
                    <div className="flex -space-x-1">
                      {user.userBadges.slice(0, 3).map((ub) => (
                        <span
                          key={ub.id}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm"
                          title={ub.badge.name}
                        >
                          {ub.badge.icon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

