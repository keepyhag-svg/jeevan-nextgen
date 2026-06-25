import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // FIXED: Updated to a currently active model identifier to resolve the 404 Crash
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are an intelligent AI assistant for a modern Assamese magazine called Jeevan. Provide a highly engaging, concise 3-4 sentence summary of the following article text. Please write the summary in the same language as the article text provided (Assamese or English). Do not use any introductory phrases, just jump straight into the summary:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary) {
         return NextResponse.json({ error: "AI returned a response, but the text was empty." }, { status: 500 });
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Backend SDK Crash:", error);
    return NextResponse.json({ error: `Google SDK Error: ${error.message}` }, { status: 500 });
  }
}