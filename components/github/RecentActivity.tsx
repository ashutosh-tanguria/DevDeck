import { GithubEvent } from "@/types/github";
import { GitCommit, GitPullRequest, Star, GitFork, AlertCircle, Bookmark, Tag } from "lucide-react";

interface RecentActivityProps {
  events: GithubEvent[];
}

function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function getEventDetails(event: GithubEvent) {
  switch (event.type) {
    case "PushEvent": {
      const commitCount = event.payload.commits?.length ?? 1;
      return {
        label: `Pushed ${commitCount} commit${commitCount === 1 ? "" : "s"} to`,
        icon: GitCommit,
      };
    }
    case "WatchEvent":
      return {
        label: "Starred",
        icon: Star,
      };
    case "PullRequestEvent": {
      const action = event.payload.action ?? "updated";
      return {
        label: `${action.charAt(0).toUpperCase() + action.slice(1)} pull request in`,
        icon: GitPullRequest,
      };
    }
    case "IssuesEvent": {
      const action = event.payload.action ?? "updated";
      return {
        label: `${action.charAt(0).toUpperCase() + action.slice(1)} issue in`,
        icon: AlertCircle,
      };
    }
    case "ForkEvent":
      return {
        label: "Forked",
        icon: GitFork,
      };
    case "CreateEvent":
      return {
        label: `Created ${event.payload.ref_type ?? "branch"} in`,
        icon: Bookmark,
      };
    case "ReleaseEvent":
      return {
        label: "Published release in",
        icon: Tag,
      };
    default:
      return {
        label: "Activity in",
        icon: GitCommit,
      };
  }
}

export default function RecentActivity({ events }: RecentActivityProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <p className="mt-2 text-xs text-muted-foreground">No recent public activity recorded.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
      <p className="text-xs text-muted-foreground mt-0.5">Last 10 public events</p>

      <ul className="mt-4 divide-y divide-border" role="list">
        {events.map((event) => {
          const { label, icon: Icon } = getEventDetails(event);
          return (
            <li key={event.id} className="flex items-center justify-between py-2.5 text-xs">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground">
                  {label}{" "}
                  <a
                    href={`https://github.com/${event.repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-medium hover:underline hover:text-primary"
                  >
                    {event.repo.name}
                  </a>
                </span>
              </div>
              <span className="shrink-0 text-muted-foreground font-mono">
                {formatRelativeTime(event.created_at)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
