"use client";

import { useMemo } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

const INDEX_HTML_WITH_TAILWIND = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.jsx"></script>
  </body>
</html>`;

const INDEX_JSX = `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
`;

/**
 * Cleans and transforms AI-generated code into a valid React component for Sandpack.
 */
function normalizeCode(code: string): string {
  let cleaned = code
    .replace(/```(?:jsx|tsx|javascript|js)?([\s\S]*?)```/g, "$1") // Extract code from markdown fences
    .trim();

  // Remove any stray import React statements if the AI included them, 
  // as we will add a clean one at the top.
  cleaned = cleaned.replace(/import\s+React\s+from\s+['"]react['"];?/g, "");

  // 1. If it already has a default export, rename it to 'App' so index.jsx can find it
  if (cleaned.includes("export default")) {
    const exportedNameMatch = cleaned.match(/export default\s+([A-Za-z0-9_]+)/);
    if (exportedNameMatch && exportedNameMatch[1] !== "App") {
      cleaned = cleaned.replace(`export default ${exportedNameMatch[1]}`, "export default App");
      cleaned = cleaned.replace(new RegExp(`(const|function|class)\\s+${exportedNameMatch[1]}`), `$1 App`);
    }
    return `import React from "react";\n${cleaned}`;
  }

  // 2. If it defines a component but doesn't export it (e.g., const Shop = () => ...)
  const componentMatch = cleaned.match(/(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/);
  if (componentMatch) {
    const detectedName = componentMatch[1];
    return `import React from "react";\n${cleaned}\n\nexport default ${detectedName};`;
  }

  // 3. Fallback: If it's just raw JSX fragments/tags, wrap it in a standard App component
  return `
import React from "react";

export default function App() {
  return (
    <>
      ${cleaned}
    </>
  );
}
`;
}

interface PreviewPanelProps {
  code: string | null;
  loading?: boolean;
  error?: string | null;
  device?: "desktop" | "tablet" | "mobile";
}

export function PreviewPanel({
  code,
  loading,
  error,
  device = "desktop",
}: PreviewPanelProps) {
  const files = useMemo(() => {
    const placeholder = `
import React from "react";
export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-8 text-center">
      <p className="text-zinc-500 font-medium">Generate a page to see the live preview.</p>
    </div>
  );
}`;

    if (!code?.trim()) {
      return {
        "/App.jsx": { code: placeholder },
        "/index.jsx": { code: INDEX_JSX },
        "/index.html": { code: INDEX_HTML_WITH_TAILWIND },
      };
    }

    // Process the code through the normalization pipeline
    const appCode = normalizeCode(code);

    return {
      "/App.jsx": { code: appCode },
      "/index.jsx": { code: INDEX_JSX },
      "/index.html": { code: INDEX_HTML_WITH_TAILWIND },
    };
  }, [code]);

  const containerClass = useMemo(() => {
    switch (device) {
      case "mobile":
        return "max-w-[375px] mx-auto shadow-2xl border-x-[8px] border-t-[16px] border-b-[16px] border-black rounded-[3rem]";
      case "tablet":
        return "max-w-[768px] mx-auto border-[4px] border-black rounded-xl";
      default:
        return "w-full";
    }
  }, [device]);

  if (error) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-red-700">Preview Error</p>
          <p className="text-xs text-red-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center bg-white rounded-2xl border">
        <div className="flex flex-col items-center gap-3">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-zinc-400 animate-pulse">Building preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full transition-all duration-300 ease-in-out p-4">
      <div className={`h-full min-h-[500px] overflow-hidden bg-white ${containerClass}`}>
        <SandpackProvider
          template="vite-react"
          files={files}
          customSetup={{ 
            dependencies: { 
              "lucide-react": "latest",
              "framer-motion": "latest"
            } 
          }}
        >
          <SandpackLayout style={{ border: 'none' }}>
            <SandpackPreview 
              style={{ height: "calc(100vh - 250px)", minHeight: 500 }} 
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}