import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";

type Props = {
  number?: string;
  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  number,
  eyebrow,
  title,
  description,
  icon,
  action,
  children,
  className = "",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".section-card-content",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden rounded-[26px] border border-[#e2e7dc] bg-white text-[#19271e] shadow-[0_12px_38px_rgba(29,49,29,0.055)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a6c778]/70 to-transparent" />

      <div className="relative flex flex-col justify-between gap-4 border-b border-[#e9ede5] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6e8c4b]">
            {number ? `${number} · ` : ""}
            {eyebrow}
          </p>

          <h2 className="mt-2 flex items-center gap-2 text-base font-semibold tracking-tight text-[#203626]">
            {icon && (
              <span className="flex shrink-0 items-center justify-center text-[#638640]">
                {icon}
              </span>
            )}
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-2xl text-xs leading-5 text-[#778176]">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="section-card-content relative p-4 sm:p-5">
        {children}
      </div>
    </section>
  );
}