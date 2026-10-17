

import {
  FlaskConical,
  Target,
  Lightbulb,
  Workflow,
  Code2,
  Database,
  Monitor,
  Server,
  GraduationCap,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";

import "./About.css";

const features = [
  {
    icon: Workflow,
    title: "Step-by-Step Visualization",
    description:
      "Watch algorithms execute one step at a time and understand how each decision changes the result.",
  },
  {
    icon: GitBranch,
    title: "Interactive Graphs",
    description:
      "Explore nodes, edges, and paths to understand graph algorithms such as Dijkstra's shortest-path algorithm.",
  },
  {
    icon: Code2,
    title: "Code-Level Understanding",
    description:
      "Connect visual execution steps with the corresponding sections of algorithm code.",
  },
  {
    icon: Lightbulb,
    title: "Learn by Experimenting",
    description:
      "Change inputs, explore different cases, and observe how an algorithm responds.",
  },
];

const technologies = [
  {
    icon: Monitor,
    name: "React",
    role: "Frontend UI",
    description: "Builds reusable components and interactive pages.",
  },
  {
    icon: Code2,
    name: "Vite",
    role: "Development Tool",
    description: "Provides a fast development server and build process.",
  },
  {
    icon: Server,
    name: "Java Servlets",
    role: "Backend",
    description: "Planned backend layer for handling application requests.",
  },
  {
    icon: Database,
    name: "MySQL",
    role: "Database",
    description: "Planned storage for application data and challenges.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Choose an algorithm",
    description: "Select an algorithm or learning challenge.",
  },
  {
    number: "02",
    title: "Provide input",
    description: "Work with a graph, dataset, or problem input.",
  },
  {
    number: "03",
    title: "Observe execution",
    description: "Follow the algorithm's decisions step by step.",
  },
  {
    number: "04",
    title: "Understand the result",
    description: "Connect the output with the code and complexity.",
  },
];

function About() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="eyebrow">
            <FlaskConical size={16} />
            ABOUT THE PROJECT
          </span>

          <h1>
            Making algorithms
            <br />
            <span className="gradient-text">easier to understand.</span>
          </h1>

          <p className="about-hero-description">
            The Logic Lab is an interactive algorithm learning platform
            designed to help students move beyond memorizing code and
            understand what happens behind every algorithmic decision.
          </p>

          <div className="about-hero-tags">
            <span>Interactive Learning</span>
            <span>Algorithm Visualization</span>
            <span>Code Analysis</span>
          </div>
        </div>

        <div className="about-hero-visual">
          <div className="about-orbit orbit-one" />
          <div className="about-orbit orbit-two" />

          <div className="about-core">
            <FlaskConical size={48} strokeWidth={1.5} />
            <span>THE LOGIC LAB</span>
            <small>Explore. Execute. Understand.</small>
          </div>

          <div className="floating-node node-one">01</div>
          <div className="floating-node node-two">02</div>
          <div className="floating-node node-three">
            <GitBranch size={21} />
          </div>
          <div className="floating-node node-four">
            <Code2 size={21} />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="eyebrow">THE PURPOSE</span>
          <h2>Why <span className="gradient-text">The Logic Lab?</span></h2>
          <p>
            Understanding an algorithm means understanding more than its final
            answer.
          </p>
        </div>

        <div className="about-mission-grid">
          <article className="about-mission-card">
            <div className="about-icon-box">
              <Target size={24} />
            </div>
            <h3>The Problem</h3>
            <p>
              Students can memorize algorithm steps without fully understanding
              why a particular node is selected, why a path is rejected, or
              how an input change affects the result.
            </p>
          </article>

          <article className="about-mission-card mission-highlight">
            <div className="about-icon-box">
              <Lightbulb size={24} />
            </div>
            <h3>Our Approach</h3>
            <p>
              The Logic Lab brings visualization, code, execution steps, and
              practical challenges together in one learning environment.
            </p>
          </article>
        </div>
      </section>

      {/* Features */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="eyebrow">WHAT YOU CAN DO</span>
          <h2>Learning, made <span className="gradient-text">interactive.</span></h2>
          <p>
            Explore algorithms by observing their behavior, not just reading
            about them.
          </p>
        </div>

        <div className="about-features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="about-feature-card" key={feature.title}>
                <div className="about-icon-box">
                  <Icon size={23} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>From input to <span className="gradient-text">insight.</span></h2>
          <p>A simple learning journey that connects each step.</p>
        </div>

        <div className="about-workflow">
          {workflow.map((step, index) => (
            <div className="about-workflow-item" key={step.number}>
              <div className="workflow-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>

              {index < workflow.length - 1 && (
                <ArrowRight
                  className="workflow-arrow"
                  size={21}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="eyebrow">UNDER THE HOOD</span>
          <h2>Built with <span className="gradient-text">technology.</span></h2>
          <p>
            The tools used to build the interface and planned application
            architecture.
          </p>
        </div>

        <div className="about-tech-grid">
          {technologies.map((technology) => {
            const Icon = technology.icon;
            const isPlanned = ["Java Servlets", "MySQL"].includes(
              technology.name
            );

            return (
              <article className="about-tech-card" key={technology.name}>
                <div className="about-tech-top">
                  <div className="about-icon-box">
                    <Icon size={23} />
                  </div>
                  <span className={`tech-status ${isPlanned ? "planned" : ""}`}>
                    {isPlanned ? "PLANNED" : "IN USE"}
                  </span>
                </div>

                <h3>{technology.name}</h3>
                <span className="tech-role">{technology.role}</span>
                <p>{technology.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Learning goals */}
      <section className="about-section about-goals-section">
        <div className="about-goals-content">
          <span className="eyebrow">OUR GOAL</span>
          <h2>
            Don't just memorize it.
            <br />
            <span className="gradient-text">Understand it.</span>
          </h2>
          <p>
            We want learners to become more confident in reasoning about
            algorithms, tracing their execution, analyzing complexity, and
            solving problems independently.
          </p>
        </div>

        <div className="about-goals-list">
          {[
            "Understand the logic behind every decision",
            "Connect algorithm code with its execution",
            "Explore different inputs and possible outcomes",
            "Practice problem-solving through challenges",
          ].map((goal) => (
            <div className="about-goal-item" key={goal}>
              <CheckCircle2 size={20} />
              <span>{goal}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="about-section about-team-section">
        <div className="about-section-heading">
          <span className="eyebrow">BUILT AS A TEAM</span>
          <h2>One project. <span className="gradient-text">One shared goal.</span></h2>
          <p>
            The Logic Lab brings together interface design, algorithm logic,
            and application development.
          </p>
        </div>

        <div className="about-team-card">
          <div className="about-team-icon">
            <Users size={30} />
          </div>
          <div>
            <h3>Collaborative Development</h3>
            <p>
              Our project is organized into frontend development, algorithm
              implementation, backend services, and database integration.
              Each part contributes to a unified learning experience.
            </p>
            <div className="about-team-tags">
              <span>Frontend</span>
              <span>Algorithms</span>
              <span>Backend</span>
              <span>Database</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="about-footer-cta">
        <GraduationCap size={34} />
        <h2>Ready to explore?</h2>
        <p>
          Head to the algorithm workspace and see the logic in action.
        </p>
        <a href="/algorithms" className="about-cta-button">
          Explore Algorithms <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}

export default About;
