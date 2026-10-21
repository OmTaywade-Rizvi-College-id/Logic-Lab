
import {
  ArrowRight, ArrowUpRight, Network, Route, Boxes, GitBranch,
  Clock3, Gauge, Lightbulb, CheckCircle2, Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";

const applications = [
  {
    id: "navigation",
    number: "01",
    category: "GRAPH ALGORITHMS",
    title: "Smart Navigation",
    subtitle: "Find the best route from A to B.",
    description:
      "Explore how shortest-path algorithms compare route costs and find an efficient path through a weighted road network.",
    algorithm: "Dijkstra's Algorithm",
    complexity: "O((V + E) log V)",
    difficulty: "Intermediate",
    icon: Route,
    color: "mint",
    tags: ["Shortest paths", "Route planning", "Weighted graphs"],
    steps: [
      "Choose a starting location and destination.",
      "Compare the costs of available routes.",
      "Follow the lowest-cost path to the destination.",
    ],
    example: "GPS route planning",
  },
  {
    id: "network",
    number: "02",
    category: "GRAPH TRAVERSAL",
    title: "Network Exploration",
    subtitle: "Discover how everything connects.",
    description:
      "Understand how traversal algorithms explore connected systems, from computer networks to relationships between objects.",
    algorithm: "BFS & DFS",
    complexity: "O(V + E)",
    difficulty: "Beginner",
    icon: Network,
    color: "blue",
    tags: ["Connectivity", "Traversal", "Graph search"],
    steps: [
      "Choose a starting node in the network.",
      "Visit neighboring or deeper connected nodes.",
      "Observe the order in which nodes are explored.",
    ],
    example: "Network discovery",
  },
  {
    id: "optimization",
    number: "03",
    category: "DYNAMIC PROGRAMMING",
    title: "Resource Optimization",
    subtitle: "Get the most value from limited resources.",
    description:
      "See how dynamic programming evaluates combinations of items to maximize value without exceeding a capacity constraint.",
    algorithm: "0/1 Knapsack",
    complexity: "O(nW)",
    difficulty: "Intermediate",
    icon: Boxes,
    color: "purple",
    tags: ["Optimization", "Dynamic programming", "Resource allocation"],
    steps: [
      "Define each item's weight and value.",
      "Set the available capacity.",
      "Compare choices to find the maximum achievable value.",
    ],
    example: "Budget and cargo planning",
  },
  {
    id: "infrastructure",
    number: "04",
    category: "MINIMUM SPANNING TREE",
    title: "Network Planning",
    subtitle: "Connect every location at minimum cost.",
    description:
      "Investigate how spanning-tree algorithms select connections while avoiding cycles and minimizing the total network cost.",
    algorithm: "Prim's & Kruskal's",
    complexity: "O(E log E)",
    difficulty: "Intermediate",
    icon: GitBranch,
    color: "orange",
    tags: ["Network design", "Edge selection", "Cost minimization"],
    steps: [
      "Represent locations as nodes and connections as weighted edges.",
      "Select edges according to the algorithm's rules.",
      "Connect all reachable locations without unnecessary cycles.",
    ],
    example: "Infrastructure planning",
  },
];

const principles = [
  { icon: Workflow, title: "Input", description: "Represent a practical problem using nodes, edges, values, or constraints." },
  { icon: Gauge, title: "Execution", description: "Run an algorithm to evaluate possible choices and update its state." },
  { icon: Lightbulb, title: "Understanding", description: "Inspect the decisions and learn why the algorithm reaches its result." },
];

export default function Applications() {
  return (
    <main className="min-h-screen bg-[#f7f7f0] px-5 py-10 text-[#1d2d21] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <section className="relative overflow-hidden rounded-[30px] bg-[#203626] px-6 py-10 text-white shadow-xl shadow-[#203626]/10 sm:px-10 sm:py-14 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-10 lg:px-12">
          <div className="pointer-events-none absolute -right-10 -top-28 h-80 w-80 rounded-full bg-lime-300/10 blur-[90px]" />
          <div className="relative z-10">
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-[.22em] text-lime-300 sm:text-xs"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> ALGORITHMS BEYOND THE CLASSROOM</p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-.06em] sm:text-6xl">From abstract logic<br />to <span className="font-serif font-normal italic text-lime-200">real-world impact.</span></h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">Algorithms power the systems we use every day. Explore how the right algorithm transforms a practical problem into a solution you can understand, visualize, and experiment with.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#application-library" className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3.5 text-sm font-bold text-[#203626] transition hover:bg-lime-200">Explore applications <ArrowRight size={17} /></a>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.05] px-4 py-3 text-xs text-white/75"><CheckCircle2 size={15} className="text-lime-300" /> Practical examples</span>
            </div>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[26px] border border-white/10 bg-[#14241c] p-4 sm:p-6 lg:mt-0">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/10 blur-[60px]" />
            <div className="relative flex items-center justify-between gap-3">
              <div><p className="text-[10px] font-bold tracking-[.2em] text-lime-300">NETWORK MODEL</p><h2 className="mt-2 text-lg font-semibold">Connected ideas</h2></div>
              <Network className="text-lime-300" size={22} />
            </div>
            <svg viewBox="0 0 420 300" className="relative mt-3 h-auto w-full" role="img" aria-label="Connected graph showing routes between nodes">
              <defs><linearGradient id="applicationsEdge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#b7e878"/><stop offset="100%" stopColor="#62c7a0"/></linearGradient></defs>
              <g stroke="#7b917e" strokeOpacity=".45" strokeWidth="2">
                <line x1="55" y1="150" x2="145" y2="68"/><line x1="55" y1="150" x2="145" y2="240"/><line x1="145" y1="68" x2="240" y2="135"/><line x1="145" y1="240" x2="240" y2="135"/><line x1="145" y1="68" x2="340" y2="65"/><line x1="240" y1="135" x2="340" y2="65"/><line x1="240" y1="135" x2="340" y2="240"/><line x1="145" y1="240" x2="340" y2="240"/>
              </g>
              <path d="M55 150 L145 68 L240 135 L340 65" fill="none" stroke="url(#applicationsEdge)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              {[
                { id: "A", x: 55, y: 150, active: true }, { id: "B", x: 145, y: 68, active: true }, { id: "C", x: 145, y: 240, active: false }, { id: "D", x: 240, y: 135, active: true }, { id: "E", x: 340, y: 240, active: false }, { id: "F", x: 340, y: 65, active: true },
              ].map((node) => <g key={node.id}><circle cx={node.x} cy={node.y} r="22" fill={node.active ? "#31492f" : "#17271c"} stroke={node.active ? "#b7e878" : "#607466"} strokeWidth="2"/><text x={node.x} y={node.y + 5} fill={node.active ? "#e5ffbd" : "#a0b0a1"} fontSize="13" fontWeight="600" textAnchor="middle">{node.id}</text></g>)}
            </svg>
            <p className="relative border-t border-white/10 pt-4 text-xs text-white/50">Represent a problem. Explore the connections. Understand the outcome.</p>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          {principles.map(({ icon: Icon, title, description }, index) => (
            <article key={title} className="rounded-[23px] border border-[#e0e5d9] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between"><span className="font-mono text-xs text-[#91a080]">0{index + 1}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf3e4] text-[#688643]"><Icon size={20} /></span></div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#788276]">{description}</p>
            </article>
          ))}
        </section>

        <section id="application-library" className="scroll-mt-8 py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-[10px] font-bold tracking-[.22em] text-[#789247]">THE APPLICATION LIBRARY</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-5xl">Algorithms at <span className="font-serif font-normal italic text-[#668344]">work.</span></h2><p className="mt-3 max-w-xl text-sm leading-7 text-[#778176]">Explore practical problem areas and the algorithms that help solve them.</p></div>
            <span className="w-fit rounded-full border border-[#dde5d5] bg-white px-4 py-2 text-xs font-bold tracking-wider text-[#7d8d71]">04 MODULES</span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {applications.map((item) => {
              const Icon = item.icon;
              const tone = item.color === "mint" ? "bg-[#e8f1dc] text-[#648341]" : item.color === "blue" ? "bg-[#e2f0e9] text-[#39745c]" : item.color === "purple" ? "bg-[#f0e9db] text-[#8c7041]" : "bg-[#faedcf] text-[#956d2f]";
              return (
                <article key={item.id} className="group flex h-full flex-col rounded-[26px] border border-[#e0e5d9] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c5d5b4] hover:shadow-xl hover:shadow-[#203626]/5 sm:p-7">
                  <div className="flex items-start justify-between gap-4"><span className={`grid h-14 w-14 place-items-center rounded-[18px] ${tone}`}><Icon size={25}/></span><span className="font-mono text-xs text-[#9aa394]">/{item.number}</span></div>
                  <p className="mt-6 text-[10px] font-bold tracking-[.18em] text-[#87947d]">{item.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-.04em]">{item.title}</h3><p className="mt-2 text-sm font-medium text-[#5f7655]">{item.subtitle}</p>
                  <p className="mt-4 text-sm leading-7 text-[#778176]">{item.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="rounded-full bg-[#f2f5ed] px-3 py-1.5 text-[11px] font-medium text-[#6c7c65]">{tag}</span>)}</div>
                  <div className="mt-6 grid gap-3 rounded-2xl bg-[#f7f9f3] p-4 sm:grid-cols-2"><div><p className="text-[10px] font-bold tracking-wider text-[#929c8b]">ALGORITHM</p><p className="mt-1 text-sm font-semibold text-[#394c37]">{item.algorithm}</p></div><div><p className="text-[10px] font-bold tracking-wider text-[#929c8b]">TIME COMPLEXITY</p><p className="mt-1 font-mono text-sm font-semibold text-[#5f7c3c]">{item.complexity}</p></div></div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#7c8877]"><Clock3 size={14}/>{item.example}</div>
                  <div className="mt-auto pt-6">
                    {item.id === "navigation" ? <Link className="flex items-center justify-between border-t border-[#e8ece3] pt-4 text-sm font-semibold text-[#4e6940]" to="/route-lab">Explore in Route Lab <span className="grid h-8 w-8 place-items-center rounded-full bg-[#edf3e4] transition group-hover:bg-[#203626] group-hover:text-lime-200"><ArrowUpRight size={16}/></span></Link> : <Link className="flex items-center justify-between border-t border-[#e8ece3] pt-4 text-sm font-semibold text-[#4e6940]" to={`/algorithms?category=${encodeURIComponent(item.id)}`}>Explore algorithm <span className="grid h-8 w-8 place-items-center rounded-full bg-[#edf3e4] transition group-hover:bg-[#203626] group-hover:text-lime-200"><ArrowUpRight size={16}/></span></Link>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[28px] bg-[#e8efdc] p-6 sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#668344]"><Lightbulb size={23}/></span><div><p className="text-[10px] font-bold tracking-[.2em] text-[#789247]">YOUR NEXT DISCOVERY</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Don't just learn the logic. Explore it.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#6e7c69]">Start with a graph, change the inputs, and see how an algorithm responds.</p></div></div>
          <Link to="/route-lab" className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-[#203626] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#2e4933] lg:mt-0">Open Route Lab <ArrowRight size={17}/></Link>
        </section>
        <footer className="flex flex-col justify-between gap-3 py-6 text-xs text-[#879083] sm:flex-row"><span className="font-semibold tracking-wide text-[#485b47]">THE LOGIC LAB.</span><span>Explore the idea. Understand the algorithm. Apply the result.</span></footer>
      </div>
    </main>
  );
}