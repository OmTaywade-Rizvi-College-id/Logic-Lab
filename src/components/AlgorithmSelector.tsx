import { ChevronDown, GitBranch } from "lucide-react";
import { listAlgorithms } from "../algorithms/algorithmRegistry";
import type { AlgorithmId } from "../types";

type Props = {
  value: AlgorithmId;
  onChange: (id: AlgorithmId) => void;
  disabled?: boolean;
};

export default function AlgorithmSelector({
  value,
  onChange,
  disabled = false,
}: Props) {
  const algorithms = listAlgorithms();

  return (
    <label className="block w-full min-w-0">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium text-[#687768]">
        <GitBranch size={14} className="text-[#718b43]" />
        Algorithm
      </span>

      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as AlgorithmId)}
          disabled={disabled}
          aria-label="Select algorithm"
          className="w-full appearance-none rounded-md border border-[#dce4d6] bg-[#f8faf5] px-3 py-2.5 pr-9 text-sm font-medium text-[#203626] outline-none focus:border-[#8ba45e] focus:ring-2 focus:ring-[#8ba45e]/20 disabled:opacity-50"
        >
          {algorithms.map((algorithm) => (
            <option key={algorithm.id} value={algorithm.id}>
              {algorithm.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718b43]"
        />
      </span>
    </label>
  );
}
