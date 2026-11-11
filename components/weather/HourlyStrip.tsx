import { HourlyPoint } from "@/types/weather";
import { getWeatherCondition } from "@/constants/weather";

interface HourlyStripProps {
  hourly: HourlyPoint[];
  units: "celsius" | "fahrenheit";
}

function formatTemp(celsius: number, units: "celsius" | "fahrenheit"): string {
  if (units === "fahrenheit") {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export default function HourlyStrip({ hourly, units }: HourlyStripProps) {
  if (hourly.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Next 12 Hours</h3>
      <p className="text-xs text-muted-foreground mt-0.5">Hourly forecast</p>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {hourly.map((point, index) => {
          const condition = getWeatherCondition(point.weatherCode, point.isDay);
          const Icon = condition.icon;
          const timeLabel =
            index === 0
              ? "Now"
              : new Date(point.time).toLocaleTimeString([], {
                  hour: "numeric",
                  hour12: true,
                });

          return (
            <div
              key={point.time}
              className="flex min-w-[70px] flex-col items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-2 py-3 text-center"
            >
              <span className="text-[11px] font-medium text-muted-foreground">{timeLabel}</span>
              <Icon className="my-2 size-5 text-primary" />
              <span className="font-mono text-sm font-semibold text-foreground">
                {formatTemp(point.temperature, units)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
