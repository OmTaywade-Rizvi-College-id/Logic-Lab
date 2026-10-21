import {
  FlaskConical, Target, Lightbulb, Workflow, Code2, Database, Monitor,
  Server, GraduationCap, GitBranch, ArrowRight, CheckCircle2, Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Workflow, title: "Step-by-Step Visualization", description: "Watch algorithms execute one step at a time and understand how each decision changes the result." },
  { icon: GitBranch, title: "Interactive Graphs", description: "Explore nodes, edges, and paths to understand graph algorithms such as Dijkstra's shortest-path algorithm." },
  { icon: Code2, title: "Code-Level Understanding", description: "Connect visual execution steps with the corresponding sections of algorithm code." },
  { icon: Lightbulb, title: "Learn by Experimenting", description: "Change inputs, explore different cases, and observe how an algorithm responds." },
];

const technologies = [
  { icon: Monitor, name: "React", role: "Frontend UI", description: "Builds reusable components and interactive pages.", planned: false },
  { icon: Code2, name: "Vite", role: "Development tool", description: "Provides a fast development server and build process.", planned: false },
  { icon: Server, name: "Java Servlets", role: "Backend", description: "Planned backend layer for handling application requests.", planned: true },
  { icon: Database, name: "MySQL", role: "Database", description: "Planned storage for application data and challenges.", planned: true },
];

const workflow = [
  { number: "01", title: "Choose an algorithm", description: "Select an algorithm or learning challenge." },
  { number: "02", title: "Provide input", description: "Work with a graph, dataset, or problem input." },
  { number: "03", title: "Observe execution", description: "Follow the algorithm's decisions step by step." },
  { number: "04", title: "Understand the result", description: "Connect the output with the code and complexity." },
];

