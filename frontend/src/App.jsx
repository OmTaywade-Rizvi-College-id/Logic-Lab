
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import ExploreAlgorithms from "./pages/ExploreAlgorithms";
import RouteLab from "./pages/RouteLab";
import Applications from "./pages/Applications";
import CodeComplexity from "./pages/CodeComplexity";
import Practice from "./pages/Practice";
import About from "./pages/About";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<ExploreAlgorithms />} />
          <Route path="route-lab" element={<RouteLab />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/code-complexity" element={<CodeComplexity />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
