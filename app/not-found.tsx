import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold tracking-tight text-primary">404</h1>
      <h2 className="mt-3 text-2xl font-semibold text-foreground">Page Not Found</h2>
      <p className="mt-2 text-sm text-muted-foreground">The page you requested does not exist or has been moved.</p>
      <Link href={ROUTES.DASHBOARD} className="mt-6">
        <Button>Return to Dashboard</Button>
      </Link>
    </main>
  );
}
