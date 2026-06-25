import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required to generate a summary." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       return NextResponse.json({ error: "API key is missing in Vercel." }, { status: 500 });
    }

    const prompt = `You are an intelligent AI assistant for a modern Assamese magazine called Jeevan. Provide a highly engaging, concise 3-4 sentence summary of the following article text. Please write the summary in the same language as the article text provided (Assamese or English). Do not use any introductory phrases, just jump straight into the summary:\n\n${text}`;

    // THE FIX: Added "-latest" to the model name in the URL
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
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

    if (data.error) {
        console.error("Google API Error:", data.error);
        return NextResponse.json({ error: `Google API Error: ${data.error.message}` }, { status: 500 });
    }

    if (!data.candidates || data.candidates.length === 0) {
        console.error("AI Blocked or empty:", data);
        return NextResponse.json({ error: "Google AI blocked the response (possible safety filter trigger)." }, { status: 500 });
    }

    const summary = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!summary) {
         return NextResponse.json({ error: "AI returned a response, but the text was empty." }, { status: 500 });
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Backend Crash:", error);
    return NextResponse.json({ error: error.message || "The server crashed while contacting Google." }, { status: 500 });
  }
}