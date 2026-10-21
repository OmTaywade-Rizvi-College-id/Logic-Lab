import { useEffect, useRef } from "react";
import { ArrowUpRight, Network, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";

interface AlgorithmCardProps {
  title: string;
  category: string;
  difficulty: string;
  description: string;
  application: string;
}

export default function AlgorithmCard({
  title,
  category,
  difficulty,
  description,
  application,
}: AlgorithmCardProps) {
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
        {
          opacity: 0,
          y: 28,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
          clearProps: "transform",
        },
      );

      gsap.set(glow, { opacity: 0 });
    }, card);

    const handleEnter = () => {
      gsap.to(card, {
        y: -7,
        borderColor: "rgba(132,165,80,0.42)",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(icon, {
        rotate: 8,
        scale: 1.08,
        duration: 0.3,
        ease: "back.out(2)",
      });

      gsap.to(arrow, {
        x: 4,
        y: -3,
        duration: 0.25,
        ease: "power2.out",
      });

      gsap.to(glow, {
        opacity: 1,
        duration: 0.35,
      });
    };

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        borderColor: "rgba(223,229,217,1)",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(icon, {
        rotate: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(arrow, {
        x: 0,
        y: 0,
        duration: 0.25,
      });

      gsap.to(glow, {
        opacity: 0,
        duration: 0.25,
      });
    };

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mouseleave", handleLeave);

    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mouseleave", handleLeave);
      ctx.revert();
    };
  }, []);

  const difficultyStyles: Record<string, string> = {
    beginner: "border-[#d7e6ca] bg-[#e9f1e1] text-[#648844]",
    easy: "border-[#d7e6ca] bg-[#e9f1e1] text-[#648844]",
    intermediate: "border-[#eadfc9] bg-[#f4ead6] text-[#946a2b]",
    medium: "border-[#eadfc9] bg-[#f4ead6] text-[#946a2b]",
    advanced: "border-[#efd8d5] bg-[#fbefed] text-[#a45151]",
    hard: "border-[#efd8d5] bg-[#fbefed] text-[#a45151]",
  };

  const difficultyClass =
    difficultyStyles[difficulty.toLowerCase()] ??
    "border-[#dfe5d9] bg-[#f4f6f0] text-[#647265]";

  return (
    <article
      ref={cardRef}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-[#dfe5d9] bg-white p-5 text-[#203626] shadow-[0_12px_40px_rgba(32,54,38,0.07)] sm:p-6"
    >
      {/* Ambient hover glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(142,170,97,0.12),transparent_65%)]"
      />

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 -z-10 h-36 w-36 rounded-full border border-[#8eaa61]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 -z-10 h-24 w-24 rounded-full border border-[#8eaa61]/10"
      />

      {/* Card header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div
          ref={iconRef}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d2dfc2] bg-[#e9f0de] text-[#668344] shadow-[0_0_25px_rgba(142,170,97,0.08)]"
        >
          <Network size={23} strokeWidth={1.8} />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e9df] bg-[#f6f8f3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c8777]">
          <Sparkles size={11} className="text-[#668344]" />
          Algorithm
        </span>
      </div>

      {/* Category and difficulty */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-[#d2dfc2] bg-[#e9f0de] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#668344]">
          {category}
        </span>

        <span
          className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${difficultyClass}`}
        >
          {difficulty}
        </span>
      </div>

      {/* Title and description */}
      <h3 className="mb-3 text-xl font-semibold leading-snug tracking-tight text-[#203626] transition-colors duration-300 group-hover:text-[#4f6b35] sm:text-2xl">
        {title}
      </h3>

      <p className="mb-5 text-sm leading-6 text-[#647265]">
        {description}
      </p>

      {/* Application information */}
      <div className="mb-6 rounded-xl border border-[#e4e9df] bg-[#f7f8f3] p-4">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7c8777]">
          Real-world application
        </p>

        <p className="text-sm leading-6 text-[#465746]">
          {application}
        </p>
      </div>

      {/* Bottom action */}
      <div className="mt-auto border-t border-[#e4e9df] pt-4">
        <Link
          to="/route-lab"
          className="inline-flex w-full items-center justify-between gap-3 rounded-xl py-2 text-sm font-semibold text-[#668344] transition-colors duration-300 hover:text-[#4f6b35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6c189]"
        >
          <span>Explore algorithm</span>

          <span
            ref={arrowRef}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d2dfc2] bg-[#e9f0de]"
          >
            <ArrowUpRight size={18} />
          </span>
        </Link>
      </div>
    </article>
  );
}