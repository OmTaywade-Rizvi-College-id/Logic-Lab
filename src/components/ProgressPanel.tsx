import { useEffect, useRef } from "react";
import { Trophy, Target, Flame, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";

interface ProgressPanelProps {
  totalChallenges: number;
  solvedCount: number;
  attemptedCount: number;
}

interface ProgressStat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function ProgressPanel({
  totalChallenges,
  solvedCount,
  attemptedCount,
}: ProgressPanelProps) {
  const rootRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const percentage =
    totalChallenges > 0
      ? Math.min(100, Math.round((solvedCount / totalChallenges) * 100))
      : 0;

  const stats: ProgressStat[] = [
    {
      label: "Solved",
      value: `${solvedCount}/${totalChallenges}`,
      icon: Trophy,
      color: "text-[#55783b] bg-[#edf4e3] border-[#dce8cd]",
    },
    {
      label: "Attempted",
      value: attemptedCount,
      icon: Target,
      color: "text-[#497e69] bg-[#eaf4ee] border-[#d9e8dc]",
    },
    {
      label: "Completion",
      value: `${percentage}%`,
      icon: TrendingUp,
      color: "text-[#9a6a26] bg-[#fbf2dd] border-[#eee2c3]",
    },
  ];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".progress-stat-card",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!fillRef.current) return;
    gsap.fromTo(
      fillRef.current,
      { width: "0%" },
      {
        width: `${percentage}%`,
        duration: 0.9,
        ease: "power3.out",
        overwrite: true,
      },
    );
  }, [percentage]);

  const message =
    percentage === 100 && totalChallenges > 0
      ? "Amazing! You've completed every challenge."
      : solvedCount === 0
        ? "Your journey starts here. Solve your first challenge!"
        : "Keep going! Every challenge strengthens your logic.";

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden rounded-[26px] border border-[#e2e7dc] bg-white p-5 text-[#19271e] shadow-[0_12px_38px_rgba(29,49,29,0.055)] sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#dcebc7]/60 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6e8c4b]">
            Your learning journey
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#203626]">
            Practice Progress
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#778176]">
            Every problem solved takes you one step further.
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#ead7a7] bg-[#fbf2dd] text-[#9a6a26]">
          <Flame size={24} />
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map(({ icon: Icon, ...stat }) => (
          <article
            key={stat.label}
            className="progress-stat-card rounded-2xl border border-[#e8ece3] bg-[#fafbf7] p-4 transition-colors hover:border-[#ceddbd] hover:bg-[#f6f9f0]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#778176]">{stat.label}</span>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${stat.color}`}>
                <Icon size={17} />
              </span>
            </div>
            <strong className="mt-4 block text-2xl font-semibold tracking-tight text-[#203626]">
              {stat.value}
            </strong>
          </article>
        ))}
      </div>

      <div className="relative mt-6 rounded-2xl border border-[#e8ece3] bg-[#f7f9f3] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#778176]">
            Overall completion
          </span>
          <span className="font-mono text-sm font-bold text-[#55783b]">
            {percentage}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-[#e4e9df]"
          role="progressbar"
          aria-label="Challenge completion"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            ref={fillRef}
            className="h-full rounded-full bg-gradient-to-r from-[#638640] to-[#b2d66f]"
            style={{ width: "0%" }}
          />
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#778176]">
          <Trophy size={15} className="mt-0.5 shrink-0 text-[#6e8c4b]" />
          {message}
        </p>
      </div>
    </section>
  );
}