import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  LucideIcon,
} from "lucide-react";

export interface WeatherCondition {
  label: string;
  icon: LucideIcon;
}

export function getWeatherCondition(code: number, isDay: number = 1): WeatherCondition {
  const isNight = isDay === 0;

  switch (code) {
    case 0:
      return {
        label: "Clear sky",
        icon: isNight ? Moon : Sun,
      };
    case 1:
      return {
        label: "Mainly clear",
        icon: isNight ? CloudMoon : CloudSun,
      };
    case 2:
      return {
        label: "Partly cloudy",
        icon: isNight ? CloudMoon : CloudSun,
      };
    case 3:
      return {
        label: "Overcast",
        icon: Cloud,
      };
    case 45:
      return {
        label: "Fog",
        icon: CloudFog,
      };
    case 48:
      return {
        label: "Depositing rime fog",
        icon: CloudFog,
      };
    case 51:
      return {
        label: "Light drizzle",
        icon: CloudDrizzle,
      };
    case 53:
      return {
        label: "Moderate drizzle",
        icon: CloudDrizzle,
      };
    case 55:
      return {
        label: "Dense drizzle",
        icon: CloudDrizzle,
      };
    case 56:
    case 57:
      return {
        label: "Freezing drizzle",
        icon: CloudSnow,
      };
    case 61:
      return {
        label: "Slight rain",
        icon: CloudRain,
      };
    case 63:
      return {
        label: "Moderate rain",
        icon: CloudRain,
      };
    case 65:
      return {
        label: "Heavy rain",
        icon: CloudRain,
      };
    case 66:
    case 67:
      return {
        label: "Freezing rain",
        icon: CloudSnow,
      };
    case 71:
      return {
        label: "Slight snow fall",
        icon: CloudSnow,
      };
    case 73:
      return {
        label: "Moderate snow fall",
        icon: CloudSnow,
      };
    case 75:
    case 77:
      return {
        label: "Heavy snow fall",
        icon: CloudSnow,
      };
    case 80:
      return {
        label: "Slight rain showers",
        icon: CloudRain,
      };
    case 81:
      return {
        label: "Moderate rain showers",
        icon: CloudRain,
      };
    case 82:
      return {
        label: "Violent rain showers",
        icon: CloudRain,
      };
    case 85:
    case 86:
      return {
        label: "Snow showers",
        icon: CloudSnow,
      };
    case 95:
      return {
        label: "Thunderstorm",
        icon: CloudLightning,
      };
    case 96:
    case 99:
      return {
        label: "Thunderstorm with hail",
        icon: CloudLightning,
      };
    default:
      return {
        label: "Variable",
        icon: Cloud,
      };
  }
}
