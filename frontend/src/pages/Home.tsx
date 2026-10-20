
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Binary,
  BookOpen,
  Braces,
  Check,
  Code2,
  GitBranch,
  Network,
  Search,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";

const algorithms = [
  {
    number: "01",
    title: "Dijkstra's Algorithm",
    topic: "Graph Theory",
    level: "Intermediate",
    description:
      "Find the shortest route through a weighted network, one decision at a time.",
    icon: Network,
    tone: "lime",
    path: "/route-lab",
  },
  {
    number: "02",
    title: "Breadth-First Search",
    topic: "Traversal",
    level: "Beginner",
    description:
      "Explore connected nodes layer by layer and understand how queues work.",
    icon: GitBranch,
    tone: "mint",
    path: "/algorithms",
  },
  {
    number: "03",
    title: "Depth-First Search",
    topic: "Traversal",
    level: "Beginner",
    description:
      "Follow a branch deeper into a graph, then learn when to backtrack.",
    icon: Workflow,
    tone: "amber",
    path: "/algorithms",
  },
  {
    number: "04",
    title: "Time Complexity",
    topic: "Analysis",
    level: "Core Concept",
    description:
      "Compare how algorithms scale as the size of an input increases.",
    icon: Braces,
    tone: "sage",
    path: "/code-complexity",
  },
];

const learningPaths = [
  {
    icon: Sparkles,
    number: "01",
    title: "See the invisible",
    description:
      "Turn abstract operations into visual steps you can follow.",
  },
  {
    icon: Workflow,
    number: "02",
    title: "Follow the logic",
    description:
      "Explore how nodes, decisions, and data structures interact.",
  },
  {
    icon: Terminal,
    number: "03",
    title: "Put it to work",
    description:
      "Practice problems and connect theory to real implementations.",
  },
];

const graphNodes = [
  { id: "A", x: 54, y: 144, active: true },
  { id: "B", x: 139, y: 66, active: true },
  { id: "C", x: 139, y: 220, active: false },
  { id: "D", x: 240, y: 135, active: true },
  { id: "E", x: 324, y: 65, active: true },
  { id: "F", x: 340, y: 225, active: false },
  { id: "G", x: 412, y: 144, active: true },
];

const graphEdges: [number, number, number, number, string][] = [
  [54, 144, 139, 66, "active"],
  [54, 144, 139, 220, "idle"],
  [139, 66, 240, 135, "active"],
  [139, 220, 240, 135, "idle"],
  [240, 135, 324, 65, "active"],
  [240, 135, 340, 225, "idle"],
  [324, 65, 412, 144, "active"],
  [340, 225, 412, 144, "idle"],
];

type Tone = "lime" | "mint" | "amber" | "sage";

const toneClasses: Record<Tone, string> = {
  lime: "bg-lime-300/15 text-lime-300",
  mint: "bg-emerald-300/15 text-emerald-300",
  amber: "bg-amber-300/15 text-amber-300",
  sage: "bg-teal-300/15 text-teal-300",
};

