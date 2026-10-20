import { useEffect, useState } from "react";
import {
  Network,
  Plus,
  Link2,
  Trash2,
  X,
  Lightbulb,
  BookOpen,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Route,
  Target,
  GitBranch,
  Activity,
  Check,
  AlertCircle,
} from "lucide-react";

import AlgorithmInsights from "../components/AlgorithmInsights";
import GraphCanvas from "../components/GraphCanvas";
import type { GraphNode, GraphEdge, GraphMode } from "../components/GraphCanvas";
import ExecutionSteps from "../components/ExecutionSteps";
import CodePanel from "../components/CodePanel";
import ComplexityPanel from "../components/ComplexityPanel";

interface DemoStep {
  id: number;
  node: string;
  distance: string;
  action: string;
  description: string;
  reason: string;
  visited: string[];
  path: string[];
}

const sampleNodes: GraphNode[] = [
  { id: "A", x: 70, y: 180 },
  { id: "B", x: 220, y: 65 },
  { id: "C", x: 220, y: 290 },
  { id: "D", x: 385, y: 180 },
  { id: "E", x: 385, y: 290 },
  { id: "F", x: 535, y: 180 },
];

const sampleEdges: GraphEdge[] = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "C", weight: 2 },
  { from: "A", to: "D", weight: 8 },
  { from: "B", to: "D", weight: 1 },
  { from: "B", to: "F", weight: 7 },
  { from: "C", to: "E", weight: 3 },
  { from: "D", to: "E", weight: 2 },
  { from: "D", to: "F", weight: 1 },
  { from: "E", to: "F", weight: 5 },
];

// This is a fixed teaching sequence for the sample graph, not a computed
// execution for graphs edited by the learner.
const demoSteps: DemoStep[] = [
  {
    id: 1,
    node: "A",
    distance: "0",
    action: "Initialize distances",
    description: "Initialize distances (A = 0, others = ∞).",
    reason: "The source node starts at distance zero. Other nodes are initially unreachable.",
    visited: [],
    path: [],
  },
  {
    id: 2,
    node: "A",
    distance: "0",
    action: "Explore neighbors",
    description: "Visit node A and explore its neighbors.",
    reason: "The algorithm begins expanding from the source node.",
    visited: ["A"],
    path: [],
  },
  {
    id: 3,
    node: "B",
    distance: "4",
    action: "Update distances",
    description: "Update distances to B (4) and C (2).",
    reason: "The source provides the initial candidate distances to its neighbors.",
    visited: ["A"],
    path: [],
  },
  {
    id: 4,
    node: "C",
    distance: "2",
    action: "Select closest node",
    description: "Select node C (distance 2).",
    reason: "C has the smallest tentative distance among the unvisited nodes.",
    visited: ["A"],
    path: [],
  },
  {
    id: 5,
    node: "B",
    distance: "4",
    action: "Compare candidate distances",
    description: "Explore B and compare its outgoing routes.",
    reason: "The algorithm compares alternative routes before accepting distance updates.",
    visited: ["A", "C"],
    path: [],
  },
  {
    id: 6,
    node: "D",
    distance: "5",
    action: "Update predecessor",
    description: "Reach D through B with distance 5.",
    reason: "A → B → D has total weight 4 + 1 = 5.",
    visited: ["A", "C", "B"],
    path: [],
  },
  {
    id: 7,
    node: "F",
    distance: "6",
    action: "Complete shortest path",
    description: "Reach F with total distance 6.",
    reason: "The sample shortest route is A → B → D → F, with weight 4 + 1 + 1 = 6.",
    visited: ["A", "C", "B", "D", "F"],
    path: ["A", "B", "D", "F"],
  },
];

const toolButtonBase =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8eae6d]";

