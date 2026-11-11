import { useMemo } from "react";
import { DaySessionCount } from "@/types/pomodoro";

interface PomodoroHistoryChartProps {
  dailyHistory: Record<string, number>;
}

export default function PomodoroHistoryChart({ dailyHistory }: PomodoroHistoryChartProps) {
  const { days, totalSessions, todayCount } = useMemo(() => {
    const list: DaySessionCount[] = [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    let total = 0;
    let today = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = dailyHistory[dateStr] ?? 0;
      const isToday = dateStr === todayStr;

      if (isToday) today = count;
      total += count;

      list.push({
        date: dateStr,
        dayName: d.toLocaleDateString([], { weekday: "short" }),
        count,
        isToday,
      });
    }

    return { days: list, totalSessions: total, todayCount: today };
  }, [dailyHistory]);

  const maxCount = useMemo(() => {
    const maxVal = Math.max(...days.map((d) => d.count));
    return Math.max(4, maxVal);
  }, [days]);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">7-Day Productivity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Completed focus sessions</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-xl font-bold text-foreground">{todayCount}</span>
          <span className="text-xs text-muted-foreground ml-1">today</span>
          <span className="text-xs text-muted-foreground block">
            ({totalSessions} this week)
          </span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="mt-6 flex h-36 items-end justify-between gap-2 pt-4 px-2">
        {days.map((day) => {
          const heightPercent = Math.max(8, Math.round((day.count / maxCount) * 100));

          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-2 h-full justify-end"
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                {day.count > 0 ? day.count : ""}
              </span>

              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[28px] rounded-t-sm transition-all ${
                  day.isToday
                    ? "bg-primary"
                    : day.count > 0
                    ? "bg-muted-foreground/60 hover:bg-muted-foreground"
                    : "bg-muted/40"
                }`}
                title={`${day.dayName} (${day.date}): ${day.count} sessions`}
              />

              <span
                className={`text-[11px] ${
                  day.isToday ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
