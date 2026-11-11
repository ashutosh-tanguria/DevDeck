import { DailyPoint } from "@/types/weather";
import { getWeatherCondition } from "@/constants/weather";

interface FiveDayForecastProps {
  forecast: DailyPoint[];
  units: "celsius" | "fahrenheit";
}

function formatTemp(celsius: number, units: "celsius" | "fahrenheit"): string {
  if (units === "fahrenheit") {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°`;
  }
  return `${Math.round(celsius)}°`;
}

function formatDayName(dateString: string, index: number): string {
  if (index === 0) return "Today";
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export default function FiveDayForecast({ forecast, units }: FiveDayForecastProps) {
  if (forecast.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">5-Day Forecast</h3>
      <p className="text-xs text-muted-foreground mt-0.5">Extended outlook</p>

      <div className="mt-4 divide-y divide-border/60">
        {forecast.map((day, index) => {
          const condition = getWeatherCondition(day.weatherCode, 1);
          const Icon = condition.icon;

          return (
            <div
              key={day.date}
              className="flex items-center justify-between py-3 text-xs sm:text-sm"
            >
              <div className="w-28 font-medium text-foreground">
                {formatDayName(day.date, index)}
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                <Icon className="size-4 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{condition.label}</span>
              </div>

              {day.precipitationProbability > 0 ? (
                <span className="w-12 text-center font-mono text-[11px] text-primary">
                  {day.precipitationProbability}%
                </span>
              ) : (
                <span className="w-12" />
              )}

              <div className="flex w-24 items-center justify-end gap-2 font-mono text-xs">
                <span className="text-muted-foreground">{formatTemp(day.tempMin, units)}</span>
                <span className="text-foreground font-semibold">{formatTemp(day.tempMax, units)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