function GraphPlayground() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#14241c] p-5 text-white shadow-2xl shadow-[#193527]/15 sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lime-300/10 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-12 h-48 w-48 rounded-full bg-emerald-400/10 blur-[70px]"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
            Visual lab / 001
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
            Find the shortest path.
          </h2>
          <p className="mt-1 text-sm text-white/50">
            A graph, a goal, and a better way to learn.
          </p>
        </div>

        <div className="hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:block">
          <Network className="h-5 w-5 text-lime-300" />
        </div>
      </div>

      <div className="relative mt-7 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e1913] p-2 sm:p-4">
        <svg
          viewBox="0 0 466 285"
          className="h-auto w-full"
          role="img"
          aria-label="An example graph showing a highlighted route from node A to node G"
        >
          <defs>
            <pattern
              id="homeGraphGrid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="#b3c8b6"
                strokeOpacity=".07"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect
            width="466"
            height="285"
            rx="12"
            fill="url(#homeGraphGrid)"
          />

          {graphEdges.map(([x1, y1, x2, y2, state], index) => (
            <g key={index}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={state === "active" ? "#b7e878" : "#53665a"}
                strokeWidth={state === "active" ? 2.5 : 1.5}
                strokeDasharray={state === "active" ? undefined : "4 6"}
                strokeLinecap="round"
                opacity={state === "active" ? 0.95 : 0.65}
              />
              {state === "active" && (
                <circle r="3" fill="#d9f99d">
                  <animateMotion
                    dur={`${3 + (index % 3)}s`}
                    repeatCount="indefinite"
                    path={`M ${x1} ${y1} L ${x2} ${y2}`}
                  />
                </circle>
              )}
            </g>
          ))}

          {graphNodes.map((node) => (
            <g key={node.id}>
              {node.active && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="23"
                  fill="#b7e878"
                  fillOpacity=".08"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r="14"
                fill={node.active ? "#263e2c" : "#17251c"}
                stroke={node.active ? "#c4f18b" : "#607466"}
                strokeWidth="1.5"
              />
              <text
                x={node.x}
                y={node.y + 4}
                fill={node.active ? "#e4ffc0" : "#9ba99e"}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/10">
            <Check className="h-4 w-4 text-lime-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Dijkstra's algorithm
            </p>
            <p className="mt-0.5 text-xs text-white/45">
              Weighted graph exploration
            </p>
          </div>
        </div>

        <Link
          to="/route-lab"
          className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-4 py-2.5 text-xs font-bold text-[#172318] transition hover:bg-lime-200"
        >
          Open lab <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredAlgorithms = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return algorithms;

    return algorithms.filter((algorithm) =>
      [
        algorithm.title,
        algorithm.topic,
        algorithm.level,
        algorithm.description,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [search]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f0] text-[#19271e]">
      {/* HERO */}
      <section className="relative px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#dcebc7]/50 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-64 h-64 w-64 rounded-full bg-[#b8e5d2]/25 blur-[90px]"
        />

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9dfd1] bg-white/75 px-3.5 py-2 text-[10px] font-bold tracking-[0.13em] text-[#4d654f] shadow-sm sm:text-xs">
              <Sparkles size={14} className="text-[#6d9438]" />
              A NEW WAY TO EXPLORE ALGORITHMS
            </div>

            <h1 className="mt-8 text-[clamp(3.2rem,7.1vw,6.3rem)] font-semibold leading-[.96] tracking-[-0.075em] text-[#17281d]">
              Logic you can
              <br />
              <span className="font-serif font-normal italic text-[#60813b]">
                actually see.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#647064] sm:text-lg">
              Algorithms are more than lines of code. Explore how they
              think, see each step unfold, and build an intuition that
              stays with you.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/algorithms"
                className="group inline-flex items-center gap-3 rounded-full bg-[#1e3424] px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-[#203b27]/15 transition hover:-translate-y-0.5 hover:bg-[#2b4731]"
              >
                Start exploring
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/route-lab"
                className="inline-flex items-center gap-2 rounded-full border border-[#dce1d6] bg-white/70 px-6 py-4 text-sm font-semibold text-[#354839] transition hover:border-[#8da778] hover:bg-white"
              >
                <Code2 size={17} />
                Enter Route Lab
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-[#778176]">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#86a850]" />
                Visual learning
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#66aa95]" />
                Step-by-step logic
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d4a45a]" />
                Hands-on practice
              </span>
            </div>
          </div>

          <GraphPlayground />
        </div>

        <div className="relative mx-auto mt-16 max-w-[1400px] border-t border-[#dfe3d9] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#899185]">
              YOUR SPACE TO EXPERIMENT
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Binary, label: "Algorithms" },
                { icon: GitBranch, label: "Graph theory" },
                { icon: Braces, label: "Big O" },
                { icon: Zap, label: "Challenges" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e0e4dc] bg-white/65 px-3 py-2 text-xs font-medium text-[#5e6d60]"
                >
                  <Icon size={14} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING PHILOSOPHY */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.23em] text-[#789247]">
                THE LEARNING EXPERIENCE
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
                Less memorizing.
                <br />
                <span className="font-serif font-normal italic text-[#668344]">
                  More understanding.
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#788176]">
              Learn what happens inside an algorithm, why every step
              matters, and how the same ideas solve real problems.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {learningPaths.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  className="group rounded-[26px] border border-[#e6e9e1] bg-[#fafbf7] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9d8b8] hover:shadow-xl hover:shadow-[#263a24]/5 sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf0dd] text-[#526e35] transition group-hover:bg-[#1f3624] group-hover:text-lime-300">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-xs text-[#a1aa9a]">
                      / {item.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#778176]">
                    {item.description}
                  </p>

                  <div className="mt-6 h-px bg-[#e5e9df] transition group-hover:bg-[#cbd9bb]" />
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#6f8164]">
                    <span>Explore the process</span>
                    <ArrowDownRight
                      size={17}
                      className="transition group-hover:translate-x-1 group-hover:translate-y-1"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ALGORITHM LIBRARY */}
      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.23em] text-[#789247]">
                THE COLLECTION
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
                Find your next{" "}
                <span className="font-serif font-normal italic text-[#668344]">
                  breakthrough.
                </span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#778176]">
                Start with the fundamentals or dive into graph algorithms.
              </p>
            </div>

            <Link
              to="/algorithms"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9e0d3] bg-white px-5 py-3 text-sm font-semibold text-[#344936] transition hover:border-[#a6bd90]"
            >
              Browse all algorithms
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <label className="mt-9 flex max-w-lg items-center gap-3 rounded-2xl border border-[#e0e5da] bg-white px-4 py-3.5 shadow-sm transition focus-within:border-[#94ad7a] focus-within:shadow-md">
            <Search size={19} className="shrink-0 text-[#809078]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search an algorithm, topic, or concept..."
              aria-label="Search algorithms"
              className="w-full bg-transparent text-sm text-[#243629] outline-none placeholder:text-[#a0a79c]"
            />
            <span className="hidden rounded-md border border-[#e8ebe4] px-2 py-1 font-mono text-[10px] text-[#929b8e] sm:inline">
              SEARCH
            </span>
          </label>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredAlgorithms.map((algorithm) => {
              const Icon = algorithm.icon;
              const tone = toneClasses[algorithm.tone as Tone];

              return (
                <article
                  key={algorithm.number}
                  className="group flex min-h-[310px] flex-col rounded-[25px] border border-[#e0e5da] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#b8caa8] hover:shadow-xl hover:shadow-[#223624]/5 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${tone}`}>
                      <Icon size={21} />
                    </div>
                    <span className="font-mono text-xs text-[#a1a99e]">
                      {algorithm.number}
                    </span>
                  </div>

                  <div className="mt-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f0f3eb] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#67765f]">
                        {algorithm.topic}
                      </span>
                      <span className="text-[10px] text-[#949c90]">
                        {algorithm.level}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-[#233629]">
                      {algorithm.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#7a8477]">
                      {algorithm.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-7">
                    <Link
                      to={algorithm.path}
                      className="flex items-center justify-between border-t border-[#edf0e9] pt-4 text-sm font-semibold text-[#4e6940]"
                    >
                      Explore concept
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4e9] transition group-hover:bg-[#233b27] group-hover:text-lime-300">
                        <ArrowRight size={15} />
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredAlgorithms.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-[#d6dfce] bg-white/70 p-10 text-center">
              <Search className="mx-auto h-7 w-7 text-[#89977f]" />
              <h3 className="mt-4 font-semibold">No matching concepts</h3>
              <p className="mt-2 text-sm text-[#7c8678]">
                Try another search term.
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded-full bg-[#203725] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#315239]"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[30px] bg-[#203626] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-lime-300/10 blur-[80px]"
          />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-lime-300">
                <BookOpen size={15} />
                YOUR NEXT STEP
              </div>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
                Curiosity is the
                <br />
                best place to start.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/60">
                Choose a concept, experiment with the logic, and learn
                something new with every step.
              </p>
            </div>

            <Link
              to="/practice"
              className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-lime-300 px-6 py-4 text-sm font-bold text-[#1d3021] transition hover:-translate-y-0.5 hover:bg-lime-200"
            >
              Try a challenge
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <footer className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 py-6 text-xs text-[#879083] sm:flex-row sm:items-center">
          <span className="font-semibold tracking-wide text-[#485b47]">
            LOGIC LAB<span className="text-[#84a44f]">.</span>
          </span>
          <span>Understand the process. Not just the answer.</span>
        </footer>
      </section>
    </main>
  );
}
