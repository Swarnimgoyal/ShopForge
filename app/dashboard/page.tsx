"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PAGE_TYPE_LABELS, type GeneratedPage } from "@/lib/types";

const STORAGE_KEY = "shopforge-pages";

function loadSavedPages(): GeneratedPage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function deletePage(id: string) {
  const pages = loadSavedPages().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

export default function DashboardPage() {
  const [pages, setPages] = useState<GeneratedPage[]>([]);
  const [selected, setSelected] = useState<GeneratedPage | null>(null);

  useEffect(() => {
    setPages(loadSavedPages());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deletePage(id);
    setPages(loadSavedPages());
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="app-bg min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
              S
            </span>
            ShopForge
          </Link>
          <nav>
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Generator
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Your saved generated pages (stored in this browser).
        </p>

        {pages.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xl shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-slate-900/50">
            <p className="text-slate-500 dark:text-slate-400">
              No saved pages yet. Generate a page and click &quot;Save to
              dashboard&quot; to add it here.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40"
            >
              Go to Generator
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ul className="space-y-2">
                {pages.map((page) => (
                  <li key={page.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(page)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition-all ${
                        selected?.id === page.id
                          ? "border-emerald-500 bg-emerald-50 shadow-md dark:border-emerald-500/70 dark:bg-emerald-900/20"
                          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {page.prompt.slice(0, 40)}
                        {page.prompt.length > 40 ? "…" : ""}
                      </span>
                      <span className="shrink-0 rounded-lg bg-slate-200 px-2 py-0.5 text-xs font-medium dark:bg-slate-700">
                        {PAGE_TYPE_LABELS[page.pageType]}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, page.id)}
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                        aria-label="Delete"
                      >
                        ×
                      </button>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              {selected ? (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-slate-900/50">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold dark:bg-slate-800">
                      {PAGE_TYPE_LABELS[selected.pageType]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(selected.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                    {selected.prompt}
                  </p>
                  <div className="max-h-[400px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800">
                    <pre className="whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200">
                      {selected.code}
                    </pre>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selected.code);
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      Copy code
                    </button>
                    <Link
                      href="/"
                      onClick={() => {
                        sessionStorage.setItem(
                          "shopforge-load",
                          JSON.stringify({
                            code: selected.code,
                            pageType: selected.pageType,
                            prompt: selected.prompt,
                          })
                        );
                      }}
                      className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                    >
                      Open in generator
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700/50 dark:bg-slate-900/95">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Select a page to view code.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
