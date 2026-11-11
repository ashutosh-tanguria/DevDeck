import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize preferences, theme, weather location and intervals.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
