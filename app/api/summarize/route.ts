import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper to pause execution for the retry loop
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required to generate a summary." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       return NextResponse.json({ error: "Gemini API key is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are an intelligent AI assistant for a modern Assamese magazine called Jeevan. Provide a highly engaging, concise 3-4 sentence summary of the following article text. Please write the summary in the same language as the article text provided (Assamese or English). Do not use any introductory phrases, just jump straight into the summary:\n\n${text}`;

    // --- THE FIX: SILENT RETRY LOOP FOR 503 ERRORS ---
    let maxRetries = 3;
    let attempt = 0;
    let summary = "";

    while (attempt < maxRetries) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();
        
        if (summary) break; // Success! Exit the loop.

      } catch (err: any) {
        attempt++;
        console.warn(`[Jeevan AI] Attempt ${attempt} failed. Retrying...`, err.message);
        
        if (attempt >= maxRetries) {
          throw new Error("The AI servers are exceptionally busy right now. Please try again in a few moments.");
        }
        
        await delay(2000); // Wait 2 seconds before knocking on Google's door again
      }
    }

    if (!summary) {
         return NextResponse.json({ error: "AI returned an empty response." }, { status: 500 });
    }

    return NextResponse.json({ summary });
    
  } catch (error: any) {
    console.error("Backend SDK Crash:", error);
    return NextResponse.json({ error: error.message || "Google API Error" }, { status: 500 });
  }
}