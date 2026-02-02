import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { description, pageType = "landing" } = await req.json();

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // required
        "X-Title": "ShopForge",                  // required
      },
    });

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // safest to start
      messages: [
        {
          role: "system",
          content:
            "Generate a single React component using Tailwind CSS only. Do not include explanations.",
        },
        {
          role: "user",
          content: description,
        },
      ],
      max_tokens: 1500,
      temperature: 0.6,
    });

    return NextResponse.json({
      code: completion.choices[0]?.message?.content ?? "",
    });
  } catch (err) {
    console.error("OpenRouter error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
