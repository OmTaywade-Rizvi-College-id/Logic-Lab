
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  Compass,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";

import FeatureCard from "../components/FeatureCard";
import AlgorithmCard from "../components/AlgorithmCard";

const algorithms = [
  {
    title: "Dijkstra's Algorithm",
    category: "Graph",
    difficulty: "Medium",
    description:
      "Find the shortest path between nodes in a weighted graph.",
    application: "Navigation and route planning",
  },
  {
    title: "Breadth-First Search",
    category: "Graph",
    difficulty: "Easy",
    description:
      "Explore a graph level by level using a queue.",
    application: "Network exploration",
  },
  {
    title: "Depth-First Search",
    category: "Graph",
    difficulty: "Easy",
    description:
      "Explore branches deeply before backtracking.",
    application: "Maze solving and connectivity",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "Interactive Visualization",
    description:
      "Watch algorithms execute and inspect how their states change.",
  },
  {
    icon: Compass,
    title: "Real-World Applications",
    description:
      "Connect algorithm concepts to navigation, networks, and optimization.",
  },
  {
    icon: Code2,
    title: "Code & Complexity",
    description:
      "Connect each execution step to code and complexity analysis.",
  },
  {
    icon: GraduationCap,
    title: "Practice & Learn",
    description:
      "Strengthen your understanding with guided challenges.",
  },
];

function Home() {
  const [search, setSearch] = useState("");

  const filteredAlgorithms = algorithms.filter((algorithm) =>
    `${algorithm.title} ${algorithm.category} ${algorithm.application}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">WELCOME TO THE LOGIC LAB</p>

          <h1>
            See Algorithms.
            <br />
            Think <span className="gradient-text">in Action.</span>
          </h1>

          <p className="hero-description">
            An interactive platform to understand algorithms
            through visualizations, real-world applications,
            and step-by-step explanations.
          </p>

          <div className="hero-actions">
            <Link to="/algorithms" className="btn-primary">
              Explore Algorithms <ArrowRight size={17} />
            </Link>

            <Link to="/route-lab" className="btn-secondary">
              Try Route Lab
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <svg
            className="hero-graph"
            viewBox="0 0 420 300"
            role="img"
            aria-label="Illustration of connected algorithm graph nodes"
          >
            <defs>
              <linearGradient id="graphLine">
                <stop offset="0%" stopColor="#35a9dc" />
                <stop offset="100%" stopColor="#73f0b8" />
              </linearGradient>
            </defs>

            {[
              [65, 145, 160, 65],
              [160, 65, 265, 105],
              [65, 145, 155, 235],
              [155, 235, 265, 105],
              [160, 65, 315, 220],
              [155, 235, 315, 220],
              [265, 105, 355, 65],
            ].map(([x1, y1, x2, y2], index) => (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#graphLine)"
                strokeWidth="2"
                opacity=".75"
              />
            ))}

            {[
              [65, 145, "A"],
              [160, 65, "B"],
              [155, 235, "C"],
              [265, 105, "D"],
              [315, 220, "E"],
              [355, 65, "F"],
            ].map(([x, y, label], index) => (
              <g key={label}>
                <circle
                  cx={x}
                  cy={y}
                  r="23"
                  fill="#102c25"
                  stroke={index === 0 ? "#73f0b8" : "#38c9dd"}
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={Number(y) + 5}
                  fill="#f0f7f4"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="600"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      <section style={{ marginTop: 34 }}>
        <div className="section-heading">
          <div>
            <h2>Learn by seeing it work</h2>
            <p>Understand the logic behind every decision.</p>
          </div>
        </div>

        <div className="grid-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="stats-grid" aria-label="Platform highlights">
        <div className="stat-card">
          <strong>20+</strong>
          <span>Algorithms planned</span>
        </div>
        <div className="stat-card">
          <strong>5+</strong>
          <span>Learning categories</span>
        </div>
        <div className="stat-card">
          <strong>Real-world</strong>
          <span>Practical applications</span>
        </div>
        <div className="stat-card">
          <strong>Interactive</strong>
          <span>Step-by-step learning</span>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <h2>Explore algorithms</h2>
            <p>Start with a concept and discover how it works.</p>
          </div>

          <Link to="/algorithms" className="card-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <label className="search-field">
          <Search size={19} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search algorithms or applications..."
            aria-label="Search algorithms"
          />
        </label>

        <div className="grid-3" style={{ marginTop: 20 }}>
          {filteredAlgorithms.map((algorithm) => (
            <AlgorithmCard
              key={algorithm.title}
              {...algorithm}
            />
          ))}
        </div>

        {filteredAlgorithms.length === 0 && (
          <p className="empty-state" style={{ marginTop: 20 }}>
            No matching algorithms found. Try another search.
          </p>
        )}
      </section>
    </div>
  );
}

export default Home;
