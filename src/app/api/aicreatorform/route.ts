export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ success: false, message: "Sign in to generate a form." }, { status: 401 });
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, message: "AI form generation is not configured. Add GROQ_API_KEY to the server environment." }, { status: 503 });

    const reqprompt = await req.json();
    const formprompt = typeof reqprompt.reqprompt === "string" ? reqprompt.reqprompt.trim() : "";
    if (!formprompt || formprompt.length > 4000) {
      return NextResponse.json({ success: false, message: "Describe your form in 1 to 4,000 characters." }, { status: 400 });
    }

    const completionResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `Create a complete, useful form from the user's requirements. Return only a valid JSON object with this shape: {"title":"string","description":"string","questions":[{"type":"text|number|email|date|radio|checkbox|file","text":"string","options":[],"isRequired":true}]}. Create 3 to 12 distinct questions. For radio and checkbox types, include at least two concise options. For other types, options must be an empty array. Use only the listed types, keep all text non-empty, and do not include Markdown or explanatory text.`,
          },
          { role: "user", content: formprompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: false,
      }),
      signal: AbortSignal.timeout(60000),
    });

    const completion = await completionResponse.json();
    if (!completionResponse.ok) {
      const error = new Error(completion.error?.message || "Groq request failed") as Error & { status?: number };
      error.status = completionResponse.status;
      throw error;
    }

    const text = completion.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ success: false, message: "Groq returned an empty form draft. Please try again." }, { status: 502 });
    }

    const data = JSON.parse(text);
    if (typeof data.title !== "string" || typeof data.description !== "string" || !Array.isArray(data.questions) || !data.questions.length) {
      return NextResponse.json({ success: false, message: "AI returned an incomplete form. Please refine your prompt and try again." }, { status: 502 });
    }
    const supportedTypes = new Set(["text", "number", "email", "date", "radio", "checkbox", "file"]);
    const questions = data.questions
      .filter((question: any) => question && supportedTypes.has(question.type) && typeof question.text === "string" && question.text.trim())
      .map((question: any) => {
        const isChoice = question.type === "radio" || question.type === "checkbox";
        const options = isChoice && Array.isArray(question.options)
          ? Array.from(new Set(question.options.filter((option: unknown) => typeof option === "string" && option.trim()).map((option: string) => option.trim())))
          : [];
        return {
          type: question.type,
          text: question.text.trim(),
          options: isChoice && options.length >= 2 ? options : isChoice ? ["Option 1", "Option 2"] : [],
          isRequired: question.isRequired !== false,
        };
      });
    if (!questions.length) {
      return NextResponse.json({ success: false, message: "AI returned no valid questions. Please refine your prompt and try again." }, { status: 502 });
    }
    return NextResponse.json({
      success: true,
      data: { title: data.title.trim(), description: data.description.trim(), questions },
    });
  } catch (error) {
    const providerError = error as { status?: number; message?: string; response?: { status?: number } };
    const status = providerError.status ?? providerError.response?.status;
    console.error("Groq form generation failed:", status, providerError.message);

    if (status === 401 || status === 403) {
      return NextResponse.json({ success: false, message: "Groq rejected the API key. Check that GROQ_API_KEY is valid and enabled." }, { status: 503 });
    }
    if (status === 429) {
      return NextResponse.json({ success: false, message: "Groq rate limit or quota reached. Please wait a moment and try again." }, { status: 429 });
    }
    if (status && status >= 500) {
      return NextResponse.json({ success: false, message: "Groq is temporarily unavailable. Please try again shortly." }, { status: 503 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ success: false, message: "Groq returned an invalid form draft. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ success: false, message: "Could not generate a form right now. Please try again." }, { status: 502 });
  }
}
