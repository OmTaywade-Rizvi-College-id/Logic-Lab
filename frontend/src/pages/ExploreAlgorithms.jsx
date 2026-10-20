

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import AlgorithmCard from "../components/AlgorithmCard";

const algorithms = [
  {
    title: "Dijkstra's Algorithm",
    category: "Graph",
    difficulty: "Medium",
    description: "Find the shortest path in a weighted graph.",
    application: "Navigation and route planning",
  },
  {
    title: "Breadth-First Search",
    category: "Graph",
    difficulty: "Easy",
    description: "Explore nodes level by level using a queue.",
    application: "Network exploration",
  },
  {
    title: "Depth-First Search",
    category: "Graph",
    difficulty: "Easy",
    description: "Explore a branch deeply before backtracking.",
    application: "Maze solving and connectivity",
  },
  {
    title: "Minimum Spanning Tree",
    category: "Greedy",
    difficulty: "Medium",
    description: "Connect all vertices with minimum total edge cost.",
    application: "Network infrastructure planning",
  },
  {
    title: "0/1 Knapsack",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description: "Maximize total value within a weight limit.",
    application: "Resource optimization",
  },
  {
    title: "Binary Search",
    category: "Searching",
    difficulty: "Easy",
    description: "Find an element by repeatedly halving a sorted range.",
    application: "Fast data lookup",
  },
  {
    title: "Merge Sort",
    category: "Sorting",
    difficulty: "Medium",
    description: "Sort elements by dividing and merging smaller lists.",
    application: "Efficient data processing",
  },
  {
    title: "Kruskal's Algorithm",
    category: "Greedy",
    difficulty: "Medium",
    description: "Build a minimum spanning tree by selecting edges.",
    application: "Low-cost network connections",
  },
  {
    title: "A* Search",
    category: "Graph",
    difficulty: "Advanced",
    description: "Use path costs and a heuristic to guide a search.",
    application: "Pathfinding and navigation",
  },
];

const categories = [
  "All",
  "Graph",
  "Dynamic Programming",
  "Greedy",
  "Searching",
  "Sorting",
];

function ExploreAlgorithms() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");

  const filteredAlgorithms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return algorithms
      .filter((algorithm) => {
        const matchesSearch = [
          algorithm.title,
          algorithm.category,
          algorithm.description,
          algorithm.application,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

        const matchesCategory =
          category === "All" || algorithm.category === category;

        const matchesDifficulty =
          difficulty === "All" ||
          algorithm.difficulty === difficulty;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesDifficulty
        );
      })
      .sort((a, b) => {
        if (sortBy === "Name") {
          return a.title.localeCompare(b.title);
        }

        if (sortBy === "Difficulty") {
          const rank = { Easy: 1, Medium: 2, Advanced: 3 };
          return rank[a.difficulty] - rank[b.difficulty];
        }

        return 0;
      });
  }, [search, category, difficulty, sortBy]);

  return (
    <div className="page explorer-page">
      <header className="page-header">
        <p className="eyebrow">YOUR LEARNING SPACE</p>
        <h1>Explore <span className="gradient-text">Algorithms</span></h1>
        <p>
          Discover how algorithms work, where they are used,
          and how their decisions lead to a solution.
        </p>
      </header>

      <div className="explorer-toolbar">
        <label className="search-field">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search algorithms, categories or applications..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search algorithms"
          />
        </label>

        <label className="select-wrapper">
          <span>Difficulty</span>
          <select
            className="select-field"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          >
            <option value="All">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>

        <label className="select-wrapper">
          <span>Sort by</span>
          <select
            className="select-field"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="Popular">Featured</option>
            <option value="Name">Name</option>
            <option value="Difficulty">Difficulty</option>
          </select>
        </label>
      </div>

      <div className="filter-row" aria-label="Algorithm categories">
        <SlidersHorizontal size={17} color="#73f0b8" />

        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={
              category === item
                ? "filter-chip active"
                : "filter-chip"
            }
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="results-heading">
        <h2>Algorithm Library</h2>
        <span>{filteredAlgorithms.length} algorithms</span>
      </div>

      {filteredAlgorithms.length > 0 ? (
        <div className="grid-3">
          {filteredAlgorithms.map((algorithm) => (
            <AlgorithmCard
              key={algorithm.title}
              {...algorithm}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} />
          <h3>No algorithms found</h3>
          <p>Try another search or change your filters.</p>
          <button
            className="btn-secondary"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setDifficulty("All");
              setSortBy("Popular");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default ExploreAlgorithms;
