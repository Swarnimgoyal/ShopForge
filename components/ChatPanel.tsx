"use client";

import { useState, useCallback } from "react";
import { PageTypeSelector } from "./PageTypeSelector";
import { ReferenceUrlInput } from "./ReferenceUrlInput";
import { TemplatePresetSelector } from "./TemplatePresetSelector";
import type { PageType, TemplatePreset } from "@/lib/types";

interface ChatPanelProps {
  pageType: PageType;
  onPageTypeChange: (v: PageType) => void;
  referenceUrl: string;
  onReferenceUrlChange: (v: string) => void;
  preset: TemplatePreset;
  onPresetChange: (v: TemplatePreset) => void;
  onGenerate: (params: {
    description: string;
    isRefinement?: boolean;
    previousCode?: string;
  }) => Promise<void>;
  loading: boolean;
  lastPrompt?: string;
  lastCode?: string;
}

export function ChatPanel({
  pageType,
  onPageTypeChange,
  referenceUrl,
  onReferenceUrlChange,
  preset,
  onPresetChange,
  onGenerate,
  loading,
  lastPrompt,
  lastCode,
}: ChatPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || loading) return;
      setInput("");
      const isRefinement =
        /^(make|change|add|switch|update|refine|fix|remove|bigger|smaller|darker|lighter)/i.test(
          text
        ) && !!lastCode;
      await onGenerate({
        description: text,
        isRefinement,
        previousCode: isRefinement ? lastCode : undefined,
      });
    },
    [input, loading, onGenerate, lastCode]
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-slate-900/50">
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3 dark:from-emerald-500/20 dark:to-teal-500/20">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-bold text-white shadow-md shadow-emerald-500/30">
          S
        </span>
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">ShopForge</h2>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            AI Shop Generator
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Page type
          </label>
          <PageTypeSelector
            value={pageType}
            onChange={onPageTypeChange}
            disabled={loading}
          />
        </div>

        <ReferenceUrlInput
          value={referenceUrl}
          onChange={onReferenceUrlChange}
          disabled={loading}
        />

        <TemplatePresetSelector
          value={preset}
          onChange={onPresetChange}
          disabled={loading}
        />

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Describe your shop
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="e.g. A premium coffee subscription called 'Morning Ritual'. Dark, moody aesthetic with gold accents. Hero, features, pricing, testimonials."
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 dark:border-slate-600 dark:bg-slate-800/80 dark:placeholder-slate-500 dark:focus:border-emerald-500 dark:focus:bg-slate-800"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating…
              </>
            ) : (
              <>
                Generate
                <span aria-hidden className="text-base">→</span>
              </>
            )}
          </button>
        </form>
      </div>

      <p className="mt-5 rounded-lg bg-slate-50/80 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
        Tip: After generating, refine with &quot;Make the hero bigger&quot; or &quot;Change to blue theme&quot;.
      </p>
    </div>
  );
}
