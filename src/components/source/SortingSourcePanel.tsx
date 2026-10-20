import SourceCodeViewer, {
  type SourceLanguage,
} from "./SourceCodeViewer";

import { getAlgorithm } from "../../algorithms/algorithmRegistry";

import type {
  SortingAlgorithmId,
  SortingStep,
} from "../../types";

interface Props {
  algorithm: SortingAlgorithmId;
  step: SortingStep | null;
}

export default function SortingSourcePanel({
  algorithm,
  step,
}: Props) {
  const config = getAlgorithm(algorithm);
  const source = config.sourceCode;

  // Convert optional source strings into the complete shape required by SourceCodeViewer.
  const code: Record<SourceLanguage, string> =
    typeof source === "string"
      ? {
          typescript: source,
          cpp: "// C++ implementation is not available yet.",
          python: "# Python implementation is not available yet.",
        }
      : {
          typescript:
            source.typescript ??
            "// TypeScript source is not available yet.",
          cpp:
            source.cpp ??
            "// C++ implementation is not available yet.",
          python:
            source.python ??
            "# Python implementation is not available yet.",
        };

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-[#203626]">
          Source code
        </h2>

        <p className="text-sm text-[#73836d]">
          {config.label}: inspect the implementation alongside execution.
        </p>
      </div>

      <SourceCodeViewer
        title={`${config.label} — Source Code`}
        code={code}
        activeLine={step?.sourceLine}
      />
    </section>
  );
}