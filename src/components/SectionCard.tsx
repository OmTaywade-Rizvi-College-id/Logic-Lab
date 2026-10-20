import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  number?: string;
  eyebrow?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function SectionCard({
  title,
  description,
  children,
  className = "",
  number,
  eyebrow,
  icon,
  action,
}: SectionCardProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white ${className}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex items-start gap-3">
          {number && (
            <span className="text-xs font-semibold text-emerald-700">
              {number}
            </span>
          )}
          {icon}
          <div>
            {eyebrow && (
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {eyebrow}
              </p>
            )}
            <h2 className="text-sm font-semibold text-slate-800">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}