"use client";

import { PRESET_LABELS, type TemplatePreset } from "@/lib/types";

interface TemplatePresetSelectorProps {
  value: TemplatePreset;
  onChange: (value: TemplatePreset) => void;
  disabled?: boolean;
}

const PRESETS: TemplatePreset[] = [null, "minimalist", "bold", "luxury", "playful"];

export function TemplatePresetSelector({ value, onChange, disabled }: TemplatePresetSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Template style
      </label>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p ?? "none"}
            type="button"
            disabled={disabled}
            onClick={() => onChange(p ?? null)}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
              value === p
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500/70 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-500"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {p ? PRESET_LABELS[p] : "Any"}
          </button>
        ))}
      </div>
    </div>
  );
}
