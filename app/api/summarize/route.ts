import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper to pause execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required to generate a summary." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are an intelligent AI assistant for a modern Assamese magazine called Jeevan. Provide a highly engaging, concise 3-4 sentence summary of the following article text. Please write the summary in the same language as the article text provided (Assamese or English). Do not use any introductory phrases, just jump straight into the summary:\n\n${text}`;

    let maxRetries = 3;
    let attempt = 0;
    let summary = "";

    while (attempt < maxRetries) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();
        
        if (summary) break;
      } catch (err: any) {
        attempt++;
        // If it's a rate limit or server busy, wait and try again
        if (attempt < maxRetries) {
          await delay(2000);
          continue;
        }
        // If we exhausted retries, throw the real error
        throw err;
      }
    }

    return NextResponse.json({ summary });
    
  } catch (error: any) {
    console.error("Jeevan API Error:", error);
    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred while generating the summary." 
    }, { status: 500 });
  }
}