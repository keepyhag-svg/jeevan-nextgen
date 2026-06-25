import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required to generate a summary." }, { status: 400 });
    }

    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
       return NextResponse.json({ error: "Cohere API key is missing." }, { status: 500 });
    }

    // Initialize the Cohere client
    const cohere = new CohereClient({
      token: apiKey,
    });

    const prompt = `You are an intelligent AI assistant for a modern Assamese magazine called Jeevan. Provide a highly engaging, concise 3-4 sentence summary of the following article text. Please write the summary in the same language as the article text provided (Assamese or English). Do not use any introductory phrases, just jump straight into the summary:\n\n${text}`;

    // Safest active model identifier for Multilingual generation
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
    });

    const summary = response.text;

    if (!summary) {
         return NextResponse.json({ error: "AI returned a response, but the text was empty." }, { status: 500 });
    }

    return NextResponse.json({ summary });
    
  } catch (error: any) {
    console.error("Cohere SDK Crash:", error);
    return NextResponse.json({ error: `Cohere API Error: ${error.message || "Something went wrong"}` }, { status: 500 });
  }
}