const goals = [
  "Understand the logic behind every decision",
  "Connect algorithm code with its execution",
  "Explore different inputs and possible outcomes",
  "Practice problem-solving through challenges",
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#f7f7f0] px-5 py-10 text-[#1d2d21] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <section className="relative overflow-hidden rounded-[30px] bg-[#203626] px-6 py-10 text-white shadow-xl shadow-[#203626]/10 sm:px-10 sm:py-14 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-10 lg:px-12">
          <div className="pointer-events-none absolute -right-12 -top-24 h-80 w-80 rounded-full bg-lime-300/10 blur-[90px]" />
          <div className="relative z-10">
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-[.22em] text-lime-300 sm:text-xs"><FlaskConical size={15}/> ABOUT THE PROJECT</p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-.06em] sm:text-6xl">Making algorithms<br/><span className="font-serif font-normal italic text-lime-200">easier to understand.</span></h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">The Logic Lab is an interactive algorithm learning platform designed to help students move beyond memorizing code and understand what happens behind every algorithmic decision.</p>
            <div className="mt-7 flex flex-wrap gap-2">{["Interactive learning", "Algorithm visualization", "Code analysis"].map((tag) => <span key={tag} className="rounded-full border border-white/15 bg-white/[.05] px-3.5 py-2 text-xs text-white/75">{tag}</span>)}</div>
          </div>
          <div className="relative mt-10 flex min-h-[280px] items-center justify-center overflow-hidden rounded-[26px] border border-white/10 bg-[#14241c] p-5 lg:mt-0">
            <div className="absolute h-48 w-48 rounded-full border border-lime-200/15"/><div className="absolute h-64 w-64 rounded-full border border-emerald-200/10"/><div className="absolute h-80 w-80 rounded-full border border-white/5"/>
            <svg viewBox="0 0 340 250" className="absolute inset-0 h-full w-full" aria-hidden="true"><g stroke="#78967c" strokeOpacity=".55" strokeWidth="1.5"><line x1="55" y1="65" x2="135" y2="125"/><line x1="135" y1="125" x2="240" y2="70"/><line x1="135" y1="125" x2="230" y2="190"/><line x1="240" y1="70" x2="285" y2="145"/><line x1="230" y1="190" x2="285" y2="145"/><line x1="55" y1="65" x2="68" y2="190"/><line x1="68" y1="190" x2="230" y2="190"/></g>{[{x:55,y:65,t:"01"},{x:135,y:125,t:"02"},{x:240,y:70,t:"03"},{x:230,y:190,t:"04"},{x:285,y:145,t:"05"},{x:68,y:190,t:"06"}].map((n)=> <g key={n.t}><circle cx={n.x} cy={n.y} r="20" fill="#2c4630" stroke="#b7e878" strokeOpacity=".8"/><text x={n.x} y={n.y+4} textAnchor="middle" fill="#e4ffc0" fontSize="10" fontWeight="700">{n.t}</text></g>)}</svg>
            <div className="relative z-10 mt-28 rounded-2xl border border-white/10 bg-[#17271c]/90 px-5 py-4 text-center shadow-xl backdrop-blur"><FlaskConical className="mx-auto text-lime-300" size={28}/><p className="mt-2 text-xs font-bold tracking-[.18em]">THE LOGIC LAB</p><p className="mt-1 text-[10px] text-white/50">Explore. Execute. Understand.</p></div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-3xl"><p className="text-[10px] font-bold tracking-[.22em] text-[#789247]">THE PURPOSE</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-5xl">Why <span className="font-serif font-normal italic text-[#668344]">The Logic Lab?</span></h2><p className="mt-4 text-sm leading-7 text-[#778176]">Understanding an algorithm means understanding more than its final answer.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-[26px] border border-[#e0e5d9] bg-white p-6 sm:p-8"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f5eddd] text-[#94703b]"><Target size={23}/></span><h3 className="mt-6 text-xl font-semibold">The problem</h3><p className="mt-3 text-sm leading-7 text-[#778176]">Students can memorize algorithm steps without fully understanding why a particular node is selected, why a path is rejected, or how an input change affects the result.</p></article>
            <article className="rounded-[26px] border border-[#dfe7d5] bg-[#eef3e6] p-6 sm:p-8"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#668344]"><Lightbulb size={23}/></span><h3 className="mt-6 text-xl font-semibold">Our approach</h3><p className="mt-3 text-sm leading-7 text-[#697865]">The Logic Lab brings visualization, code, execution steps, and practical challenges together in one learning environment.</p></article>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="max-w-3xl"><p className="text-[10px] font-bold tracking-[.22em] text-[#789247]">WHAT YOU CAN DO</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-5xl">Learning, made <span className="font-serif font-normal italic text-[#668344]">interactive.</span></h2><p className="mt-4 text-sm leading-7 text-[#778176]">Explore algorithms by observing their behavior, not just reading about them.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, description }, index) => <article key={title} className="rounded-[24px] border border-[#e0e5d9] bg-white p-5 transition hover:-translate-y-1 hover:border-[#c3d4b1] hover:shadow-lg hover:shadow-[#203626]/5 sm:p-6"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf3e4] text-[#688643]"><Icon size={21}/></span><span className="font-mono text-xs text-[#a1aa9b]">0{index+1}</span></div><h3 className="mt-6 text-base font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#788276]">{description}</p></article>)}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="max-w-3xl"><p className="text-[10px] font-bold tracking-[.22em] text-[#789247]">HOW IT WORKS</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-5xl">From input to <span className="font-serif font-normal italic text-[#668344]">insight.</span></h2><p className="mt-4 text-sm leading-7 text-[#778176]">A simple learning journey that connects each step.</p></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {workflow.map((step, index) => <article key={step.number} className="relative rounded-[24px] border border-[#e0e5d9] bg-white p-5 sm:p-6"><span className="font-mono text-xs font-bold text-[#789247]">/{step.number}</span><h3 className="mt-5 text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#788276]">{step.description}</p>{index < workflow.length-1 && <ArrowRight className="absolute right-5 top-5 hidden text-[#b3c39f] xl:block" size={18}/>}</article>)}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="max-w-3xl"><p className="text-[10px] font-bold tracking-[.22em] text-[#789247]">UNDER THE HOOD</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-5xl">Built with <span className="font-serif font-normal italic text-[#668344]">technology.</span></h2><p className="mt-4 text-sm leading-7 text-[#778176]">The tools used to build the interface and planned application architecture.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {technologies.map(({ icon: Icon, name, role, description, planned }) => <article key={name} className="rounded-[24px] border border-[#e0e5d9] bg-white p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf3e4] text-[#688643]"><Icon size={21}/></span><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider ${planned ? "bg-[#f8efdb] text-[#917036]" : "bg-[#e7f3e4] text-[#577c42]"}`}>{planned ? "PLANNED" : "IN USE"}</span></div><h3 className="mt-5 text-lg font-semibold">{name}</h3><p className="mt-1 text-xs font-semibold text-[#718b43]">{role}</p><p className="mt-3 text-sm leading-6 text-[#788276]">{description}</p></article>)}
          </div>
        </section>

        <section className="grid gap-6 rounded-[28px] bg-[#e8efdc] p-6 sm:p-9 lg:grid-cols-[1fr_.8fr] lg:items-center lg:p-12">
          <div><p className="text-[10px] font-bold tracking-[.22em] text-[#789247]">OUR GOAL</p><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">Don't just memorize it.<br/><span className="font-serif font-normal italic text-[#668344]">Understand it.</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-[#6e7c69]">We want learners to become more confident in reasoning about algorithms, tracing their execution, analyzing complexity, and solving problems independently.</p></div>
          <div className="space-y-3">{goals.map((goal) => <div key={goal} className="flex items-center gap-3 rounded-2xl border border-[#d7e2c9] bg-white/75 p-4 text-sm font-medium text-[#53664f]"><CheckCircle2 className="shrink-0 text-[#6f8e43]" size={19}/>{goal}</div>)}</div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-3xl"><p className="text-[10px] font-bold tracking-[.22em] text-[#789247]">BUILT AS A TEAM</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-5xl">One project. <span className="font-serif font-normal italic text-[#668344]">One shared goal.</span></h2><p className="mt-4 text-sm leading-7 text-[#778176]">The Logic Lab brings together interface design, algorithm logic, and application development.</p></div>
          <article className="mt-8 flex flex-col gap-5 rounded-[26px] border border-[#e0e5d9] bg-white p-6 sm:flex-row sm:items-start sm:p-8"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] bg-[#eaf1df] text-[#668344]"><Users size={28}/></span><div><h3 className="text-xl font-semibold">Collaborative development</h3><p className="mt-3 max-w-3xl text-sm leading-7 text-[#778176]">Our project is organized into frontend development, algorithm implementation, backend services, and database integration. Each part contributes to a unified learning experience.</p><div className="mt-5 flex flex-wrap gap-2">{["Frontend", "Algorithms", "Backend", "Database"].map((tag) => <span key={tag} className="rounded-full bg-[#f0f4e9] px-3 py-1.5 text-xs font-semibold text-[#6b7d5e]">{tag}</span>)}</div></div></article>
        </section>

        <section className="relative overflow-hidden rounded-[30px] bg-[#203626] px-6 py-12 text-center text-white sm:px-10 sm:py-16"><div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-lime-300/10 blur-[85px]"/><GraduationCap className="relative mx-auto text-lime-300" size={34}/><h2 className="relative mt-5 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Ready to explore?</h2><p className="relative mx-auto mt-3 max-w-lg text-sm leading-7 text-white/60">Head to the algorithm workspace and see the logic in action.</p><Link to="/algorithms" className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3.5 text-sm font-bold text-[#203626] transition hover:bg-lime-200">Explore algorithms <ArrowRight size={17}/></Link></section>
        <footer className="flex flex-col justify-between gap-3 py-6 text-xs text-[#879083] sm:flex-row"><span className="font-semibold tracking-wide text-[#485b47]">THE LOGIC LAB.</span><span>Explore the process. Understand the logic.</span></footer>
      </div>
    </main>
  );
}