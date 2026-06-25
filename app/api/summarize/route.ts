import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper function to pause execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are an intelligent AI assistant for a modern Assamese magazine called Jeevan. Provide a highly engaging, concise 3-4 sentence summary of the following article text. Please write the summary in the same language as the article text provided (Assamese or English). Do not use any introductory phrases, just jump straight into the summary:\n\n${text}`;

    // --- THE FIX: SILENT RETRY LOOP ---
    let maxRetries = 3;
    let attempt = 0;
    let summary = "";

    while (attempt < maxRetries) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();
        
        // If we successfully get the summary, break out of the retry loop
        if (summary) break; 

      } catch (err: any) {
        attempt++;
        console.warn(`[Jeevan AI] Attempt ${attempt} failed. Retrying...`, err.message);
        
        // If we've failed 3 times, throw the error to the frontend
        if (attempt >= maxRetries) {
          throw new Error("The AI servers are exceptionally busy right now. Please try again in a few moments.");
        }
        
        // Wait 2.5 seconds before trying again to let the server queue clear
        await delay(2500); 
      }
    }

    if (!summary) {
         return NextResponse.json({ error: "AI returned a response, but the text was empty." }, { status: 500 });
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Backend SDK Crash:", error);
    return NextResponse.json({ error: error.message || "Google SDK Error" }, { status: 500 });
  }
}