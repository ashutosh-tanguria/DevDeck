import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({
  title,
  children,
}: CardProps) {
  return (
    <div className="
rounded-2xl
border
border-zinc-800
bg-zinc-900
p-6
shadow-lg
transition-all
duration-300 
hover:-translate-y-2 
hover:border-blue-500 
hover:shadow-blue-500/20 
">

      <h2 className="mb-5 text-xl font-semibold text-blue-400">
        {title}
      </h2>

      {children}

    </div>
  );
}