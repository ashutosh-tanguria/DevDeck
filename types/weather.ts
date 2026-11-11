export interface GeoCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number; // Celsius
  apparentTemperature: number;
  humidity: number;
  isDay: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number; // km/h
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: number;
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
}

export interface WeatherData {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  next12Hours: HourlyPoint[];
  fiveDayForecast: DailyPoint[];
}
