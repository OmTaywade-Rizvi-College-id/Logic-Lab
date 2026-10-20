

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import ChallengeCard from "../components/ChallengeCard";
import ProgressPanel from "../components/ProgressPanel";
import "./Practice.css";

const challenges = [
  {
    id: "CH-001",
    title: "Find the Shortest Route",
    description:
      "Find the minimum distance from a starting node to a destination in a weighted graph.",
    category: "Dijkstra",
    difficulty: "Medium",
    estimatedTime: "20 min",
    points: 100,
    question:
      "A → B has weight 4, A → C has weight 2, B → D has weight 1, C → D has weight 5. What is the shortest distance from A to D?",
    answer: "5",
    explanation:
      "The route A → B → D costs 4 + 1 = 5. The alternative A → C → D costs 2 + 5 = 7.",
  },
  {
    id: "CH-002",
    title: "Explore a Network",
    description:
      "Identify the order in which a breadth-first search visits the vertices of a graph.",
    category: "BFS",
    difficulty: "Easy",
    estimatedTime: "10 min",
    points: 50,
    question:
      "Starting at A, the graph has edges A-B, A-C, B-D, and C-E. Visit A's neighbors in alphabetical order. Which node is visited second?",
    answer: "B",
    explanation:
      "BFS visits A first, then enqueues B and C. With alphabetical neighbor order, B is visited second.",
  },
  {
    id: "CH-003",
    title: "Dive Into the Graph",
    description:
      "Understand how depth-first search explores a branch before backtracking.",
    category: "DFS",
    difficulty: "Easy",
    estimatedTime: "10 min",
    points: 50,
    question:
      "Starting at A, the graph has edges A-B, A-C, B-D, and C-E. If DFS visits alphabetical neighbors first, which node is visited second?",
    answer: "B",
    explanation:
      "DFS starts at A and follows its first alphabetical neighbor, B.",
  },
  {
    id: "CH-004",
    title: "Optimize Your Backpack",
    description:
      "Choose items to maximize total value without exceeding the carrying capacity.",
    category: "Knapsack",
    difficulty: "Hard",
    estimatedTime: "30 min",
    points: 150,
    question:
      "A bag has capacity 5. Item A weighs 2 and is worth 3; item B weighs 3 and is worth 4. What is the maximum value?",
    answer: "7",
    explanation:
      "Both items fit exactly within capacity 5, giving a total value of 3 + 4 = 7.",
  },
  {
    id: "CH-005",
    title: "Connect Every Location",
    description:
      "Choose edges that connect all vertices with minimum total cost and no cycles.",
    category: "MST",
    difficulty: "Medium",
    estimatedTime: "20 min",
    points: 100,
    question:
      "Three vertices A, B, and C have edge weights AB = 2, BC = 3, and AC = 8. What is the minimum spanning tree's total weight?",
    answer: "5",
    explanation:
      "Select AB and BC. Their combined weight is 2 + 3 = 5, connecting all vertices without a cycle.",
  },
  {
    id: "CH-006",
    title: "Spot the Shorter Path",
    description:
      "Compare alternative paths and decide whether a distance should be updated.",
    category: "Dijkstra",
    difficulty: "Hard",
    estimatedTime: "25 min",
    points: 150,
    question:
      "The current distance to C is 10. A route to B costs 3, and edge B-C costs 4. What should the updated distance to C be?",
    answer: "7",
    explanation:
      "The route through B costs 3 + 4 = 7, which is less than the current distance of 10.",
  },
];

const categories = [
  "All Topics",
  "Dijkstra",
  "BFS",
  "DFS",
  "Knapsack",
  "MST",
];

const difficulties = ["All Levels", "Easy", "Medium", "Hard"];

