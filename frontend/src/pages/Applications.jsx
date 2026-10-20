

import {
  ArrowRight,
  ArrowUpRight,
  Network,
  Route,
  Boxes,
  GitBranch,
  Clock3,
  Gauge,
  Lightbulb,
  CheckCircle2,
  Workflow,
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
  {
    icon: Workflow,
    title: "Input",
    description: "Represent a practical problem using nodes, edges, values, or constraints.",
  },
  {
    icon: Gauge,
    title: "Execution",
    description: "Run an algorithm to evaluate possible choices and update its state.",
  },
  {
    icon: Lightbulb,
    title: "Understanding",
    description: "Inspect the decisions and learn why the algorithm reaches its result.",
  },
];

export default function Applications() {
  return (
    <main className="page applications-page">
      <section className="applications-hero">
        <div className="applications-hero-copy">
          <p className="eyebrow">
            <span className="hero-dot" />
            ALGORITHMS BEYOND THE CLASSROOM
          </p>

          <h1>
            From abstract logic
            <br />
            to <span className="gradient-text">real-world impact.</span>
          </h1>

          <p className="applications-intro">
            Algorithms power the systems we use every day.
            Explore how the right algorithm transforms a practical
            problem into a solution you can understand, visualize,
            and experiment with.
          </p>

          <a className="applications-primary" href="#application-library">
            Explore applications <ArrowRight size={18} />
          </a>

          <div className="applications-hero-meta">
            <span><CheckCircle2 size={15} /> Practical examples</span>
            <span><Network size={15} /> Interactive learning</span>
          </div>
        </div>

        <div className="applications-hero-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <svg
            className="applications-network"
            viewBox="0 0 420 320"
            role="img"
            aria-label="Illustration of connected locations in a network"
          >
            <defs>
              <linearGradient id="appEdgeGradient">
                <stop offset="0%" stopColor="#73f0b8" />
                <stop offset="100%" stopColor="#29cde6" />
              </linearGradient>
            </defs>

            <g className="app-edges">
              <line x1="55" y1="160" x2="145" y2="75" />
              <line x1="55" y1="160" x2="145" y2="245" />
              <line x1="145" y1="75" x2="240" y2="130" />
              <line x1="145" y1="245" x2="240" y2="130" />
              <line x1="145" y1="75" x2="335" y2="65" />
              <line x1="240" y1="130" x2="335" y2="65" />
              <line x1="240" y1="130" x2="340" y2="240" />
              <line x1="145" y1="245" x2="340" y2="240" />
            </g>

            {[
              { id: "A", x: 55, y: 160 },
              { id: "B", x: 145, y: 75 },
              { id: "C", x: 145, y: 245 },
              { id: "D", x: 240, y: 130 },
              { id: "E", x: 340, y: 240 },
              { id: "F", x: 335, y: 65 },
            ].map((node) => (
              <g key={node.id}>
                <circle
                  className={`app-node-circle ${node.id === "A" || node.id === "D" ? "app-node-highlight" : ""}`}
                  cx={node.x}
                  cy={node.y}
                  r="22"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="app-node-label"
                >
                  {node.id}
                </text>
              </g>
            ))}
          </svg>

          <div className="visual-caption">
            <span className="hero-dot" />
            Connected ideas. Meaningful outcomes.
          </div>
        </div>
      </section>

      <section className="applications-principles">
        {principles.map(({ icon: Icon, title, description }, index) => (
          <article className="principle-card" key={title}>
            <div className="principle-top">
              <span>0{index + 1}</span>
              <Icon size={21} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section
        className="application-library"
        id="application-library"
      >
        <div className="application-section-heading">
          <div>
            <p className="eyebrow">THE APPLICATION LIBRARY</p>
            <h2>Algorithms at work.</h2>
            <p>
              Explore four practical problem areas and the algorithms
              that help solve them.
            </p>
          </div>

          <span className="library-count">04 MODULES</span>
        </div>

        <div className="application-grid">
          {applications.map((item) => {
            const Icon = item.icon;

            return (
              <article
                className={`application-card application-${item.color}`}
                key={item.id}
              >
                <div className="application-card-top">
                  <div className="application-icon">
                    <Icon size={24} />
                  </div>
                  <span className="application-number">{item.number}</span>
                </div>

                <p className="application-category">{item.category}</p>

                <h3>{item.title}</h3>
                <h4>{item.subtitle}</h4>

                <p className="application-description">
                  {item.description}
                </p>

                <div className="application-tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="application-divider" />

                <div className="application-meta">
                  <span>ALGORITHM</span>
                  <strong>{item.algorithm}</strong>
                </div>

                <div className="application-meta">
                  <span>TIME COMPLEXITY</span>
                  <strong>{item.complexity}</strong>
                </div>

                <div className="application-example">
                  <Clock3 size={15} />
                  <span>{item.example}</span>
                </div>

                {item.id === "navigation" ? (
                  <Link
                    className="application-link"
                    to="/route-lab"
                  >
                    Explore in Route Lab <ArrowUpRight size={17} />
                  </Link>
                ) : (
                  <Link
                    className="application-link"
                    to={`/algorithms?category=${encodeURIComponent(item.id)}`}
                  >
                    Explore algorithm <ArrowUpRight size={17} />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="applications-bottom-cta">
        <div className="cta-icon"><Lightbulb size={25} /></div>

        <div>
          <p className="eyebrow">YOUR NEXT DISCOVERY</p>
          <h2>Don't just learn the logic. Explore it.</h2>
          <p>
            Start with a graph, change the inputs, and see how an
            algorithm responds.
          </p>
        </div>

        <Link to="/route-lab" className="applications-primary">
          Open Route Lab <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
