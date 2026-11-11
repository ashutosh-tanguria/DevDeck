import { GeoCity, WeatherData, HourlyPoint, DailyPoint } from "@/types/weather";

interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }>;
}

interface OpenMeteoForecastResponse {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
  };
}

export async function searchCities(query: string): Promise<GeoCity[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=5&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to search locations");
  }

  const data = (await res.json()) as GeocodingResponse;
  return data.results ?? [];
}

export async function fetchWeatherData(
  lat: number,
  lon: number,
  cityName: string,
  country?: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Unable to retrieve weather forecast");
  }

  const data = (await res.json()) as OpenMeteoForecastResponse;

  // Extract next 12 hours from current time
  const currentTime = data.current.time;
  const currentHourPrefix = currentTime.slice(0, 13); // "YYYY-MM-DDTHH"
  let startIndex = data.hourly.time.findIndex((t) => t.startsWith(currentHourPrefix));
  if (startIndex === -1) startIndex = 0;

  const next12Hours: HourlyPoint[] = [];
  for (let i = startIndex; i < startIndex + 12 && i < data.hourly.time.length; i++) {
    next12Hours.push({
      time: data.hourly.time[i],
      temperature: data.hourly.temperature_2m[i],
      weatherCode: data.hourly.weather_code[i],
      isDay: data.hourly.is_day[i],
    });
  }

  // Extract 5 days
  const fiveDayForecast: DailyPoint[] = [];
  const dayCount = Math.min(5, data.daily.time.length);
  for (let i = 0; i < dayCount; i++) {
    fiveDayForecast.push({
      date: data.daily.time[i],
      weatherCode: data.daily.weather_code[i],
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      precipitationProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
    });
  }

  return {
    city: cityName,
    country,
    latitude: lat,
    longitude: lon,
    timezone: data.timezone,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      isDay: data.current.is_day,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
    },
    next12Hours,
    fiveDayForecast,
  };
}
