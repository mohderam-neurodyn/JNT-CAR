import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    // Call OpenAI REST API directly
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // set this in Vercel project settings
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // fast & cheap model
        messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI API error:", errText);
      return NextResponse.json(
        { reply: "⚠️ OpenAI API error." },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "⚠️ No response from AI",
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { reply: "⚠️ Something went wrong on the server." },
      { status: 500 }
    );
  }
}
