import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather",
  description: "Live weather conditions, 12-hour hourly trends and 5-day forecasts via Open-Meteo.",
};

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
