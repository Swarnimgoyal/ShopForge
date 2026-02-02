export type PageType = "landing" | "product";

export type TemplatePreset = "minimalist" | "bold" | "luxury" | "playful" | null;

export interface GeneratedPage {
  id: string;
  pageType: PageType;
  prompt: string;
  referenceUrl?: string;
  code: string;
  createdAt: number;
  preset?: TemplatePreset;
  history?: { prompt: string; code: string }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export const PAGE_TYPE_LABELS: Record<PageType, string> = {
  landing: "Landing Page",
  product: "Product Page",
};

export const PRESET_LABELS: Record<NonNullable<TemplatePreset>, string> = {
  minimalist: "Minimalist",
  bold: "Bold",
  luxury: "Luxury",
  playful: "Playful",
};
