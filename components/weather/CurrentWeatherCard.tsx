import { WeatherData } from "@/types/weather";
import { getWeatherCondition } from "@/constants/weather";
import { Wind, Droplets, Thermometer, Umbrella } from "lucide-react";

interface CurrentWeatherCardProps {
  weather: WeatherData;
  units: "celsius" | "fahrenheit";
}

function formatTemp(celsius: number, units: "celsius" | "fahrenheit"): string {
  if (units === "fahrenheit") {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export default function CurrentWeatherCard({ weather, units }: CurrentWeatherCardProps) {
  const current = weather.current;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const Icon = condition.icon;

  const todayForecast = weather.fiveDayForecast[0];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {weather.city}
            </h2>
            {weather.country && (
              <span className="text-sm text-muted-foreground">{weather.country}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Current conditions as of{" "}
            {new Date(current.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-5xl font-black tracking-tight text-foreground">
              {formatTemp(current.temperature, units)}
            </span>
            <div className="text-xs text-muted-foreground">
              <p>Feels like {formatTemp(current.apparentTemperature, units)}</p>
              {todayForecast && (
                <p className="font-mono">
                  H: {formatTemp(todayForecast.tempMax, units)} L:{" "}
                  {formatTemp(todayForecast.tempMin, units)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end">
          <div className="flex items-center gap-2.5">
            <Icon className="size-10 text-primary" />
            <span className="text-base font-medium text-foreground">{condition.label}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-4">
        <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 p-2.5">
          <Droplets className="size-4 text-muted-foreground" />
          <div>
            <p className="text-[11px] text-muted-foreground">Humidity</p>
            <p className="font-mono text-xs font-semibold text-foreground">{current.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 p-2.5">
          <Wind className="size-4 text-muted-foreground" />
          <div>
            <p className="text-[11px] text-muted-foreground">Wind</p>
            <p className="font-mono text-xs font-semibold text-foreground">
              {Math.round(current.windSpeed)} km/h
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 p-2.5">
          <Thermometer className="size-4 text-muted-foreground" />
          <div>
            <p className="text-[11px] text-muted-foreground">Apparent</p>
            <p className="font-mono text-xs font-semibold text-foreground">
              {formatTemp(current.apparentTemperature, units)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 p-2.5">
          <Umbrella className="size-4 text-muted-foreground" />
          <div>
            <p className="text-[11px] text-muted-foreground">Precipitation</p>
            <p className="font-mono text-xs font-semibold text-foreground">
              {current.precipitation} mm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
