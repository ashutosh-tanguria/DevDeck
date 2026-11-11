import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 text-card-foreground shadow-2xs ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-base font-semibold text-foreground">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
