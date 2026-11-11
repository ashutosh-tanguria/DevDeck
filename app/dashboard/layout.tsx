import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Developer workspace overview and live telemetry.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
