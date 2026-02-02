import type { PageType, TemplatePreset } from "./types";

const BASE_RULES = `
- Output ONLY valid React (no Next.js). Use standard React and JSX.
- Use Tailwind CSS for ALL styling. No inline styles or CSS files.
- Use only: React, JSX, Tailwind class names. No "next/image", no "next/link". Use <img> and <a> instead.
- Single default export: export default function Page() { return (...); }
- Mobile-responsive: use Tailwind responsive prefixes (sm:, md:, lg:).
- No external API calls or useState/useEffect unless needed for a simple UI toggle.
- Output only the code, no markdown fences or explanation.
`.trim();

const LANDING_STRUCTURE = `
Landing page must include these sections in order:
1. Navigation bar (sticky or static)
2. Hero section (headline, subheadline, CTA button)
3. Features/benefits grid (at least 3 items)
4. Pricing table (at least 2 tiers)
5. Testimonials (at least 2)
6. Call-to-action section
7. Footer (links, copyright)
`.trim();

const PRODUCT_STRUCTURE = `
Product page must include:
1. Navigation bar
2. Product image gallery (or single image with placeholder)
3. Product title and short description
4. Price display
5. Add to cart button
6. Product details/specs (list or table)
7. Reviews section (placeholder or 1-2 review cards)
8. Footer
`.trim();

function getPresetHint(preset: TemplatePreset): string {
  if (!preset) return "";
  const hints: Record<NonNullable<TemplatePreset>, string> = {
    minimalist: "Minimalist: lots of whitespace, simple typography, few colors, clean lines.",
    bold: "Bold: strong colors, large typography, high contrast, confident layout.",
    luxury: "Luxury: elegant fonts, gold/dark accents, refined spacing, premium feel.",
    playful: "Playful: rounded corners, bright colors, friendly tone, soft shadows.",
  };
  return `Design style: ${hints[preset]}`;
}

export function getSystemPrompt(pageType: PageType, preset: TemplatePreset): string {
  const structure = pageType === "landing" ? LANDING_STRUCTURE : PRODUCT_STRUCTURE;
  const presetHint = getPresetHint(preset);
  return [
    "You are an expert React and Tailwind CSS developer. Generate a complete, production-ready single-page component.",
    BASE_RULES,
    `Page type: ${pageType === "landing" ? "Landing Page" : "Product Page"}.`,
    structure,
    presetHint,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildUserPrompt(
  description: string,
  pageType: PageType,
  referenceUrl?: string,
  isRefinement?: boolean,
  previousCode?: string
): string {
  const parts: string[] = [];
  if (referenceUrl) {
    parts.push(`Reference website (use as design inspiration): ${referenceUrl}`);
  }
  if (isRefinement && previousCode) {
    parts.push("Previous code (modify according to the user's request):");
    parts.push(previousCode);
    parts.push("\nUser refinement request:");
  }
  parts.push(description.trim());
  return parts.join("\n\n");
}
