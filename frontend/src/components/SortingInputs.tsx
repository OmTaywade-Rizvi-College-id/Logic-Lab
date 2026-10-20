import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDown, ArrowUp, ListOrdered } from "lucide-react";

interface SortingInputsProps {
  onRun: (values: number[], ascending: boolean) => void;
  busy: boolean;
  initialValues?: number[];
  initialAscending?: boolean;
}

export default function SortingInputs({
  onRun,
  busy,
  initialValues = [8, 3, 5, 1, 9, 2],
  initialAscending = true,
}: SortingInputsProps) {
  const [text, setText] = useState(initialValues.join(", "));
  const [ascending, setAscending] = useState(initialAscending);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(initialValues.join(", "));
    setAscending(initialAscending);
  }, [initialValues, initialAscending]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      setError("Enter at least one integer.");
      return;
    }

    const parts = trimmed.split(/[,\s]+/);
    if (parts.length > 100) {
      setError("Maximum 100 integers are allowed.");
      return;
    }

    const values = parts.map(Number);
    if (
      values.some(
        (value, index) =>
          parts[index] === "" || !Number.isFinite(value) || !Number.isSafeInteger(value),
      )
    ) {
      setError("Use valid integers separated by commas or spaces.");
      return;
    }

    setError(null);
    onRun(values, ascending);
  }

  const directionClass = (active: boolean) =>
    `inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
      active
        ? "border-[#b8d58f] bg-[#edf4e3] text-[#385c2d]"
        : "border-[#e1e7dc] bg-white text-[#758171] hover:bg-[#f4f7ef]"
    }`;

  const valueCount = text.trim() ? text.trim().split(/[,\s]+/).length : 0;

  return (
    <form id="sorting-input-form" onSubmit={submit} className="space-y-4">
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="sorting-values"
            className="flex items-center gap-2 text-sm font-semibold text-[#263a29]"
          >
            <ListOrdered size={16} className="text-[#638640]" />
            Input array
          </label>
          <span className="text-[10px] text-[#899383]">
            Commas or spaces · Max 100 integers
          </span>
        </div>

        <textarea
          id="sorting-values"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (error) setError(null);
          }}
          rows={2}
          maxLength={1200}
          placeholder="Example: 8, 3, 5, 1, 9, 2"
          disabled={busy}
          className="w-full resize-y rounded-xl border border-[#dfe6d8] bg-[#fbfcf8] px-4 py-3 font-mono text-sm leading-6 text-[#35563a] outline-none transition placeholder:text-[#a4ad9e] focus:border-[#9db783] focus:ring-4 focus:ring-[#a9c78d]/20 disabled:opacity-50"
        />

        <div className="mt-2 flex flex-wrap justify-between gap-2 text-[10px] text-[#899383]">
          <span>Negative values and duplicates are allowed.</span>
          <span>{valueCount} values</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ebe2] pt-4">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="mb-2 text-xs font-semibold text-[#758171]">
            Sort direction
          </legend>

          <label className={directionClass(ascending)}>
            <input
              type="radio"
              name="sort-direction"
              checked={ascending}
              disabled={busy}
              onChange={() => setAscending(true)}
              className="accent-[#52783d]"
            />
            <ArrowUp size={14} />
            Ascending
          </label>

          <label className={directionClass(!ascending)}>
            <input
              type="radio"
              name="sort-direction"
              checked={!ascending}
              disabled={busy}
              onChange={() => setAscending(false)}
              className="accent-[#52783d]"
            />
            <ArrowDown size={14} />
            Descending
          </label>
        </fieldset>

        <span className="text-xs font-medium text-[#899383]">
          {busy ? "Executing…" : "Ready to execute"}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-700"
        >
          {error}
        </p>
      )}
    </form>
  );
}