import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code2,
  Sparkles,
  Trophy,
} from "lucide-react";
import gsap from "gsap";

export interface Challenge {
  id: string | number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  estimatedTime: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onSolve: (challenge: Challenge) => void;
  isSolved?: boolean;
}

export default function ChallengeCard({
  challenge,
  onSolve,
  isSolved = false,
}: ChallengeCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const difficulty = challenge.difficulty.toLowerCase();

  const difficultyStyles: Record<string, string> = {
    easy: "border-[#d7e6ca] bg-[#e9f1e1] text-[#648844]",
    beginner: "border-[#d7e6ca] bg-[#e9f1e1] text-[#648844]",
    medium: "border-[#eadfc9] bg-[#f4ead6] text-[#946a2b]",
    intermediate: "border-[#eadfc9] bg-[#f4ead6] text-[#946a2b]",
    hard: "border-[#efd8d5] bg-[#fbefed] text-[#a45151]",
    advanced: "border-[#efd8d5] bg-[#fbefed] text-[#a45151]",
  };

  const difficultyClass =
    difficultyStyles[difficulty] ??
    "border-[#dfe5d9] bg-[#f4f6f0] text-[#647265]";

  useEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    const arrow = arrowRef.current;
    const glow = glowRef.current;

    if (!card || !icon || !arrow || !glow) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          clearProps: "transform",
        },
      );

      gsap.set(glow, { opacity: 0 });
    }, card);

    const handleEnter = () => {
      gsap.to(card, {
        y: -6,
        borderColor: "rgba(132,165,80,0.38)",
        duration: 0.25,
        ease: "power2.out",
      });

      gsap.to(icon, {
        rotate: -6,
        scale: 1.08,
        duration: 0.3,
        ease: "back.out(2)",
      });

      gsap.to(arrow, {
        x: 3,
        y: -3,
        duration: 0.2,
        ease: "power2.out",
      });

      gsap.to(glow, { opacity: 1, duration: 0.3 });
    };

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        borderColor: "rgba(223,229,217,1)",
        duration: 0.25,
        ease: "power2.out",
      });

      gsap.to(icon, {
        rotate: 0,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });

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
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-[#dfe5d9] bg-white p-5 text-[#203626] shadow-[0_15px_45px_rgba(32,54,38,0.08)] sm:p-6"
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(142,170,97,0.12),transparent_65%)]"
      />

      <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-36 w-36 rounded-full border border-[#8eaa61]/10" />
      <div className="pointer-events-none absolute -right-5 -top-5 -z-10 h-22 w-22 rounded-full border border-[#8eaa61]/10" />

      {/* Difficulty and points */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${difficultyClass}`}
        >
          {challenge.difficulty}
        </span>

        {isSolved ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d7e6ca] bg-[#e9f1e1] px-2.5 py-1.5 text-xs font-medium text-[#648844]">
            <CheckCircle2 size={14} />
            Solved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfc9] bg-[#f4ead6] px-2.5 py-1.5 text-xs font-semibold text-[#946a2b]">
            <Trophy size={13} />
            +{challenge.points} XP
          </span>
        )}
      </div>

      {/* Icon */}
      <div
        ref={iconRef}
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#d2dfc2] bg-[#e9f0de] text-[#668344]"
      >
        <Code2 size={23} strokeWidth={1.8} />
      </div>

      {/* Challenge information */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7c8777]">
          Challenge
        </span>
        <span className="h-px flex-1 bg-[#e4e9df]" />
      </div>

      <h3 className="text-xl font-semibold leading-snug tracking-tight text-[#203626] transition-colors duration-300 group-hover:text-[#4f6b35]">
        {challenge.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-[#647265]">
        {challenge.description}
      </p>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#e4e9df] bg-[#f6f8f3] px-3 py-2 text-xs text-[#465746]">
          <Code2 size={13} className="text-[#668344]" />
          {challenge.category}
        </span>

        <span className="inline-flex items-center gap-2 rounded-lg border border-[#e4e9df] bg-[#f6f8f3] px-3 py-2 text-xs text-[#647265]">
          <Clock3 size={13} />
          {challenge.estimatedTime}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#e4e9df] pt-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7c8777]">
            Challenge ID
          </p>
          <p className="mt-1 truncate font-mono text-xs text-[#647265]">
            #{challenge.id}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSolve(challenge)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#d2dfc2] bg-[#e8f0dd] px-3 py-2 text-xs font-semibold text-[#55733a] transition-colors duration-200 hover:border-[#a5bf88] hover:bg-[#e2edcf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6c189]/70 sm:px-4 sm:text-sm"
        >
          {isSolved ? "Practice again" : "Solve challenge"}
          <span ref={arrowRef} className="inline-flex">
            <ArrowUpRight size={16} />
          </span>
        </button>
      </div>

      {isSolved && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#648844]">
          <Sparkles size={13} />
          Completed — keep practicing to improve
        </div>
      )}
    </article>
  );
}