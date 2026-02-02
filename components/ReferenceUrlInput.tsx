"use client";

interface ReferenceUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ReferenceUrlInput({ value, onChange, disabled }: ReferenceUrlInputProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span aria-hidden className="text-base">📎</span>
        Reference (optional)
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="https://example-website.com"
        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 dark:border-slate-600 dark:bg-slate-800/80 dark:placeholder-slate-500 dark:focus:border-emerald-500"
      />
      <p className="text-xs text-slate-500 dark:text-slate-450">
        Use as design inspiration (URL is sent to AI for context)
      </p>
    </div>
  );
}
