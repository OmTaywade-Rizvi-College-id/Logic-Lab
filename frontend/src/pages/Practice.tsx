import { useMemo, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code2,
  Filter,
  Lightbulb,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";

type Challenge = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  estimatedTime: string;
  points: number;
  question: string;
  answer: string;
  explanation: string;
};

type Feedback = {
  correct: boolean;
  message: string;
};

const challenges: Challenge[] = [
  {
    id: "CH-001",
    title: "Find the Shortest Route",
    description: "Find the minimum distance from a starting node to a destination in a weighted graph.",
    category: "Dijkstra",
    difficulty: "Medium",
    estimatedTime: "20 min",
    points: 100,
    question: "A → B has weight 4, A → C has weight 2, B → D has weight 1, C → D has weight 5. What is the shortest distance from A to D?",
    answer: "5",
    explanation: "The route A → B → D costs 4 + 1 = 5. The alternative A → C → D costs 2 + 5 = 7.",
  },
  {
    id: "CH-002",
    title: "Explore a Network",
    description: "Identify the order in which breadth-first search visits the vertices of a graph.",
    category: "BFS",
    difficulty: "Easy",
    estimatedTime: "10 min",
    points: 50,
    question: "Starting at A, the graph has edges A-B, A-C, B-D, and C-E. Visit A's neighbors in alphabetical order. Which node is visited second?",
    answer: "B",
    explanation: "BFS visits A first, then enqueues B and C. With alphabetical neighbor order, B is visited second.",
  },
  {
    id: "CH-003",
    title: "Dive Into the Graph",
    description: "Understand how depth-first search explores a branch before backtracking.",
    category: "DFS",
    difficulty: "Easy",
    estimatedTime: "10 min",
    points: 50,
    question: "Starting at A, the graph has edges A-B, A-C, B-D, and C-E. If DFS visits alphabetical neighbors first, which node is visited second?",
    answer: "B",
    explanation: "DFS starts at A and follows its first alphabetical neighbor, B.",
  },
  {
    id: "CH-004",
    title: "Optimize Your Backpack",
    description: "Choose items to maximize total value without exceeding the carrying capacity.",
    category: "Knapsack",
    difficulty: "Hard",
    estimatedTime: "30 min",
    points: 150,
    question: "A bag has capacity 5. Item A weighs 2 and is worth 3; item B weighs 3 and is worth 4. What is the maximum value?",
    answer: "7",
    explanation: "Both items fit exactly within capacity 5, giving a total value of 3 + 4 = 7.",
  },
  {
    id: "CH-005",
    title: "Connect Every Location",
    description: "Choose edges that connect all vertices with minimum total cost and no cycles.",
    category: "MST",
    difficulty: "Medium",
    estimatedTime: "20 min",
    points: 100,
    question: "Three vertices A, B, and C have edge weights AB = 2, BC = 3, and AC = 8. What is the minimum spanning tree's total weight?",
    answer: "5",
    explanation: "Select AB and BC. Their combined weight is 2 + 3 = 5, connecting all vertices without a cycle.",
  },
  {
    id: "CH-006",
    title: "Spot the Shorter Path",
    description: "Compare alternative paths and decide whether a distance should be updated.",
    category: "Dijkstra",
    difficulty: "Hard",
    estimatedTime: "25 min",
    points: 150,
    question: "The current distance to C is 10. A route to B costs 3, and edge B-C costs 4. What should the updated distance to C be?",
    answer: "7",
    explanation: "The route through B costs 3 + 4 = 7, which is less than the current distance of 10.",
  },
];

