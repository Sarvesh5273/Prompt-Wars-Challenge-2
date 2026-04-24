import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are an educational assistant explaining the Indian election process. Answer questions ONLY about the Indian election process. Keep your responses strictly under 3 sentences and use an ELI5 (Explain Like I'm 5) style. If asked about unrelated topics, politely decline and steer the conversation back to Indian elections.",
        temperature: 0.7,
      },
    });

    return NextResponse.json({
      reply: response.text,
    });
  } catch (error: any) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