export default function RouteLab() {
  const [nodes, setNodes] = useState<GraphNode[]>(sampleNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(sampleEdges);
  const [source, setSource] = useState("A");
  const [destination, setDestination] = useState("F");
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [mode, setMode] = useState<GraphMode>("normal");
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = demoSteps;
  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) {
          window.setTimeout(() => setIsPlaying(false), 0);
          return current;
        }
        const next = current + 1;
        if (next >= steps.length - 1) {
          window.setTimeout(() => setIsPlaying(false), 0);
        }
        return next;
      });
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isPlaying, steps.length]);

  function resetGraph() {
    setIsPlaying(false);
    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setSource("A");
    setDestination("F");
    setStepIndex(0);
    setMode("normal");
    setSelectedNodes([]);
    setEdgeWeight("1");
  }

  function clearGraph() {
    setIsPlaying(false);
    setNodes([]);
    setEdges([]);
    setSource("");
    setDestination("");
    setStepIndex(0);
    setSelectedNodes([]);
    setMode("normal");
  }

  function addNode() {
    if (nodes.length >= 12) {
      window.alert("The demo supports up to 12 nodes.");
      return;
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const id = alphabet.split("").find((letter) => !nodes.some((node) => node.id === letter));
    if (!id) return;

    const positions = [
      { x: 100, y: 85 },
      { x: 300, y: 75 },
      { x: 500, y: 85 },
      { x: 110, y: 280 },
      { x: 300, y: 280 },
      { x: 500, y: 280 },
      { x: 300, y: 175 },
    ];
    const position = positions[nodes.length % positions.length];

    setNodes((current) => [...current, { id, ...position }]);
    if (!source) setSource(id);
    if (!destination) setDestination(id);
  }

  function handleNodeClick(id: string): void {
    if (mode === "delete") {
      setNodes((current) => current.filter((node) => node.id !== id));
      setEdges((current) => current.filter((edge) => edge.from !== id && edge.to !== id));
      if (source === id) setSource("");
      if (destination === id) setDestination("");
      setSelectedNodes([]);
      setStepIndex(0);
      setIsPlaying(false);
      return;
    }

    if (mode === "add-edge") {
      if (selectedNodes.includes(id)) {
        setSelectedNodes((current) => current.filter((item) => item !== id));
        return;
      }

      const next = [...selectedNodes, id];
      if (next.length === 2) {
        const [from, to] = next;
        const exists = edges.some(
          (edge) =>
            (edge.from === from && edge.to === to) ||
            (edge.from === to && edge.to === from),
        );

        if (exists) {
          window.alert("These nodes are already connected.");
        } else {
          setEdges((current) => [
            ...current,
            { from, to, weight: Math.max(1, Number(edgeWeight) || 1) },
          ]);
        }
        setSelectedNodes([]);
      } else {
        setSelectedNodes(next);
      }
    }
  }

  function selectStep(index: number): void {
    setIsPlaying(false);
    setStepIndex(index);
  }

  function resetExecution(): void {
    setIsPlaying(false);
    setStepIndex(0);
  }

  const availableDestinations = nodes.filter((node) => node.id !== source);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f0] px-4 pb-12 pt-8 text-[#19271e] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1680px]">
        <header className="relative overflow-hidden rounded-[30px] border border-[#e1e6da] bg-white px-6 py-8 shadow-sm sm:px-9 sm:py-10 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#dcebc7]/60 blur-[80px]" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe5d0] bg-[#f4f7ee] px-3 py-2 text-[10px] font-bold tracking-[0.18em] text-[#627c45] sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#86a850]" />
                INTERACTIVE WORKSPACE / 001
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                Route Lab<span className="text-[#809957]">.</span>
                <span className="mt-2 block font-serif font-normal italic text-[#668344]">Find the logic behind the shortest path.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#768174] sm:text-base">
                Build a weighted graph, choose your source and destination, then follow the decisions behind Dijkstra’s algorithm.
              </p>
            </div>
            <button
              type="button"
              onClick={resetGraph}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#213827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#31513a]"
            >
              <RotateCcw size={16} /> Load sample graph
            </button>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Network, title: "Build your graph", description: "Add nodes and weighted connections" },
            { icon: Activity, title: "Follow each step", description: "See how distance estimates change" },
            { icon: Route, title: "Understand the route", description: "Review the sample shortest path" },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl border border-[#e3e7de] bg-white/85 p-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf3e4] text-[#56773c]"><Icon size={20} /></div>
              <div><h2 className="text-sm font-semibold text-[#304431]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#849080]">{description}</p></div>
            </div>
          ))}
        </section>

        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[285px_minmax(0,1fr)] 2xl:grid-cols-[290px_minmax(0,1fr)_305px]">
          <aside className="rounded-[26px] border border-[#e0e5d9] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e5] text-[#56753c]"><Network size={19} /></div><div><h2 className="font-semibold">Graph editor</h2><p className="mt-0.5 text-xs text-[#879183]">Customize the network</p></div></div>
              <span className="rounded-full bg-[#f1f4ec] px-2.5 py-1 text-[10px] font-semibold text-[#60765a]">{nodes.length} nodes</span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#7d877a]">Create nodes, connect them, and set the weight of each edge.</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" className={`${toolButtonBase} border-[#dce5d2] bg-[#f4f7ee] text-[#466337] hover:bg-[#e8f0dc]`} onClick={addNode}><Plus size={15} /> Add node</button>
              <button type="button" className={`${toolButtonBase} ${mode === "add-edge" ? "border-[#799856] bg-[#e9f3d8] text-[#3d5d2e]" : "border-[#e2e6dd] bg-white text-[#536653] hover:bg-[#f5f7f1]"}`} onClick={() => { setSelectedNodes([]); setMode(mode === "add-edge" ? "normal" : "add-edge"); }}><Link2 size={15} /> Add edge</button>
              <button type="button" className={`${toolButtonBase} ${mode === "delete" ? "border-rose-300 bg-rose-50 text-rose-700" : "border-[#e2e6dd] bg-white text-[#536653] hover:bg-[#f5f7f1]"}`} onClick={() => { setSelectedNodes([]); setMode(mode === "delete" ? "normal" : "delete"); }}><Trash2 size={15} /> Delete node</button>
              <button type="button" className={`${toolButtonBase} border-[#e2e6dd] bg-white text-[#536653] hover:bg-[#f5f7f1]`} onClick={clearGraph}><X size={15} /> Clear graph</button>
            </div>

            {mode !== "normal" && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#e1e8d7] bg-[#f5f8ef] p-3 text-xs leading-5 text-[#627956]">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {mode === "add-edge" ? "Select two nodes on the graph to connect them." : "Select a node on the graph to remove it and its edges."}
              </div>
            )}

            <div className="my-6 h-px bg-[#e9ede5]" />
            <div className="flex items-center gap-2 text-sm font-semibold"><Target size={16} className="text-[#78954d]" /> Graph settings</div>

            <div className="mt-4 space-y-4">
              <label className="block text-xs font-semibold text-[#5b6958]">Source node
                <select value={source} onChange={(event) => { setSource(event.target.value); setIsPlaying(false); setStepIndex(0); }} className="mt-2 w-full rounded-xl border border-[#dfe5d9] bg-[#fbfcf8] px-3 py-3 text-sm font-medium text-[#293b2d] outline-none transition focus:border-[#8da974] focus:ring-2 focus:ring-[#dce9cf]">
                  <option value="">Select source</option>{nodes.map((node) => <option key={node.id} value={node.id}>{node.id}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-[#5b6958]">Destination node
                <select value={destination} onChange={(event) => { setDestination(event.target.value); setIsPlaying(false); setStepIndex(0); }} className="mt-2 w-full rounded-xl border border-[#dfe5d9] bg-[#fbfcf8] px-3 py-3 text-sm font-medium text-[#293b2d] outline-none transition focus:border-[#8da974] focus:ring-2 focus:ring-[#dce9cf]">
                  <option value="">Select destination</option>{availableDestinations.map((node) => <option key={node.id} value={node.id}>{node.id}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-[#5b6958]">New edge weight
                <input type="number" min="1" step="1" value={edgeWeight} onChange={(event) => setEdgeWeight(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dfe5d9] bg-[#fbfcf8] px-3 py-3 text-sm font-medium text-[#293b2d] outline-none transition focus:border-[#8da974] focus:ring-2 focus:ring-[#dce9cf]" />
              </label>
            </div>

            <div className="mt-6 rounded-2xl bg-[#203626] p-4 text-white">
              <div className="flex items-center gap-2 text-xs font-bold text-lime-300"><Lightbulb size={16} /> QUICK TIP</div>
              <p className="mt-2 text-xs leading-6 text-white/65">Choose <strong className="text-white">Add edge</strong>, click two different nodes, then set a weight for the connection.</p>
            </div>
          </aside>

          <section className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-[26px] border border-[#dfe5d9] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div><div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#82946e]"><GitBranch size={14} /> GRAPH CANVAS</div><h2 className="mt-2 text-lg font-semibold tracking-tight">Shortest-path workspace</h2></div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-[#778474]"><span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f5e7] px-3 py-2"><span className="h-2 w-2 rounded-full bg-[#89ae55]" /> Active route</span><span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f5ef] px-3 py-2"><span className="h-2 w-2 rounded-full bg-[#9da89b]" /> Other edges</span></div>
              </div>

              <div className="rounded-2xl border border-[#e7ebe3] bg-[#fafbf7] p-2 sm:p-4 [&_svg]:max-w-full">
                <GraphCanvas
                  nodes={nodes}
                  edges={edges}
                  currentNode={currentStep?.node}
                  visitedNodes={currentStep?.visited ?? []}
                  shortestPath={currentStep?.path ?? []}
                  mode={mode}
                  selectedNodes={selectedNodes}
                  onNodeClick={handleNodeClick}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f5f7f1] p-4">
                <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#56753c] shadow-sm"><Activity size={18} /></div><div><p className="text-xs text-[#83907e]">CURRENT STEP</p><p className="mt-1 text-sm font-semibold text-[#2d422f]">{currentStep?.action ?? "Ready to explore"}</p></div></div>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Previous step" onClick={() => { setIsPlaying(false); setStepIndex((current) => Math.max(current - 1, 0)); }} disabled={stepIndex === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce3d6] bg-white text-[#496044] transition hover:bg-[#edf3e6] disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={18} /></button>
                  <button type="button" onClick={() => { if (isPlaying) { setIsPlaying(false); } else { if (!source || !destination || source === destination) { window.alert("Choose different source and destination nodes."); return; } if (!nodes.length) { window.alert("Load or create a graph first."); return; } if (stepIndex >= steps.length - 1) setStepIndex(0); setIsPlaying(true); } }} className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-xl bg-[#203626] px-4 text-xs font-bold text-white transition hover:bg-[#31513a]">{isPlaying ? <Pause size={15} /> : <Play size={15} />}{isPlaying ? "Pause" : "Play steps"}</button>
                  <button type="button" aria-label="Next step" onClick={() => { setIsPlaying(false); setStepIndex((current) => Math.min(current + 1, steps.length - 1)); }} disabled={stepIndex >= steps.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce3d6] bg-white text-[#496044] transition hover:bg-[#edf3e6] disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={18} /></button>
                  <button type="button" aria-label="Reset execution" onClick={resetExecution} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce3d6] bg-white text-[#496044] transition hover:bg-[#edf3e6]"><RotateCcw size={15} /></button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[#889384]"><span>Step {stepIndex + 1} of {steps.length}</span><div className="ml-4 h-1.5 max-w-xs flex-1 overflow-hidden rounded-full bg-[#e6ebdf]"><div className="h-full rounded-full bg-[#8eae62] transition-all" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div></div>
            </div>

            <div className="rounded-[26px] border border-[#dfe5d9] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold tracking-[0.2em] text-[#83966f]">EXECUTION TRACE</p><h2 className="mt-2 text-lg font-semibold">Follow the decisions</h2></div><span className="rounded-full bg-[#f0f4e9] px-3 py-1.5 text-xs font-semibold text-[#627b49]">{steps.length} demo steps</span></div>
              <div className="[&_*]:!font-sans [&_button]:!rounded-xl [&_button]:!border-[#e0e6d9] [&_button]:!bg-white [&_button]:!text-[#485e43] [&_button:hover]:!bg-[#f1f5e9] [&_p]:!text-[#778374] [&_h3]:!text-[#2b402d]">
                <ExecutionSteps steps={steps} stepIndex={stepIndex} onSelectStep={selectStep} />
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#e0e8d7] bg-[#f7f9f2] p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f0dc] text-[#58743e]"><Check size={17} /></div><div><p className="text-sm font-semibold text-[#3b5238]">{currentStep?.description}</p><p className="mt-1 text-xs leading-6 text-[#778574]">{currentStep?.reason}</p></div></div>
            </div>
          </section>

          <aside className="space-y-5 2xl:sticky 2xl:top-5">
            <section className="rounded-[26px] border border-[#dfe5d9] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e5] text-[#56753c]"><BookOpen size={19} /></div><div><p className="text-[10px] font-bold tracking-[0.18em] text-[#81936d]">THE IDEA</p><h2 className="mt-1 text-base font-semibold">How Dijkstra works</h2></div></div>
              <p className="mt-4 text-sm leading-7 text-[#768174]">Dijkstra repeatedly chooses the unvisited node with the smallest tentative distance, then checks whether its neighbors can be reached more cheaply.</p>
              <ol className="mt-5 space-y-3">
                {["Set the source distance to zero.", "Choose the closest unvisited node.", "Compare possible routes to its neighbors.", "Update distances when a shorter route is found.", "Continue until the destination is finalized."].map((item, index) => <li key={item} className="flex gap-3 text-xs leading-5 text-[#657160]"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eff4e7] font-mono text-[10px] font-bold text-[#5e7b42]">{index + 1}</span><span className="pt-0.5">{item}</span></li>)}
              </ol>
            </section>

            <section className="rounded-[26px] border border-[#dfe5d9] bg-white p-5 shadow-sm sm:p-6 [&_button]:!rounded-xl [&_h3]:!text-[#2b402d] [&_p]:!text-[#778374]">
              <div className="mb-4"><p className="text-[10px] font-bold tracking-[0.2em] text-[#81936d]">REFERENCE</p><h2 className="mt-2 text-base font-semibold">Implementation & complexity</h2></div>
              <CodePanel />
              <div className="my-4 h-px bg-[#e9ede5]" />
              <ComplexityPanel />
            </section>

            <section className="overflow-hidden rounded-[26px] bg-[#203626] p-5 text-white shadow-lg shadow-[#203626]/10 sm:p-6">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-lime-300"><Route size={15} /> SAMPLE RESULT</div>
              <p className="mt-4 text-xs text-white/55">Shortest route in the supplied sample</p>
              <p className="mt-2 text-xl font-semibold tracking-tight">A <span className="text-lime-300">→</span> B <span className="text-lime-300">→</span> D <span className="text-lime-300">→</span> F</p>
              <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4"><div><p className="text-xs text-white/50">Total edge weight</p><p className="mt-1 text-2xl font-semibold text-lime-300">6</p></div><span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[10px] font-semibold text-lime-200">Sample only</span></div>
              <p className="mt-4 text-xs leading-5 text-white/45">The supplied execution trace is illustrative. Custom graph results are not recalculated yet.</p>
            </section>
          </aside>
        </div>

        <div className="mt-5 rounded-[26px] border border-[#dfe5d9] bg-white p-4 shadow-sm sm:p-6 [&_h3]:!text-[#2b402d] [&_p]:!text-[#778374]">
          <AlgorithmInsights nodes={nodes} edges={edges} steps={steps} stepIndex={stepIndex} currentStep={currentStep} source={source} destination={destination} shortestPath={currentStep?.path ?? []} />
        </div>
      </div>
    </main>
  );
}