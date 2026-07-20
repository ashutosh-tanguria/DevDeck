import Card from "@/components/ui/Card";
import { FolderGit2, Clock3, CloudSun, FolderKanban } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome Back!</h1>

        <p className="text-zinc-400 mt-2">Your developer dashboard.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card title="GitHub">
          <FolderGit2 className="mb-3 text-blue-400" size={30} />

          <p className="text-zinc-400">View GitHub profile statistics.</p>
        </Card>

        <Card title="Weather">
          <CloudSun className="mb-3 text-yellow-400" size={30} />

          <p className="text-zinc-400">Weather widget coming soon.</p>
        </Card>

        <Card title="Pomodoro">
          <Clock3 className="mb-3 text-green-400" size={30} />

          <p className="text-zinc-400">Stay productive.</p>
        </Card>

        <Card title="Projects">
          <FolderKanban className="mb-3 text-purple-400" size={30} />

          <p className="text-zinc-400">Track your projects.</p>
        </Card>
      </div>
    </div>
  );
}
