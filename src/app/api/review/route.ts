import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const prompt = `Perform a responsible AI review on the following content for a university campus setting.
    
    Content:
    "${content}"
    
    Analyze for:
    1. Bias: Score (0-100, where 100 is perfectly unbiased) and specific details.
    2. Safety: Pass/Fail status based on campus safety and respect.
    3. Attribution: Suggest 3 potential campus or public sources this content aligns with.
    4. Issues: List any potential red flags.
    
    Return ONLY a JSON object with this structure:
    {
      "bias": { "score": number, "details": string[] },
      "safety": { "status": "pass" | "fail", "issues": string[] },
      "attribution": { "sources": string[] }
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up potential markdown formatting from Gemini
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedResult = JSON.parse(cleanJson);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error("Review API error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze content" }, { status: 500 });
  }
}
