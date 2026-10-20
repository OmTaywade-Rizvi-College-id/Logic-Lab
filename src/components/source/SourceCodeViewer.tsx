import { useMemo, useState } from "react";

export type SourceLanguage = "typescript" | "cpp" | "python";

interface SourceCodeViewerProps {
  code: Record<SourceLanguage, string>;
  activeLine?: number;
  title?: string;
}

const LANGUAGES: { label: string; value: SourceLanguage }[] = [
  { label: "TypeScript", value: "typescript" },
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
];

export default function SourceCodeViewer({
  code,
  activeLine,
  title = "Source Code",
}: SourceCodeViewerProps) {
  const [language, setLanguage] = useState<SourceLanguage>("typescript");
  const [lineNumbers, setLineNumbers] = useState(true);
  const [status, setStatus] = useState("");

  const source = code[language] ?? "";
  const lines = useMemo(() => source.split("\n"), [source]);

  async function copySource() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(source);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Copy unavailable. Select the code and copy it manually.");
    }
  }

  function downloadSource() {
    const extension: Record<SourceLanguage, string> = {
      typescript: "ts",
      cpp: "cpp",
      python: "py",
    };

    const blob = new Blob([source], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `algorithm.${extension[language]}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#d8e1d1] bg-[#fbfcf8] shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e1d1] p-4">
        <div>
          <h3 className="font-semibold text-[#203626]">{title}</h3>
          <p className="mt-1 text-xs text-[#73836d]">
            {activeLine && activeLine > 0
              ? `Execution line: ${activeLine}`
              : "Run the algorithm to see the current step."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Source language"
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value as SourceLanguage);
              setStatus("");
            }}
            className="rounded-lg border border-[#cbd6c2] bg-white px-3 py-2 text-sm text-[#263b2b] outline-none transition-colors focus:border-[#789653] focus:ring-2 focus:ring-[#c4e58c]/60"
          >
            {LANGUAGES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={copySource}
            className="rounded-lg border border-[#cbd6c2] bg-[#f0f4e9] px-3 py-2 text-sm font-medium text-[#31482e] transition-colors hover:border-[#9fb581] hover:bg-[#e5edd9]"
          >
            Copy
          </button>

          <button
            type="button"
            onClick={downloadSource}
            className="rounded-lg border border-[#314d35] bg-[#294631] px-3 py-2 text-sm font-medium text-[#f6f8f1] transition-colors hover:bg-[#365a3d]"
          >
            Download
          </button>
        </div>
      </header>

      <div className="flex items-center justify-between border-b border-[#d8e1d1] bg-[#f5f7f0] px-4 py-2">
        <label className="flex items-center gap-2 text-xs text-[#61725b]">
          <input
            type="checkbox"
            checked={lineNumbers}
            onChange={(event) => setLineNumbers(event.target.checked)}
            className="accent-[#668344]"
          />
          Line numbers
        </label>

        <span aria-live="polite" className="text-xs text-[#58723f]">
          {status}
        </span>
      </div>

      <div className="max-h-[520px] overflow-auto bg-[#f8faf5]">
        <pre className="min-w-max py-3 font-mono text-[13px] leading-7">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const active = lineNumber === activeLine;

            return (
              <div
                key={lineNumber}
                className={`flex pr-5 ${
                  active
                    ? "bg-[#e7f1d8] text-[#203626]"
                    : "text-[#3e5140] hover:bg-[#edf2e7]"
                }`}
              >
                {lineNumbers && (
                  <span
                    className={`sticky left-0 w-12 shrink-0 select-none border-r border-[#e0e7da] bg-[#f3f6ee] pr-3 text-right ${
                      active ? "text-[#537936]" : "text-[#9aa792]"
                    }`}
                  >
                    {lineNumber}
                  </span>
                )}

                {active && (
                  <span className="ml-3 mr-2 text-[#668344]" aria-hidden="true">
                    ›
                  </span>
                )}

                <code className="whitespace-pre pr-4">{line || " "}</code>
              </div>
            );
          })}
        </pre>
      </div>

      <footer className="border-t border-[#d8e1d1] bg-[#f5f7f0] px-4 py-3 text-xs text-[#82907b]">
        {lines.length} lines · {language}
      </footer>
    </section>
  );
}