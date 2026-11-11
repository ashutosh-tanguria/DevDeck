"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloudSun, ArrowRight } from "lucide-react";
import { WeatherData } from "@/types/weather";
import { fetchWeatherData } from "@/services/weather.service";
import { getWeatherCondition } from "@/constants/weather";
import { storage } from "@/lib/storage";
import { ROUTES } from "@/constants/routes";

interface WeatherWidgetProps {
  defaultCity: string;
  defaultLat: number | null;
  defaultLon: number | null;
  units: "celsius" | "fahrenheit";
}

export default function WeatherWidget({
  defaultCity,
  defaultLat,
  defaultLon,
  units,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const lastLoc = storage.get<{ name: string; lat: number; lon: number; country?: string } | null>(
      "devdeck_weather_last",
      null
    );

    const lat = lastLoc?.lat ?? defaultLat ?? 51.5074;
    const lon = lastLoc?.lon ?? defaultLon ?? -0.1278;
    const name = lastLoc?.name ?? defaultCity ?? "London";

    fetchWeatherData(lat, lon, name, lastLoc?.country)
      .then((data) => {
        if (!ignore) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [defaultCity, defaultLat, defaultLon]);

  const formatTemp = (c: number) => {
    if (units === "fahrenheit") {
      return `${Math.round((c * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(c)}°C`;
  };

  const condition = weather
    ? getWeatherCondition(weather.current.weatherCode, weather.current.isDay)
    : null;
  const ConditionIcon = condition ? condition.icon : CloudSun;

  return (
    <Link
      href={ROUTES.WEATHER}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/25"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="size-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Weather
            </span>
          </div>
          <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        {loading ? (
          <div className="mt-4 space-y-2 animate-pulse">
            <div className="h-4 w-28 rounded bg-muted/50" />
            <div className="h-8 w-20 rounded bg-muted/50" />
            <div className="h-3 w-32 rounded bg-muted/40" />
          </div>
        ) : weather && condition ? (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground truncate">{weather.city}</p>
                <p className="font-mono text-3xl font-black text-foreground mt-1">
                  {formatTemp(weather.current.temperature)}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <ConditionIcon className="size-8 text-primary" />
                <span className="mt-1 text-[11px] text-muted-foreground">{condition.label}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/50 pt-3 text-xs text-muted-foreground">
              <span>Humidity: {weather.current.humidity}%</span>
              <span>Wind: {Math.round(weather.current.windSpeed)} km/h</span>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">Weather forecast</p>
            <p className="mt-1 text-xs text-muted-foreground">Click to inspect weather conditions.</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-2 text-right">
        <span className="text-[11px] font-medium text-primary group-hover:underline">
          View Forecast →
        </span>
      </div>
    </Link>
  );
}
