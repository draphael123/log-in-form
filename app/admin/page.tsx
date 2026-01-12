import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "admin") {
    redirect("/dashboard");
  }

  // Get stats
  const [userCount, postCount, commentCount, reportCount] = await Promise.all([
    prisma.user.count(),
    prisma.formEntry.count(),
    prisma.comment.count(),
    prisma.report.count({ where: { status: "pending" } }),
  ]);

  const recentReports = await prisma.report.findMany({
    where: { status: "pending" },
    include: {
      user: { select: { name: true, email: true } },
      entry: { select: { id: true, title: true } },
    },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your community 🛡️</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl border-2 border-border hover:border-purple-400 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardContent className="p-6">
              <div className="text-4xl font-black text-blue-600">{userCount}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6">
              <div className="text-4xl font-black text-purple-600">{postCount}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="text-4xl font-black text-green-600">{commentCount}</div>
              <div className="text-sm text-muted-foreground">Total Comments</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
            <CardContent className="p-6">
              <div className="text-4xl font-black text-red-600">{reportCount}</div>
              <div className="text-sm text-muted-foreground">Pending Reports</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pending Reports */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🚩 Pending Reports
            </h2>
            {recentReports.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No pending reports! 🎉
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <Card key={report.id} className="border-0 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                            {report.reason}
                          </span>
                          <p className="text-sm mt-2">
                            {report.entry ? (
                              <Link href={`/dashboard/${report.entry.id}`} className="hover:underline">
                                Post: {report.entry.title}
                              </Link>
                            ) : (
                              "Comment"
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Reported by {report.user.name || report.user.email}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              👥 Recent Users
            </h2>
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <Card key={u.id} className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                        {(u.name || u.email)[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <Link href={`/profile/${u.id}`} className="font-bold hover:underline">
                          {u.name || u.email.split("@")[0]}
                        </Link>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        u.role === "admin" 
                          ? "bg-red-100 text-red-600" 
                          : u.role === "moderator"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

