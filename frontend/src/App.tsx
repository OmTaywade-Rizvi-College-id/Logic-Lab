
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import ExploreAlgorithms from "./pages/ExploreAlgorithms";
import RouteLab from "./pages/RouteLab";
import Applications from "./pages/Applications";
import CodeComplexity from "./pages/CodeComplexity";
import Practice from "./pages/Practice";
import About from "./pages/About";
import Login from "./pages/Login";

function NotFound() {
  return (
    <main className="page not-found-page">
      <div className="not-found-content">
        <span className="eyebrow">404 · PATH NOT FOUND</span>

        <h1>
          Lost in the <span className="gradient-text">logic?</span>
        </h1>

        <p>
          This page doesn't exist yet. Return to the lab and
          continue exploring algorithms.
        </p>

        <a href="/" className="btn-primary">
          Back to Home
        </a>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<ExploreAlgorithms />} />
          <Route path="/route-lab" element={<RouteLab />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/code-complexity" element={<CodeComplexity />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
