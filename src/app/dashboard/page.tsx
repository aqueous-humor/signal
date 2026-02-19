import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/auth/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();

  // 1. Guard the route: If no session, kick to login
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* 2. Sign Out Form using our Server Action */}
        <form action={signOutUser}>
          <Button variant="outline" type="submit" className="cursor-pointer">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{session.user.email}</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              Role:{" "}
              <span className="font-semibold text-primary">
                {session.user.role}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Active Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Note: In Commit 7/8, we'll fetch the Workspace Name via Prisma */}
            <p className="text-2xl font-bold italic text-muted-foreground">
              Workspace Loaded
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ID: {session.user.workspaceId.slice(0, 8)}... (Verified)
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
