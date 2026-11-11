import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro",
  description: "Drift-free focus countdown intervals with a 7-day productivity bar chart.",
};

export default function PomodoroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
