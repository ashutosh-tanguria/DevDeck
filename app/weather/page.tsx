"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GeoCity, WeatherData } from "@/types/weather";
import { searchCities, fetchWeatherData } from "@/services/weather.service";
import CurrentWeatherCard from "@/components/weather/CurrentWeatherCard";
import HourlyStrip from "@/components/weather/HourlyStrip";
import FiveDayForecast from "@/components/weather/FiveDayForecast";
import { storage } from "@/lib/storage";
import { useSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Search, MapPin, RefreshCw, Loader2 } from "lucide-react";

interface LastLocation {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

export default function WeatherPage() {
  const { settings, updateSettings } = useSettings();
  const [units, setUnits] = useState<"celsius" | "fahrenheit">(() => settings.weatherUnits);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  const activeLocationRef = useRef<LastLocation | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadWeatherForLocation = useCallback(
    async (lat: number, lon: number, cityName: string, country?: string) => {
      setLoading(true);
      setError(null);
      setGeoNotice(null);

      try {
        const data = await fetchWeatherData(lat, lon, cityName, country);
        setWeather(data);
        activeLocationRef.current = { name: cityName, lat, lon, country };
        storage.set("devdeck_weather_last", { name: cityName, lat, lon, country });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load weather data");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    let cancelled = false;
    const lastLoc = storage.get<LastLocation | null>("devdeck_weather_last", null);
    const lat = lastLoc?.lat ?? settings.defaultWeatherLat ?? 51.5074;
    const lon = lastLoc?.lon ?? settings.defaultWeatherLon ?? -0.1278;
    const cityName = lastLoc?.name ?? settings.defaultWeatherCity ?? "London";
    const country = lastLoc?.country ?? "United Kingdom";

    fetchWeatherData(lat, lon, cityName, country)
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
          setLoading(false);
          activeLocationRef.current = { name: cityName, lat, lon, country };
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load weather data");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    settings.defaultWeatherCity,
    settings.defaultWeatherLat,
    settings.defaultWeatherLon,
  ]);

  // Handle autocomplete search debounced
  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setIsSearchingCities(false);
      return;
    }

    setIsSearchingCities(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchCities(val);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingCities(false);
      }
    }, 300);
  };

  const handleSelectCity = (city: GeoCity) => {
    setSearchQuery("");
    setSuggestions([]);
    loadWeatherForLocation(city.latitude, city.longitude, city.name, city.country);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        loadWeatherForLocation(latitude, longitude, "Local Weather");
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setGeoNotice("Location permission denied. You can search for your city above.");
        } else {
          setGeoNotice("Unable to retrieve location coordinates.");
        }
      },
      { timeout: 8000 }
    );
  };

  const toggleUnits = () => {
    const nextUnits = units === "celsius" ? "fahrenheit" : "celsius";
    setUnits(nextUnits);
    updateSettings({ weatherUnits: nextUnits });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Weather</h1>
          <p className="text-xs text-muted-foreground">
            Forecasts and current conditions powered by Open-Meteo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleUnits}
            aria-label="Toggle temperature units"
            className="font-mono text-xs"
          >
            {units === "celsius" ? "Units: °C" : "Units: °F"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleUseMyLocation}
            aria-label="Use current location"
            className="gap-1.5 text-xs"
          >
            <MapPin className="size-3.5" />
            <span className="hidden sm:inline">Use my location</span>
          </Button>
        </div>
      </div>

      {/* Search Input & Suggestions */}
      <div className="relative">
        <label htmlFor="city-search-input" className="sr-only">
          Search city
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="city-search-input"
            value={searchQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search city (e.g. Tokyo, Berlin, San Francisco)..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-9 text-sm text-foreground outline-none transition focus:border-foreground/30 focus:ring-1 focus:ring-ring"
          />
          {isSearchingCities && (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul
            className="absolute top-full left-0 z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-lg"
            role="listbox"
          >
            {suggestions.map((item) => (
              <li key={`${item.id}-${item.latitude}-${item.longitude}`}>
                <button
                  type="button"
                  onClick={() => handleSelectCity(item)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {[item.admin1, item.country].filter(Boolean).join(", ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Geolocation notice */}
      {geoNotice && (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          {geoNotice}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading weather">
          <div className="h-48 rounded-xl border border-border bg-muted/30" />
          <div className="h-32 rounded-xl border border-border bg-muted/30" />
          <div className="h-56 rounded-xl border border-border bg-muted/30" />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Unable to fetch forecast</p>
              <p className="mt-1 text-xs opacity-90">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (activeLocationRef.current) {
                  const loc = activeLocationRef.current;
                  loadWeatherForLocation(loc.lat, loc.lon, loc.name, loc.country);
                }
              }}
              className="gap-1.5 text-xs border-destructive/30"
            >
              <RefreshCw className="size-3" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      )}

      {/* Weather Content */}
      {!loading && !error && weather && (
        <div className="space-y-6">
          <CurrentWeatherCard weather={weather} units={units} />
          <HourlyStrip hourly={weather.next12Hours} units={units} />
          <FiveDayForecast forecast={weather.fiveDayForecast} units={units} />
        </div>
      )}
    </div>
  );
}
