export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  GITHUB: "/github",
  WEATHER: "/weather",
  POMODORO: "/pomodoro",
  PROJECTS: "/projects",
  SETTINGS: "/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
