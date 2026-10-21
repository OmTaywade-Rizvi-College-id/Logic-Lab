import { useEffect, useRef } from "react";
import { ChartNoAxesColumnIncreasing, Clock3, MemoryStick, Sparkles } from "lucide-react";
import gsap from "gsap";

export default function ComplexityPanel() {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".complexity-metric", { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
      });
    }, panel);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={panelRef} className="relative overflow-hidden rounded-[24px] border border-[#e2e7dc] bg-white p-5 text-[#203725] shadow-[0_14px_40px_rgba(33,55,33,0.055)] sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#dcebc7]/60 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9acb61]/70 to-transparent" />
      <div className="relative mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9e6ca] bg-[#eff5e6] text-[#5d813c]"><ChartNoAxesColumnIncreasing size={22} /></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#708b4c]">Performance</p><h3 className="mt-1 text-lg font-semibold text-[#203725]">Complexity Analysis</h3></div>
        </div>
        <Sparkles size={18} className="text-[#a2b293]" />
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <article className="complexity-metric rounded-2xl border border-[#d8e6d2] bg-[#f1f7ed] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2"><span className="text-xs font-medium text-[#718070]">Time Complexity</span><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#56806a]"><Clock3 size={16} /></div></div>
          <strong className="block break-words font-mono text-xl font-semibold tracking-tight text-[#416c4d] sm:text-2xl">O((V + E) log V)</strong>
          <p className="mt-3 text-xs leading-5 text-[#7b8778]">Using an adjacency list and priority queue.</p>
          <div className="mt-5 h-1 overflow-hidden rounded-full bg-[#e0ead8]"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#9acb61] to-[#7abf9f]" /></div>
        </article>
        <article className="complexity-metric rounded-2xl border border-[#e0e1cf] bg-[#faf8ed] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2"><span className="text-xs font-medium text-[#718070]">Space Complexity</span><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#8b854b]"><MemoryStick size={16} /></div></div>
          <strong className="block break-words font-mono text-xl font-semibold tracking-tight text-[#817742] sm:text-2xl">O(V + E)</strong>
          <p className="mt-3 text-xs leading-5 text-[#7b8778]">Graph storage, distances and queue.</p>
          <div className="mt-5 h-1 overflow-hidden rounded-full bg-[#e9e5cd]"><div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#c6bd72] to-[#9acb61]" /></div>
        </article>
      </div>
      <div className="relative mt-4 flex items-start gap-3 rounded-xl border border-[#e5eadf] bg-[#f8faf5] p-4">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-[#76954a]" />
        <p className="text-xs leading-5 text-[#718070]"><span className="font-semibold text-[#344a35]">Complexity note: </span>These values describe Dijkstra's algorithm implemented using an adjacency list and a priority queue.</p>
      </div>
    </section>
  );
}