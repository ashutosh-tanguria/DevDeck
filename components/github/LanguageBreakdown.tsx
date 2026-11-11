import { useMemo } from "react";
import { GithubRepo } from "@/types/github";

interface LanguageBreakdownProps {
  repos: GithubRepo[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
  Dart: "#00B4AB",
};

export default function LanguageBreakdown({ repos }: LanguageBreakdownProps) {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalWithLanguage = 0;

    for (const repo of repos) {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
        totalWithLanguage++;
      }
    }

    if (totalWithLanguage === 0) return [];

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 5);
    const rest = sorted.slice(5);

    const result = top.map(([lang, count]) => ({
      name: lang,
      count,
      percentage: Math.round((count / totalWithLanguage) * 1000) / 10,
      color: LANGUAGE_COLORS[lang] || "#888888",
    }));

    if (rest.length > 0) {
      const restCount = rest.reduce((sum, item) => sum + item[1], 0);
      result.push({
        name: "Other",
        count: restCount,
        percentage: Math.round((restCount / totalWithLanguage) * 1000) / 10,
        color: "#6b7280",
      });
    }

    return result;
  }, [repos]);

  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Languages</h3>
      <p className="text-xs text-muted-foreground mt-0.5">Based on public repositories</p>

      {/* Stacked bar */}
      <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {stats.map((item) => (
          <div
            key={item.name}
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
            title={`${item.name}: ${item.percentage}% (${item.count} repos)`}
            className="transition-all"
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium text-foreground">{item.name}</span>
            <span className="text-muted-foreground font-mono">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
