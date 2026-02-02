"use client";

import { PAGE_TYPE_LABELS, type PageType } from "@/lib/types";

interface PageTypeSelectorProps {
  value: PageType;
  onChange: (value: PageType) => void;
  disabled?: boolean;
}

export function PageTypeSelector({ value, onChange, disabled }: PageTypeSelectorProps) {
  return (
    <div className="flex gap-2 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800">
      {(Object.keys(PAGE_TYPE_LABELS) as PageType[]).map((type) => (
        <button
          key={type}
          type="button"
          disabled={disabled}
          onClick={() => onChange(type)}
          className={`min-w-[120px] rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            value === type
              ? "bg-white text-slate-900 shadow-md dark:bg-slate-700 dark:text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {PAGE_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