export default function Practice() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Topics");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [solvedIds, setSolvedIds] = useState([]);
  const [attemptedIds, setAttemptedIds] = useState([]);

  const filteredChallenges = useMemo(() => {
    const term = search.trim().toLowerCase();

    return challenges.filter((challenge) => {
      const matchesSearch =
        !term ||
        challenge.title.toLowerCase().includes(term) ||
        challenge.description.toLowerCase().includes(term) ||
        challenge.category.toLowerCase().includes(term);

      const matchesCategory =
        category === "All Topics" ||
        challenge.category === category;

      const matchesDifficulty =
        difficulty === "All Levels" ||
        challenge.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, category, difficulty]);

  function openChallenge(challenge) {
    setSelectedChallenge(challenge);
    setAnswer("");
    setFeedback(null);

    setAttemptedIds((current) =>
      current.includes(challenge.id)
        ? current
        : [...current, challenge.id]
    );
  }

  function checkAnswer(event) {
    event.preventDefault();

    if (!answer.trim()) {
      setFeedback({
        correct: false,
        message: "Enter an answer before checking.",
      });
      return;
    }

    const correct =
      answer.trim().toLowerCase() ===
      selectedChallenge.answer.trim().toLowerCase();

    setFeedback({
      correct,
      message: correct
        ? "Correct! Great work. Here's why:"
        : "Not quite. Review the explanation and try again.",
    });

    if (correct) {
      setSolvedIds((current) =>
        current.includes(selectedChallenge.id)
          ? current
          : [...current, selectedChallenge.id]
      );
    }
  }

  return (
    <main className="page practice-page">
      <header className="practice-heading">
        <div>
          <p className="eyebrow">PRACTICE. EXPERIMENT. IMPROVE.</p>
          <h1>
            Practice <span className="gradient-text">& Challenges</span>
          </h1>
          <p>
            Put your algorithm knowledge to the test.
            Solve problems, understand mistakes, and strengthen your logic.
          </p>
        </div>

        <div className="practice-heading-art">
          <Lightbulb size={40} />
          <span>Think logically.</span>
          <span>Solve confidently.</span>
        </div>
      </header>

      <ProgressPanel
        totalChallenges={challenges.length}
        solvedCount={solvedIds.length}
        attemptedCount={attemptedIds.length}
      />

      <section className="practice-challenges">
        <div className="practice-section-heading">
          <div>
            <p className="eyebrow">YOUR NEXT CHALLENGE</p>
            <h2>Explore Challenges</h2>
            <p>Choose a topic and find a problem that suits you.</p>
          </div>

          <span className="practice-result-count">
            {filteredChallenges.length} challenges
          </span>
        </div>

        <div className="practice-filters">
          <label className="practice-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search challenges..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}
          </label>

          <label className="practice-select">
            <SlidersHorizontal size={16} />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by topic"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="practice-select">
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              aria-label="Filter by difficulty"
            >
              {difficulties.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="practice-topic-chips">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "practice-chip active"
                  : "practice-chip"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredChallenges.length > 0 ? (
          <div className="practice-challenge-grid">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isSolved={solvedIds.includes(challenge.id)}
                onSolve={openChallenge}
              />
            ))}
          </div>
        ) : (
          <div className="practice-empty-state">
            <Search size={30} />
            <h3>No challenges found</h3>
            <p>Try another search term or change your filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All Topics");
                setDifficulty("All Levels");
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {selectedChallenge && (
        <div
          className="practice-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedChallenge(null);
            }
          }}
        >
          <section
            className="practice-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-modal-title"
          >
            <div className="practice-modal-header">
              <div>
                <p className="eyebrow">
                  {selectedChallenge.id} · {selectedChallenge.category}
                </p>
                <h2 id="practice-modal-title">
                  {selectedChallenge.title}
                </h2>
              </div>

              <button
                className="practice-modal-close"
                aria-label="Close challenge"
                onClick={() => setSelectedChallenge(null)}
              >
                <X size={20} />
              </button>
            </div>

            <p className="practice-modal-question">
              {selectedChallenge.question}
            </p>

            <form onSubmit={checkAnswer}>
              <label htmlFor="challenge-answer">
                Your answer
              </label>

              <input
                id="challenge-answer"
                value={answer}
                onChange={(event) => {
                  setAnswer(event.target.value);
                  setFeedback(null);
                }}
                placeholder="Enter your answer..."
                autoComplete="off"
              />

              <button className="practice-submit" type="submit">
                Check Answer <ArrowRight size={17} />
              </button>
            </form>

            {feedback && (
              <div
                className={
                  feedback.correct
                    ? "practice-feedback correct"
                    : "practice-feedback incorrect"
                }
                role="status"
              >
                <strong>
                  {feedback.correct ? (
                    <><CheckCircle2 size={17} /> {feedback.message}</>
                  ) : feedback.message}
                </strong>

                {feedback.correct && (
                  <p>{selectedChallenge.explanation}</p>
                )}
              </div>
            )}

            <p className="practice-modal-hint">
              Tip: Work through the logic before checking your answer.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
