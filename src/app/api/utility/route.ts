import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function POST(req: Request) {
  try {
    const { template, values } = await req.json();

    if (!template) {
      return NextResponse.json({ error: "Template is required" }, { status: 400 });
    }

    let finalPrompt = template;
    for (const [key, value] of Object.entries(values)) {
      finalPrompt = finalPrompt.replace(new RegExp(`\\[${key}\\]`, "g"), value as string);
    }

    const prompt = `You are a specialized campus AI utility. 
    Role: ${finalPrompt}
    
    Instruction: Generate a helpful, concise, and professional response based on the above role.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("Utility API error:", error);
    return NextResponse.json({ error: error.message || "Failed to run utility" }, { status: 500 });
  }
}
