import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    const arrow = arrowRef.current;
    const glow = glowRef.current;
    if (!card || !icon || !arrow || !glow) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" },
      );
      gsap.set(glow, { opacity: 0 });
    }, card);

    const handleEnter = () => {
      gsap.to(card, { y: -5, borderColor: "#c4d5b5", duration: 0.25, ease: "power2.out" });
      gsap.to(icon, { rotate: -5, scale: 1.07, duration: 0.3, ease: "back.out(2)" });
      gsap.to(arrow, { x: 3, y: -3, duration: 0.2, ease: "power2.out" });
      gsap.to(glow, { opacity: 1, duration: 0.3 });
    };
    const handleLeave = () => {
      gsap.to(card, { y: 0, borderColor: "#e2e7dc", duration: 0.25, ease: "power2.out" });
      gsap.to(icon, { rotate: 0, scale: 1, duration: 0.25, ease: "power2.out" });
      gsap.to(arrow, { x: 0, y: 0, duration: 0.2 });
      gsap.to(glow, { opacity: 0, duration: 0.2 });
    };

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mouseleave", handleLeave);
      ctx.revert();
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className="group relative isolate h-full overflow-hidden rounded-[24px] border border-[#e2e7dc] bg-white p-5 text-[#19271e] shadow-[0_14px_40px_rgba(33,55,33,0.055)] transition-colors sm:p-6"
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(154,203,97,0.18),transparent_68%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 -z-10 h-32 w-32 rounded-full border border-[#dfe9d4]" />

      <div className="mb-6 flex items-start justify-between gap-3">
        <div ref={iconRef} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d9e6ca] bg-[#eff5e6] text-[#587a37]">
          <Icon size={22} strokeWidth={1.8} />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e9df] bg-[#f8faf5] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#778373]">
          Feature <span className="h-1.5 w-1.5 rounded-full bg-[#8bb957]" />
        </span>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-[#203725] transition-colors duration-300 group-hover:text-[#63873d] sm:text-xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#718070]">{description}</p>

      <div className="mt-6 flex items-center justify-between border-t border-[#edf0e9] pt-4">
        <span className="text-xs font-medium text-[#8b9587]">The Logic Lab</span>
        <span ref={arrowRef} aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#dce8ce] bg-[#f1f6e9] text-[#5c7e3c]">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </article>
  );
}
