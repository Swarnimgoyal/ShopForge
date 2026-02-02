# ShopForge — AI Shop Website Generator

**Describe your shop, pick a page type, get a website.**

ShopForge is an AI-inspired website generator where users describe their shop in natural language, choose a page type (Landing Page or Product Page), and instantly get a production-ready shop page with a live preview, generated code, and export support.

> ⚠️ Note: The AI generation layer is mocked for stability and cost reasons, while preserving a real-world, provider-agnostic architecture.

---

## Features

- **Chat-style generator UI**
  - Page type selector (Landing / Product)
  - Template presets (Minimalist, Bold, Luxury, Playful)
  - Natural-language description input
  - Loading and error states

- **AI-inspired generation (Mocked)**
  - Prompt-driven layout and style detection
  - Dynamic JSX + Tailwind CSS generation
  - Supports iterative refinements such as:
    - “Make it more luxury”
    - “Change to dark theme”
    - “Convert to a product page”

- **Live preview**
  - Sandpack-powered sandboxed preview
  - Tailwind CSS via CDN
  - Desktop / Tablet / Mobile device toggles
  - Preview errors never crash the main UI

- **Code panel**
  - Generated React component
  - Syntax highlighting
  - Copy code
  - Export as ZIP (Next.js App Router project)

- **Dashboard**
  - Save generated pages in localStorage
  - Re-open pages in the generator
  - Delete or copy saved code

- **Reference URL input (UI only)**
  - Optional design inspiration field
  - Used as contextual text (no scraping or analysis)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Preview sandbox:** Sandpack (React + Vite)
- **Code highlighting:** react-syntax-highlighter (Prism)
- **Export:** JSZip
- **AI layer:** Mock AI generator (prompt-driven logic)

---

## Running Locally

1. **Install dependencies**
   ```bash
   npm install
