import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    const prompt = `You are an intelligent AI assistant for a modern Assamese magazine called Jeevan. Provide a highly engaging, concise 3-4 sentence summary of the following article text. Do not use any introductory phrases, just jump straight into the summary:\n\n${text}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}