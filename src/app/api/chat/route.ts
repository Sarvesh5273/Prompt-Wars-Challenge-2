import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
    });

    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Gemini requires contents to end with a user turn
    // Strip any trailing model messages to prevent double responses
    while (
      formattedContents.length > 0 &&
      formattedContents[formattedContents.length - 1].role === "model"
    ) {
      formattedContents.pop();
    }

    if (formattedContents.length === 0) {
      return NextResponse.json(
        { error: "No valid user message found" },
        { status: 400 }
      );
    }

    let systemInstruction =
      "You are an educational assistant explaining the Indian election process. Answer questions ONLY about the Indian election process. Keep your responses strictly under 3 sentences and use an ELI5 (Explain Like I'm 5) style. If asked about unrelated topics, politely decline and steer the conversation back to Indian elections.";

    if (language === "hi") {
      systemInstruction +=
        " Always respond in Hindi using Devanagari script. Do not use English words except for proper nouns like EVM, NOTA, EC.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return NextResponse.json({ reply });
    
  } catch (error: any) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}