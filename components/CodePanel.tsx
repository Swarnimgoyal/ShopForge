"use client";

import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import JSZip from "jszip";
import type { PageType } from "@/lib/types";

interface CodePanelProps {
  code: string | null;
  pageType: PageType;
  prompt?: string;
  onSave?: () => void;
}

export function CodePanel({ code, pageType, prompt, onSave }: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleExportZip = useCallback(async () => {
    if (!code) return;
    setExporting(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("shopforge-export");
      if (!folder) return;

      const pageName = pageType === "landing" ? "LandingPage" : "ProductPage";
      const componentCode = code.trim().startsWith("export default")
        ? code
        : `export default function ${pageName}() {\n  return (\n    ${code}\n  );\n}`;

      folder.file("app/page.tsx", `"use client";\n\nimport Page from "./PageComponent";\n\nexport default function Home() {\n  return <Page />;\n}\n`);
      folder.file("app/PageComponent.jsx", componentCode);
      folder.file("app/globals.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`);
      folder.file("app/layout.jsx", `export default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n`);
      folder.file("package.json", JSON.stringify({
        name: "shopforge-export",
        private: true,
        scripts: { dev: "next dev", build: "next build", start: "next start" },
        dependencies: { next: "14", react: "^18", "react-dom": "^18" },
      }, null, 2));
      folder.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ['./app/**/*.{js,ts,jsx,tsx}'],\n  theme: { extend: {} },\n  plugins: [],\n};\n`);
      folder.file("postcss.config.js", `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };\n`);
      folder.file("README.md", `# ShopForge Export\n\nGenerated with ShopForge.\n\n\`npm install\` then \`npm run dev\`\n`);

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shopforge-${pageType}-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [code, pageType]);

  if (!code) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 dark:border-slate-700/50 dark:bg-slate-800/50">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Generated code will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-slate-900/50">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 bg-slate-50/50 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/50">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Code
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            onClick={handleExportZip}
            disabled={exporting}
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {exporting ? "Exporting…" : "Export ZIP"}
          </button>
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="rounded-lg border border-emerald-500/80 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            >
              Save to dashboard
            </button>
          )}
        </div>
      </div>
      <div className="max-h-[320px] overflow-auto p-0">
        <SyntaxHighlighter
          language="jsx"
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: 16,
            fontSize: 12,
            background: "rgb(29 31 33)",
          }}
          showLineNumbers
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
