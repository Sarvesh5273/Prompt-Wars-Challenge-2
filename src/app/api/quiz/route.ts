import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { language } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro",
      contents: `Generate exactly 5 multiple choice questions about the Indian election process. Return ONLY valid JSON, no markdown, no explanation. Format: { questions: [ { question: string, options: string[4], correctIndex: number, explanation: string } ] }. Make questions educational and progressively harder. When language is ${language}, write all questions, options and explanations in Hindi using Devanagari script.`,
      config: {
        systemInstruction: "You are a quiz generator about the Indian election process.",
        temperature: 0.7,
      },
    });

    try {
      const text = (response.text ?? '').replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      throw parseError; // Fallback will be handled in catch block
    }
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    // Fallback quiz
    return NextResponse.json({
      questions: [
        {
          question: "What does EVM stand for in the Indian election process?",
          options: ["Electronic Voting Machine", "Electoral Verification Method", "Election Voting Management", "Electronic Voter Matrix"],
          correctIndex: 0,
          explanation: "EVM stands for Electronic Voting Machine, which is used to record votes securely."
        },
        {
          question: "Which independent body is responsible for conducting elections in India?",
          options: ["The Supreme Court", "The Parliament", "Election Commission of India (ECI)", "Ministry of Home Affairs"],
          correctIndex: 2,
          explanation: "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India."
        },
        {
          question: "What is the 'Model Code of Conduct'?",
          options: ["A dress code for politicians", "Guidelines for political parties and candidates during elections", "A guide for voters on how to dress", "Rules for news channels only"],
          correctIndex: 1,
          explanation: "The Model Code of Conduct is a set of guidelines issued by the ECI to regulate political parties and candidates prior to elections."
        }
      ]
    });
  }
}
