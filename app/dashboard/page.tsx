import Card from "@/components/Card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-zinc-400">
          Here's your developer dashboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <Card title="GitHub Stats">
          Coming Soon...
        </Card>

        <Card title="Weather">
          Coming Soon...
        </Card>

        <Card title="Pomodoro">
          25:00
        </Card>

        <Card title="Quick Links">
          <ul className="space-y-2">
            <li>GitHub</li>
            <li>LeetCode</li>
            <li>LinkedIn</li>
          </ul>
        </Card>

      </div>

    </div>
  );
}