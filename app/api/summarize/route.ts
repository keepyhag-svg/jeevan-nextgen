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

    // 1. Initialize the official Google SDK (This bypasses the v1beta URL errors completely)
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Safely call the standard flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an intelligent AI assistant for a modern Assamese magazine called Jeevan. Provide a highly engaging, concise 3-4 sentence summary of the following article text. Please write the summary in the same language as the article text provided (Assamese or English). Do not use any introductory phrases, just jump straight into the summary:\n\n${text}`;

    // 3. Generate the response securely
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary) {
         return NextResponse.json({ error: "AI returned a response, but the text was empty." }, { status: 500 });
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Backend SDK Crash:", error);
    // The SDK provides perfectly formatted error messages if anything goes wrong
    return NextResponse.json({ error: `Google SDK Error: ${error.message}` }, { status: 500 });
  }
}