const categories = ["All Topics", "Dijkstra", "BFS", "DFS", "Knapsack", "MST"];
const difficulties = ["All Levels", "Easy", "Medium", "Hard"];

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Hard: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function Practice() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Topics");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [attemptedIds, setAttemptedIds] = useState<string[]>([]);

  const filteredChallenges = useMemo(() => {
    const term = search.trim().toLowerCase();

    return challenges.filter((challenge) => {
      const matchesSearch =
        !term ||
        challenge.title.toLowerCase().includes(term) ||
        challenge.description.toLowerCase().includes(term) ||
        challenge.category.toLowerCase().includes(term);
      const matchesCategory = category === "All Topics" || challenge.category === category;
      const matchesDifficulty = difficulty === "All Levels" || challenge.difficulty === difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, category, difficulty]);

  function openChallenge(challenge: Challenge) {
    setSelectedChallenge(challenge);
    setAnswer("");
    setFeedback(null);
    setAttemptedIds((current) => current.includes(challenge.id) ? current : [...current, challenge.id]);
  }

  function checkAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChallenge) return;

    if (!answer.trim()) {
      setFeedback({ correct: false, message: "Enter an answer before checking." });
      return;
    }

    const correct = answer.trim().toLowerCase() === selectedChallenge.answer.trim().toLowerCase();
    setFeedback({
      correct,
      message: correct ? "Correct! Great work. Here's why:" : "Not quite. Review the explanation and try again.",
    });

    if (correct) {
      setSolvedIds((current) => current.includes(selectedChallenge.id) ? current : [...current, selectedChallenge.id]);
    }
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) setSelectedChallenge(null);
  }

  function clearFilters() {
    setSearch("");
    setCategory("All Topics");
    setDifficulty("All Levels");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f0] px-4 pb-14 pt-8 text-[#19271e] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="relative overflow-hidden rounded-[30px] border border-[#e1e6da] bg-white px-6 py-8 shadow-sm sm:px-9 sm:py-10 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-[#dcebc7]/60 blur-[80px]" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe5d0] bg-[#f4f7ee] px-3 py-2 text-[10px] font-bold tracking-[0.18em] text-[#627c45] sm:text-xs"><Sparkles size={14} className="text-[#6e923f]" /> PRACTICE. EXPERIMENT. IMPROVE.</div>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-5xl lg:text-6xl">A little practice.<br /><span className="font-serif font-normal italic text-[#668344]">A lot more clarity.</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#768174] sm:text-base">Solve focused algorithm challenges, test your reasoning, and use every explanation to understand the logic more deeply.</p>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-2xl bg-[#203626] px-5 py-4 text-white shadow-lg shadow-[#203626]/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/15 text-lime-300"><Trophy size={20} /></div>
              <div><p className="text-[10px] font-semibold tracking-[0.15em] text-white/50">YOUR PROGRESS</p><p className="mt-1 text-lg font-semibold">{solvedIds.length} <span className="text-sm font-normal text-white/55">/ {challenges.length} solved</span></p></div>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-[#e3e7de] bg-white p-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e5] text-[#58783f]"><Target size={20} /></div><div><p className="text-xs text-[#899385]">CHALLENGES</p><p className="mt-1 text-xl font-semibold">{challenges.length}</p></div></div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#e3e7de] bg-white p-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff2d8] text-[#9b722a]"><Zap size={20} /></div><div><p className="text-xs text-[#899385]">ATTEMPTED</p><p className="mt-1 text-xl font-semibold">{attemptedIds.length}</p></div></div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#e3e7de] bg-white p-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e1f3e9] text-[#347b5b]"><CheckCircle2 size={20} /></div><div><p className="text-xs text-[#899385]">COMPLETION</p><p className="mt-1 text-xl font-semibold">{Math.round((solvedIds.length / challenges.length) * 100)}<span className="ml-0.5 text-sm text-[#899385]">%</span></p></div></div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="text-[10px] font-bold tracking-[0.23em] text-[#789247]">PICK YOUR NEXT STEP</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Explore challenges<span className="text-[#809957]">.</span></h2><p className="mt-3 text-sm leading-6 text-[#778176]">Find a topic, choose a difficulty, and start experimenting.</p></div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dfe5d9] bg-white px-4 py-2.5 text-xs font-semibold text-[#667560]"><Filter size={14} /> {filteredChallenges.length} results</span>
          </div>

          <div className="mt-7 grid gap-3 lg:grid-cols-[minmax(0,1fr)_210px_190px]">
            <label className="flex items-center gap-3 rounded-2xl border border-[#dfe5d9] bg-white px-4 py-3.5 shadow-sm transition focus-within:border-[#94ad7a] focus-within:shadow-md"><Search size={18} className="shrink-0 text-[#809078]" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, topic, or idea..." aria-label="Search challenges" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0a79c]" />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")} className="rounded-lg p-1 text-[#879180] hover:bg-[#f0f4e9]"><X size={15} /></button>}</label>
            <label className="flex items-center gap-3 rounded-2xl border border-[#dfe5d9] bg-white px-4 py-3.5 shadow-sm"><SlidersHorizontal size={16} className="shrink-0 text-[#809078]" /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by topic" className="w-full bg-transparent text-sm font-medium text-[#4e5f4d] outline-none">{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="flex items-center gap-3 rounded-2xl border border-[#dfe5d9] bg-white px-4 py-3.5 shadow-sm"><Filter size={16} className="shrink-0 text-[#809078]" /><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} aria-label="Filter by difficulty" className="w-full bg-transparent text-sm font-medium text-[#4e5f4d] outline-none">{difficulties.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${category === item ? "border-[#203626] bg-[#203626] text-white" : "border-[#dfe5d9] bg-white text-[#657260] hover:border-[#b8c9a7] hover:bg-[#f0f5e8]"}`}>{item}</button>)}
          </div>

          {filteredChallenges.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredChallenges.map((challenge) => {
                const isSolved = solvedIds.includes(challenge.id);
                const isAttempted = attemptedIds.includes(challenge.id);
                return (
                  <article key={challenge.id} className="group flex min-h-[315px] flex-col rounded-[25px] border border-[#e0e5da] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#bacba9] hover:shadow-xl hover:shadow-[#223624]/5 sm:p-6">
                    <div className="flex items-start justify-between gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3e5] text-[#56753c] transition group-hover:bg-[#203626] group-hover:text-lime-300"><Code2 size={21} /></div><span className="font-mono text-xs text-[#9ba597]">{challenge.id}</span></div>
                    <div className="mt-6 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${difficultyStyles[challenge.difficulty]}`}>{challenge.difficulty}</span><span className="rounded-full bg-[#f1f4ec] px-2.5 py-1 text-[10px] font-semibold text-[#697862]">{challenge.category}</span>{isSolved && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><CheckCircle2 size={12} /> Solved</span>}</div>
                    <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-[#27392a]">{challenge.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#7b8578]">{challenge.description}</p>
                    <div className="mt-auto pt-6"><div className="flex items-center justify-between border-t border-[#edf0e9] py-4 text-xs text-[#8a9484]"><span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {challenge.estimatedTime}</span><span className="font-semibold text-[#61784b]">+{challenge.points} points</span></div><button type="button" onClick={() => openChallenge(challenge)} className="flex w-full items-center justify-between rounded-xl bg-[#203626] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#31513a]"><span>{isSolved ? "Review challenge" : isAttempted ? "Continue challenge" : "Start challenge"}</span><ArrowRight size={16} className="transition group-hover:translate-x-1" /></button></div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[25px] border border-dashed border-[#d6dfce] bg-white/75 px-6 py-14 text-center"><Search className="mx-auto h-8 w-8 text-[#89977f]" /><h3 className="mt-4 text-lg font-semibold">No matching challenges</h3><p className="mt-2 text-sm text-[#7c8678]">Try a different search or reset your filters.</p><button type="button" onClick={clearFilters} className="mt-5 rounded-full bg-[#203626] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#31513a]">Clear all filters</button></div>
          )}
        </section>

        <section className="mt-12 overflow-hidden rounded-[28px] bg-[#203626] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-300/15 text-lime-300"><Lightbulb size={22} /></div><div><p className="text-[10px] font-bold tracking-[0.2em] text-lime-300">LEARN FROM EVERY ATTEMPT</p><h2 className="mt-2 text-xl font-semibold">The goal is understanding, not just the answer.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Review the explanation after each correct response, then try another problem to reinforce the concept.</p></div></div><div className="flex items-center gap-2 text-sm font-semibold text-lime-200"><Trophy size={17} /> Keep progressing <ArrowUpRight size={16} /></div></div>
        </section>
      </div>

      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#101b13]/55 p-4 backdrop-blur-sm" onMouseDown={closeOnBackdrop}>
          <section role="dialog" aria-modal="true" aria-labelledby="challenge-modal-title" className="my-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-[#e0e6d9] bg-[#fbfcf8] shadow-2xl shadow-black/20">
            <div className="relative overflow-hidden bg-[#203626] px-6 py-6 text-white sm:px-8"><div aria-hidden="true" className="absolute -right-12 -top-20 h-48 w-48 rounded-full bg-lime-300/10 blur-3xl" /><div className="relative flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold tracking-[0.2em] text-lime-300">{selectedChallenge.id} / {selectedChallenge.category}</p><h2 id="challenge-modal-title" className="mt-3 text-2xl font-semibold tracking-tight">{selectedChallenge.title}</h2><div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/80">{selectedChallenge.difficulty}</span><span className="inline-flex items-center gap-1.5 text-xs text-white/55"><Clock3 size={13} /> {selectedChallenge.estimatedTime}</span></div></div><button type="button" aria-label="Close challenge" onClick={() => setSelectedChallenge(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/15"><X size={18} /></button></div></div>
            <div className="p-6 sm:p-8"><p className="text-[10px] font-bold tracking-[0.19em] text-[#82946e]">THE PROBLEM</p><p className="mt-3 text-base leading-7 text-[#394b3a]">{selectedChallenge.question}</p><form onSubmit={checkAnswer} className="mt-6"><label htmlFor="challenge-answer" className="text-sm font-semibold text-[#52634e]">Your answer</label><input id="challenge-answer" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback(null); }} placeholder="Type your answer here..." autoComplete="off" className="mt-2 w-full rounded-2xl border border-[#dce4d5] bg-white px-4 py-3.5 text-sm text-[#26392a] outline-none transition placeholder:text-[#a0a99a] focus:border-[#8eaa73] focus:ring-4 focus:ring-[#e8f0de]" /><button type="submit" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#203626] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#31513a]">Check answer <ArrowRight size={16} /></button></form>
              {feedback && <div role="status" className={`mt-5 rounded-2xl border p-4 ${feedback.correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><div className={`flex items-start gap-2 text-sm font-semibold ${feedback.correct ? "text-emerald-800" : "text-amber-800"}`}>{feedback.correct && <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}{feedback.message}</div>{feedback.correct ? <p className="mt-2 text-sm leading-6 text-emerald-900/75">{selectedChallenge.explanation}</p> : <p className="mt-2 text-xs leading-5 text-amber-800/70">Take another look at the given weights or visit order, then try again.</p>}</div>}
              <div className="mt-5 flex items-center justify-between border-t border-[#e9ede4] pt-4 text-xs text-[#849080]"><span className="inline-flex items-center gap-1.5"><Trophy size={14} className="text-[#8b9b67]" /> {selectedChallenge.points} points</span><span>Work through the logic first.</span></div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}