"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { CodePanel } from "@/components/CodePanel";
import type { PageType, TemplatePreset } from "@/lib/types";
import type { GeneratedPage } from "@/lib/types";

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

function savePage(page: Omit<GeneratedPage, "id" | "createdAt">) {
  const pages = loadSavedPages();
  const newPage: GeneratedPage = {
    ...page,
    id: `page-${Date.now()}`,
    createdAt: Date.now(),
  };
  pages.unshift(newPage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages.slice(0, 50)));
  return newPage;
}

export default function Home() {
  const [pageType, setPageType] = useState<PageType>("landing");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [preset, setPreset] = useState<TemplatePreset>(null);
  const [code, setCode] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("shopforge-load");
      if (!raw) return;
      const data = JSON.parse(raw);
      sessionStorage.removeItem("shopforge-load");
      if (data.code) setCode(data.code);
      if (data.pageType) setPageType(data.pageType);
      if (data.prompt) setLastPrompt(data.prompt);
    } catch {
      sessionStorage.removeItem("shopforge-load");
    }
  }, []);

  const handleGenerate = useCallback(
    async (params: {
      description: string;
      isRefinement?: boolean;
      previousCode?: string;
    }) => {
      setError(null);
      setPreviewError(null);
      setLoading(true);
      setLastPrompt(params.description);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: params.description,
            pageType,
            referenceUrl: referenceUrl.trim() || undefined,
            preset,
            isRefinement: params.isRefinement,
            previousCode: params.previousCode,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Generation failed");
          return;
        }
        setCode(data.code ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error");
      } finally {
        setLoading(false);
      }
    },
    [pageType, referenceUrl, preset]
  );

  const handleSaveToDashboard = useCallback(() => {
    if (!code || !lastPrompt) return;
    savePage({
      pageType,
      prompt: lastPrompt,
      referenceUrl: referenceUrl.trim() || undefined,
      code,
      preset: preset ?? undefined,
    });
    window.location.href = "/dashboard";
  }, [code, lastPrompt, pageType, referenceUrl, preset]);

  const isApiKeyError =
    error?.toLowerCase().includes("openai_api_key") ||
    error?.toLowerCase().includes("anthropic_api_key") ||
    error?.toLowerCase().includes(".env.local");

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
          <nav className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <div className="flex gap-0.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {(["desktop", "tablet", "mobile"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDevice(d)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                    device === d
                      ? "bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {error && (
          <div
            className={`mb-6 overflow-hidden rounded-2xl border shadow-lg ${
              isApiKeyError
                ? "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-800/50 dark:from-amber-950/40 dark:to-orange-950/30"
                : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
            }`}
          >
            <div className="flex gap-4 p-5">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                  isApiKeyError
                    ? "bg-amber-200/80 text-amber-800 dark:bg-amber-700/50 dark:text-amber-200"
                    : "bg-red-200/80 text-red-800 dark:bg-red-700/50 dark:text-red-200"
                }`}
              >
                {isApiKeyError ? "🔑" : "!"}
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className={`font-semibold ${
                    isApiKeyError
                      ? "text-amber-900 dark:text-amber-100"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {isApiKeyError ? "API key needed to generate websites" : "Something went wrong"}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    isApiKeyError
                      ? "text-amber-800 dark:text-amber-200/90"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {isApiKeyError ? (
                    <>
                      Add one of these to a file named <code className="rounded bg-amber-200/60 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-800/40">.env.local</code> in the
                      project root, then restart the dev server (<code className="rounded bg-amber-200/60 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-800/40">npm run dev</code>):
                    </>
                  ) : (
                    error
                  )}
                </p>
                {isApiKeyError && (
                  <ul className="mt-3 space-y-1 text-sm text-amber-800 dark:text-amber-200/90">
                    <li>• <strong>Claude:</strong> <code className="rounded bg-amber-200/60 px-1 font-mono text-xs dark:bg-amber-800/40">ANTHROPIC_API_KEY=sk-ant-...</code></li>
                    <li>• <strong>OpenAI:</strong> <code className="rounded bg-amber-200/60 px-1 font-mono text-xs dark:bg-amber-800/40">OPENAI_API_KEY=sk-...</code></li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <ChatPanel
              pageType={pageType}
              onPageTypeChange={setPageType}
              referenceUrl={referenceUrl}
              onReferenceUrlChange={setReferenceUrl}
              preset={preset}
              onPresetChange={setPreset}
              onGenerate={handleGenerate}
              loading={loading}
              lastPrompt={lastPrompt}
              lastCode={code ?? undefined}
            />
            </div>
          </aside>

          <div className="flex flex-col gap-6 lg:col-span-8">
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="h-px flex-1 max-w-[60px] rounded-full bg-slate-200 dark:bg-slate-600" />
                Live preview
              </h2>
              <PreviewPanel
                code={code}
                loading={loading}
                error={previewError}
                device={device}
              />
            </section>

            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="h-px flex-1 max-w-[60px] rounded-full bg-slate-200 dark:bg-slate-600" />
                Code
              </h2>
              <CodePanel
                code={code}
                pageType={pageType}
                prompt={lastPrompt}
                onSave={handleSaveToDashboard}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
